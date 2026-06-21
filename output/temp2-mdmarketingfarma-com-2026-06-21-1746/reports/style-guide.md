# Style Guide — temp2.mdmarketingfarma.com ("500 Prompts — Influencer de IA")

Estética: **dark brutalist-tech**. Fundo quase preto com glow verde-ácido sangrando das bordas, tipografia geométrica em CAIXA ALTA, detalhes/contadores em monospace, destaque ácido `#d1ff00`. React SPA (estilos inline, sem CSS externo).

## Cores (HEX · RGB)
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#050505` · rgb(5,5,5) | fundo geral |
| `--surface` | `#0a0a0c` / `#0f0f11` | cards, blocos |
| `--text` | `#f4f4e8` · rgb(244,244,232) | texto principal (creme) |
| `--muted` | `#9c9c9c` · rgb(156,156,156) | texto secundário |
| `--muted-2` | `rgba(245,240,235,.6)` | subtítulos |
| `--accent` (lime) | `#d1ff00` · rgb(209,255,0) | CTAs, destaques, números |
| `--accent-glow` | `rgba(209,255,0,.06/.12/.28/.3/.4/.6)` | brilhos, bordas, halos |
| `--danger` | `#ff4444` · rgb(255,68,68) | "❌ prompt genérico", métricas ruins |
| `--border` | `rgba(156,156,156,.15)` | divisórias/bordas de card |
| `--border-2` | `rgba(255,255,255,.08)` | bordas sutis |
| `--ink` | `#000` | texto sobre o lime |

## Tipografia
- **Space Grotesk** — headings e body. H1/H2 em **CAIXA ALTA**, peso 700–900, line-height apertado. Destaques de palavra em `--accent`.
- **Space Mono** (`"Space Mono","Roboto Mono",monospace`) — rótulos, contadores ("04 / 06"), badges e **texto dos botões** (uppercase, letter-spacing ~1.4px).
- **Barlow** — aparece como fallback/secundária em alguns blocos.
- Fonte via Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`).

## Botão CTA (primário)
```
background:#d1ff00; color:#050505; border-radius:999px;
padding:0 36px (pílula, altura ~52px); 
font:700 14px "Space Mono",monospace; text-transform:uppercase; letter-spacing:1.4px;
box-shadow: 0 4px 20px rgba(209,255,0,.15);  /* glow sutil */
```
Variante secundária (ex.: "ENTRAR NO PLANO BÁSICO"): fundo transparente + borda, mesmo formato pílula.

## Layout
- Mobile-first, coluna central, largura de leitura estreita.
- Glow radial verde no topo/bordas sobre fundo preto.
- Imagens em proporção **4/5** (carrossel) com setas circulares (translúcidas) e contador mono "NN / NN".
- Bônus em thumbs **16/9** (1550×866).
- Seções separadas por bastante respiro vertical + bordas finas `rgba(156,156,156,.15)`.

## Componentes observados
- **Carrossel hero** (6 imagens, setas circulares, contador mono).
- **Before/After com métricas** (barras: Realismo 10% vermelho vs alto verde).
- **Grid de exemplos** (9 imagens) + bloco **+18 com blur**.
- **Cards de passo** numerados (01–04, número em mono/lime).
- **Cards de bônus** (thumb 16/9 + de R$X riscado → GRÁTIS).
- **Tabela de planos** (Básico vs Completo "⭐ MAIS ESCOLHIDO", preço riscado).
- **FAQ accordion**.
- **Sticky/!** CTA lime repetido ao longo da página.
