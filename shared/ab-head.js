/* CÓPIA de maguetta/taml-funis public/shared/ab-head.js (PR #33), com data-endpoint para logar no funis. Mudou lá = copiar aqui. */
/* A/B de chamada da 1ª dobra (C12, cruzamento de 22/11/2026). Orgânico, nas páginas NOSSAS; não é teste pago.
 * A = chamada que já está no ar. B = "crie e monetize a SUA modelo de IA. Sem ComfyUI, sem GPU, em 3 toques."
 * (molde dos anúncios que duram 218-243 dias na Biblioteca: Phantom AI OFM, AI Video Skool). A foto da 1ª tela é a mesma.
 *
 * Só carrega com a flag AB_HEAD_C12 ligada no servidor; sem a flag este arquivo nem entra na página.
 *  - Sorteio 50/50 por visitante, fixo em cookie (taml_ab_c12 = a|b, 1 ano). Sem cookie, vale o sorteio da carga.
 *  - A variante vai em utm_term (ab_head_a | ab_head_b) nos links de cadastro (/login), do Pack (/pack/xx) e de checkout,
 *    SÓ quando o link ainda não tem utm_term (o utm_term de anúncio nunca é sobrescrito).
 *  - Exposição e cliques vão ao log do servidor (POST /ab/c12, sendBeacon): exposicao, inicio, cta, upsell.
 *  - QA: ?abhead=a ou ?abhead=b força a variante naquela carga, sem cookie e sem log.
 * Expõe window.tamlAbHead = { variant, term, copy, qa } antes de a página montar a 1ª dobra.
 * Elementos [data-ab-head-slot] (páginas estáticas) ficam escondidos e só aparecem na B.
 * Uso: <script src="/shared/ab-head.js?v=..." data-pagina="criar-en"></script> (síncrono, antes do script da página)
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var pagina = ((script && script.getAttribute('data-pagina')) || 'pagina').replace(/[^a-z0-9_-]/gi, '').slice(0, 24);
  var COOKIE = 'taml_ab_c12';
  var TERM = { a: 'ab_head_a', b: 'ab_head_b' };
  var COPY = {
    pt: { h: 'Crie e monetize', em: 'a SUA modelo de IA', s: 'Sem ComfyUI, sem GPU, em 3 toques.' },
    es: { h: 'Crea y monetiza', em: 'TU modelo de IA', s: 'Sin ComfyUI, sin GPU, en 3 toques.' },
    en: { h: 'Create and monetize', em: 'YOUR AI model', s: 'No ComfyUI, no GPU, 3 taps.' }
  };
  var lang = String(document.documentElement.getAttribute('lang') || 'en').slice(0, 2).toLowerCase();
  if (!COPY[lang]) lang = 'en';

  function readCookie() {
    try {
      var m = new RegExp('(?:^|; )' + COOKIE + '=([ab])(?:;|$)').exec(document.cookie || '');
      return m ? m[1] : '';
    } catch (e) { return ''; }
  }
  function writeCookie(value) {
    try {
      document.cookie = COOKIE + '=' + value + '; Max-Age=31536000; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) { /* sem cookie: vale o sorteio desta carga */ }
  }

  var forced = '';
  try { forced = String(new URLSearchParams(location.search).get('abhead') || '').toLowerCase(); } catch (e) { forced = ''; }
  var qa = forced === 'a' || forced === 'b';
  var variant = qa ? forced : readCookie();
  if (variant !== 'a' && variant !== 'b') {
    variant = Math.random() < 0.5 ? 'b' : 'a';
    writeCookie(variant);
  }
  var copy = variant === 'b' ? COPY[lang] : null;
  window.tamlAbHead = { variant: variant, term: TERM[variant], copy: copy, qa: qa };

  // Log do servidor: uma vez por evento e por carga. text/plain evita preflight (sendBeacon também funciona entre domínios).
  var sent = {};
  var endpoint = (script && script.getAttribute('data-endpoint')) || ((script && script.src ? new URL(script.src, location.href).origin : location.origin) + '/ab/c12');
  function beacon(evento) {
    if (qa || sent[evento]) return;
    sent[evento] = true;
    try {
      var body = JSON.stringify({ evento: evento, variante: variant, pagina: pagina, lang: lang });
      if (navigator.sendBeacon) navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain' }));
      else fetch(endpoint, { method: 'POST', body: body, headers: { 'content-type': 'text/plain' }, keepalive: true });
    } catch (e) { /* log é só leitura do teste: nunca atrapalha a página */ }
  }

  function kindOf(url) {
    if (/\/login\/?$/.test(url.pathname)) return 'login';
    if (/^\/(?:18\/)?pack\/(?:pt|es|en)\/?$/.test(url.pathname) && url.origin === location.origin) return 'pack';
    if (/(^|\.)(centerpag\.com|perfectpay\.com\.br|cakto\.com\.br)$/.test(url.hostname)) return 'checkout';
    return '';
  }
  function decorate(anchor) {
    try {
      var href = anchor.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var url = new URL(href, location.href);
      var kind = kindOf(url);
      if (!kind || url.searchParams.get('utm_term')) return;
      url.searchParams.set('utm_term', TERM[variant]);
      anchor.setAttribute('href', kind === 'pack' ? url.pathname + url.search + url.hash : url.toString());
    } catch (e) { /* href fora do padrão: fica como está */ }
  }
  function decorateAll() {
    var anchors = document.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) decorate(anchors[i]);
  }
  function fillSlots() {
    if (!copy) return;
    var slots = document.querySelectorAll('[data-ab-head-slot]');
    for (var i = 0; i < slots.length; i++) {
      slots[i].textContent = copy.h + ' ' + copy.em + '. ' + copy.s;
      slots[i].removeAttribute('hidden');
    }
  }
  function onTouch(event) {
    var target = event.target;
    var anchor = target && target.closest ? target.closest('a[href]') : null;
    if (anchor) decorate(anchor);
  }
  function onClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;
    if (target.closest('[data-go]')) beacon('inicio');
    if (target.closest('a[data-cta="conta"]')) beacon('cta');
    if (target.closest('a[data-upsell]')) beacon('upsell');
  }

  function ready() { fillSlots(); decorateAll(); beacon('exposicao'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
  document.addEventListener('click', onTouch, true);
  document.addEventListener('auxclick', onTouch, true);
  document.addEventListener('touchstart', onTouch, { capture: true, passive: true });
  document.addEventListener('click', onClick, true);
})();
