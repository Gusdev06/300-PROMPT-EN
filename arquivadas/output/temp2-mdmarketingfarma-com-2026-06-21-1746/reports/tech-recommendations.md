# Tech Recommendations

Original = **React SPA** (estilos inline, bundle ~690KB de DOM, Google Fonts Space Grotesk/Space Mono/Barlow, FB Pixel + UTMify, hospedado em HostGator estático).

## Para reconstruir
- **Mais simples (recomendado p/ este caso):** HTML único + CSS inline (igual às páginas en-new2/es-new1 do projeto). Carrega rápido, fácil de hospedar, sem build. Replica 100% o visual.
- **Se quiser componentizar:** Next.js (App Router) + Tailwind. Tokens: mapear as cores da tabela do style-guide em CSS vars. Fontes via `next/font` (Space Grotesk + Space Mono).
- **Animações:** o original é leve (fade/slide simples). IntersectionObserver basta; não precisa Framer/GSAP.
- **Carrossel:** simples (track flex + setas + contador mono), sem libs.

## Anti-bot / obstáculos
- Nenhum bloqueio (sem Cloudflare/captcha). Playwright navegou livremente. `noindex` apenas.

## Observação de fidelidade
Tokens capturados de estilos computados (reais), não aspiracionais. Cores-chave: bg `#050505`, texto `#f4f4e8`, accent `#d1ff00`, danger `#ff4444`.
