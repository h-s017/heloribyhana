(() => {
  'use strict';

  if (navigator.doNotTrack === '1') return;
  if (!window.supabase) return;

  const db = window.supabase.createClient('https://uzqaodfmnrjrsbvxhlmh.supabase.co', 'sb_publishable_3ukkjs-QtgauXjmOrcDAVg_XBWzh2rd');
  const TABLE = 'analytics_events';
  const SESSION_KEY = 'hana_analytics_session_id';
  const SOURCE_KEY = 'hana_analytics_source';

  function sessionId() {
    try {
      let id = localStorage.getItem(SESSION_KEY);
      if (!id) {
        id = (crypto?.randomUUID?.() || `hana-${Date.now()}-${Math.random().toString(16).slice(2)}`);
        localStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (_) {
      return `hana-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  }

  function sourceFromUrl() {
    const params = new URLSearchParams(location.search);
    const raw = `${params.get('utm_source') || ''} ${params.get('source') || ''} ${params.get('ref') || ''}`.toLowerCase();
    const ref = (document.referrer || '').toLowerCase();
    const haystack = `${raw} ${ref}`;
    if (/instagram|ig|l\.instagram/.test(haystack)) return 'Instagram';
    if (/line|lin\.ee|liff/.test(haystack)) return 'LINE';
    if (/google|gclid/.test(haystack)) return 'Google';
    if (!ref && !raw) return 'Direct';
    try {
      if (ref.includes(location.hostname) || ref.includes('hanascent.com') || ref.includes('github.io')) return localStorage.getItem(SOURCE_KEY) || 'Direct';
    } catch (_) {}
    return 'Other';
  }

  const source = sourceFromUrl();
  try { localStorage.setItem(SOURCE_KEY, source); } catch (_) {}

  function cleanPath() {
    const allowed = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'source', 'ref']);
    const params = new URLSearchParams(location.search);
    const kept = new URLSearchParams();
    allowed.forEach(key => {
      const value = params.get(key);
      if (value) kept.set(key, value);
    });
    const query = kept.toString();
    return `findyourhelori.hanascent.com${location.pathname}${query ? `?${query}` : ''}`.slice(0, 500);
  }

  async function track(eventType, options = {}) {
    try {
      await db.from(TABLE).insert({
        created_at: new Date().toISOString(),
        page: 'helori_quiz',
        event_type: eventType,
        source,
        result_type: options.result_type || null,
        session_id: sessionId(),
        path: cleanPath(),
        referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        user_agent: navigator.userAgent ? navigator.userAgent.slice(0, 500) : null,
        metadata: options.metadata || {}
      });
    } catch (error) {
      console.warn('[Helori analytics]', error?.message || error);
    }
  }

  async function legacyPageView() {
    try {
      await db.from('page_views').insert({
        path: cleanPath(),
        page_type: 'helori_quiz',
        referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        user_agent: navigator.userAgent ? navigator.userAgent.slice(0, 500) : null
      });
    } catch (error) {
      console.warn('[Helori page views]', error?.message || error);
    }
  }

  function currentResultName() {
    return (document.querySelector('#resName')?.textContent || '').trim() || null;
  }

  let completedResult = null;
  const resultObserver = new MutationObserver(() => {
    const resultScreen = document.querySelector('#result');
    if (!resultScreen?.classList.contains('active')) return;
    const name = currentResultName();
    if (!name || completedResult === name) return;
    completedResult = name;
    track('quiz_complete', { result_type: name });
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#startBtn')?.addEventListener('click', () => track('quiz_start'), { capture: true });
    document.querySelector('#sendResultBtn')?.addEventListener('click', () => track('click_line', { result_type: currentResultName(), metadata: { intent: 'intro' } }), { capture: true });
    document.querySelector('#discountBtn')?.addEventListener('click', () => track('click_discount', { result_type: currentResultName(), metadata: { intent: 'discount' } }), { capture: true });
    document.querySelector('#shareBtn')?.addEventListener('click', () => track('share_quiz', { result_type: currentResultName(), metadata: { location: 'result' } }), { capture: true });
    document.querySelector('#shareLandingBtn')?.addEventListener('click', () => track('share_quiz', { metadata: { location: 'landing' } }), { capture: true });

    document.querySelectorAll('a[href]').forEach(anchor => {
      anchor.addEventListener('click', () => {
        const href = anchor.getAttribute('href') || '';
        if (/helori\.hanascent\.com|hanascent\.com\/helori|courses|reservation/i.test(href)) {
          track('click_course', { result_type: currentResultName(), metadata: { href } });
        }
      }, { capture: true });
    });

    const shell = document.querySelector('.shell') || document.body;
    resultObserver.observe(shell, { attributes: true, childList: true, subtree: true, characterData: true });

    const sendView = () => { track('view'); legacyPageView(); };
    if ('requestIdleCallback' in window) requestIdleCallback(sendView, { timeout: 2500 });
    else window.setTimeout(sendView, 1200);
  });
})();
