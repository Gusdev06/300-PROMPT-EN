# Página de teste — `en-hot/` (variante CRO) · 2026-07-19

Variante da página de vendas EN pra **A/B contra a `en/` atual**. Mesmo produto, mesmo
checkout, mesmo pixel — muda a **abordagem** (tese de CRO).

## Tese (por que deve converter mais)
Tráfego = 79% Instagram mobile, homem, impulso, cético. A `en/` atual é forte porém
longa e "educativa". Esta é **proof-forward + message-match agressivo + menos fricção**:

1. **Hero = reveal + preço + CTA numa tela** — "SHE'S NOT REAL" bate direto com os
   anúncios campeões (money-reveal / faceless / no-skills). Continuidade anúncio→página.
2. **Prova jogada pro topo** (prints de ganho + 4 depoimentos logo após o hero) —
   credibilidade antes de promessa (princípio nº1 do low-ticket).
3. **Objeções demolidas em bloco escaneável** (ban / cara troca / não sei de IA /
   anonimato / é legal?) — mesmos ângulos que estamos testando nos criativos.
4. **Sticky buy bar** sempre visível (preço + CTA) — reduz fricção no mobile.
5. **Ancoragem itemizada** ($193 → $12.99) + 2 planos (Basic $6.99 / Complete $12.99 "best value").
6. **Mais rápida** — image-first, CSS inline, JS mínimo (sem autoplay de vídeo pesado).

## Infra herdada (idêntica à `en/` — teste justo)
- Pixel Meta `1223791793200733` + eventos ViewContent/InitiateCheckout (Basic 6.99 / Complete 12.99).
- UTMify (utms + pixel `6a2b0f26049323753c49905e`) e GA4 `G-1KQL6DSS04`.
- Checkout: Basic → `centerpag.com/pay/PPU38CQCKMF` · Complete → `PPU38CQCKMH`.
- `content_category` do IC marcado como `ckt_hot` pra separar a variante no relatório.

## Como subir o A/B
Deploy no mesmo projeto Vercel (a pasta já é irmã de `en/`). A página fica em
`gusta.promptsgoat.com/en-hot/`. Aí: apontar **1 adset/idioma pra `/en-hot`** e comparar
CVR/CPA contra os que vão pra `/en` (mesmo criativo dos dois lados = leitura limpa da página).
Ou usar split de tráfego 50/50 se preferir.

## Slots pra você validar antes de escalar
- **Imagens de prova** (`newimages/proof-1..4.png`) e **depoimentos** (Lucas/Ryan/Daniel/Marco)
  foram reaproveitados da `en/` atual — confirma que continuam sendo prova real/honesta.
- **Timer de launch price** (15min por sessão) — é honesto (some ao zerar, não é countdown
  falso perpétuo). Ajuste/remova se quiser.
- **Números de valor** na ancoragem ($47 uncensored AI, $29 licença etc.) são estimativas
  de ancoragem — ajuste se tiver valores oficiais.
- Confere no celular real e passa o olho na política do checkout/idade.

Arquivo: `en-hot/index.html` (self-contained; assets copiados de `en/`).
