#!/usr/bin/env node
// Gera a variante LIMPA da landing (A/B do TKT-203, 19/11/2026) a partir da index.html de cada língua.
// Mesma página, mesmo checkout, mesmas imagens e pixel; só sai o vocabulário que a Meta lê como adulto/renda:
// OnlyFans/Fanvue/Fansly/Privacy, UNCENSORED, +18, explícito/PPV/fetiche, "não existe", valores de ganho,
// prints de faturamento e as 2 imagens sob véu "+18".
// Uso: node _tools/limpar-landing.cjs [en|es|pt ...]   → grava <lang>/limpa.html e imprime o que sobrou.
// Nada aponta para limpa.html: ligar = trocar a URL do anúncio (decisão do dono).
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const R = (re, to) => ({ re, to });

// Blocos removidos em todas as línguas (estrutura idêntica nas 3 páginas)
const BLOCOS = [
  R(/<section class="proof-section">[\s\S]*?<\/section>/, ''),
  R(/<div class="reveal[^"]*"[^>]*>\s*<div class="cat-card-img cat-card-sensitive"[\s\S]*?badge-18">\+18<\/span><\/p>\s*<\/div>\s*<\/div>\s*<\/div>/, ''),
  R(/<div class="cell sensitive"[\s\S]*?<\/div>\s*<\/div>/, ''),
  R(/<img[^>]*vendasfanvue\.avif[^>]*>/, ''),
  R(/<div class="vbump-vids">[\s\S]*?<\/div>/, ''),
  R(/<head>/, '<head>\n  <meta name="robots" content="noindex, nofollow">'),
];

const EN = [
  R(/Already tried to build your \+18 model and the AI <span style="color:hsl\(0,84%,60%\)">blocked everything<\/span> or it came out/, 'Already tried to build your AI model and it <span style="color:hsl(0,84%,60%)">came out</span>'),
  R(/ChatGPT, Midjourney and Leonardo blocked you<\/strong> every time you tried anything \+18 — and the few results that slipped through came out with a plastic doll face no subscriber would ever pay to see\./, 'ChatGPT, Midjourney and Leonardo failed you</strong> every time — the few results that came out had a plastic doll face nobody would ever follow.'),
  R(/You copied \+18 prompts from YouTube and Reddit/, 'You copied prompts from YouTube and Reddit'),
  R(/ — while other people are already posting on Fanvue with AI models that don't exist, and nobody will ever see their real face\./, ' — while other creators are already posting every day with their AI models, and nobody ever sees their real face.'),
  R(/It was that you were using the censored AIs and the wrong prompts\./, 'It was that you were using the wrong AI and the wrong prompts.'),
  R(/With the right UNCENSORED AI \+ the proven prompts, you generate your hyper-realistic \+18 model with the same face every time, ready for Fanvue, OnlyFans, Privacy and Fansly/, 'With the right AI + the proven prompts, you generate your hyper-realistic AI model with the same face every time, ready for your social and creator profiles'),
  R(/300\+ ready-to-use \+18 prompts<\/strong>/, '300+ ready-to-use prompts</strong>'),
  R(/Cinematic \+18 videos ready to sell in DMs and feed/, 'Cinematic videos ready for Reels, feed and DMs'),
  R(/Categories: lingerie, shower, gym, POV, light fetishes, PPV and more 🔥/, 'Categories: fashion, beach, gym, travel, selfies, lifestyle and more'),
  R(/Tested in real accounts earning \+\$10K USD\/month on Fanvue/, 'Tested in real AI creator accounts'),
  R(/Commercial license — sell on Fanvue, OnlyFans, Privacy, Fansly/, 'Commercial license — use your model on any platform'),
  R(/Access to the UNCENSORED AI<\/strong> — explicit \+18 content with zero blocks 🔥/, 'Access to the PRO AI engine</strong> — more realism, fewer blocks'),
  R(/YOU WANT TO BUILD A \+18 AI MODEL/, 'YOU WANT TO BUILD YOUR OWN AI MODEL'),
  R(/to sell on Fanvue\/OnlyFans but you don't know how to write prompts the AI won't block/, "but you don't know how to write prompts that look real"),
  R(/YOU WANT TO CASH IN ON FANVUE\/ONLYFANS/, 'YOU WANT TO START AN AI CREATOR PROFILE'),
  R(/but you don't want to show your face, body, or have your family find out/, "but you don't want to show your own face"),
  R(/and you need endless \+18 content without/, 'and you need endless content without'),
  R(/YOU WANT ENDLESS PPV AND DMs/, 'YOU WANT ENDLESS CONTENT'),
  R(/to sell personalized packs nonstop — exclusive photos and videos that go viral/, 'new photos and videos every day — scenes made to go viral'),
  R(/your face never appears, your identity stays protected and the AI model earns for you/, 'your face never appears and your identity stays protected'),
  R(/start gaining subscribers today/, 'start gaining followers today'),
  R(/Proven \+18 Prompts/, 'Proven Prompts'),
  R(/Censored AI \+ copied prompt/, 'Generic AI + copied prompt'),
  R(/Skin, pores, undetectable/, 'Skin, pores, real'),
  R(/Same pose, fans cancel/, 'Same pose, followers leave'),
  R(/>\+18 Pack</, '>Pack<'),
  // seção "uncensored" inteira
  R(/🔥 THE SECRET WEAPON OF FANVUE'S TOP CREATORS/, 'THE SECRET WEAPON OF TOP AI CREATORS'),
  R(/Access to an <span class="flame">UNCENSORED AI<\/span><br \/>that generates what ChatGPT and Midjourney <span\s+class="strike">block<\/span>/, 'Access to a <span class="flame">PRO AI</span><br />that gets the realism ChatGPT and Midjourney <span class="strike">miss</span>'),
  R(/While everyone else fights with AIs that block any \+18 prompt,[\s\S]*?without your real face ever showing up\./, 'While everyone else fights with plastic faces, you get access to the PRO AI we use to create photos, videos and DM content for AI creator profiles — without your real face ever showing up.'),
  R(/Zero blocks — generates explicit \+18 with no filters/, 'Same face and body in every generation'),
  R(/Lingerie, shower, POV, light fetishes and PPV packs/, 'Fashion, beach, gym, travel and lifestyle scenes'),
  R(/The real engine behind accounts earning \+\$10K\/month/, 'The engine behind working AI creator accounts'),
  // bônus
  R(/BONUS 1: TRICKSTER'S DICTIONARY — 80 UNDETECTABLE \+18 PROMPTS/, 'BONUS 1: ADVANCED PROMPT DICTIONARY — 80 PRO PROMPTS'),
  R(/80 prompts with disguised vocabulary[\s\S]*?pays for something custom\./, '80 advanced prompts with the exact vocabulary that gets realistic results on the first try. Includes the word dictionary so you can build your own prompts — anytime a follower asks for something custom.'),
  R(/THE AI THAT BUILDS \+18 PROMPTS FOR YOU/, 'THE AI THAT BUILDS PROMPTS FOR YOU'),
  R(/\("my model in black lingerie on the bed"\)/, '("my model in a black dress on a rooftop at sunset")'),
  R(/Your subscribers ask for something new/, 'Your followers ask for something new'),
  R(/how to build your \+18 model from scratch/, 'how to build your AI model from scratch'),
  R(/generate PPV packs in series and upload them to Fanvue, OnlyFans, Privacy or Fansly\./, 'generate content in series and post it on your profiles.'),
  R(/BONUS 4: FANVUE &amp; ONLYFANS PLAYBOOK — FROM ZERO TO YOUR FIRST \$1,000|BONUS 4: FANVUE & ONLYFANS PLAYBOOK — FROM ZERO TO YOUR FIRST \$1,000/, 'BONUS 4: AI CREATOR PLAYBOOK — FROM ZERO TO YOUR FIRST SALE'),
  R(/The exact step-by-step used by accounts earning[\s\S]*?all without showing your real face\./, 'The step-by-step used by working AI creator accounts: which platforms accept AI models, how to set up the profile, pricing, content strategy, DM scripts and free traffic from Threads, X (Twitter), Reddit and TikTok — all without showing your real face.'),
  // galeria e passos
  R(/\/\/ image · video · sensual · adult/, '// image · video · realism'),
  R(/video with real motion, and uncensored content\./, 'video with real motion, and the same face every time.'),
  R(/From zero to your first PPV in 3 steps/, 'From zero to your first post in 3 steps'),
  R(/Same face, same body, every single time\. No blocks\./, 'Same face, same body, every single time.'),
  R(/Post and get paid/, 'Post and grow'),
  R(/Upload to Fanvue or OnlyFans, sell packs in DMs and PPV\./, 'Post on your profiles every day.'),
  // oferta
  R(/Pack 300\+ \+18 Prompts for AI Model with UNCENSORED AI/, 'Pack 300+ Prompts for AI Model'),
  R(/300\+ proven \+18 prompts organized by category/, '300+ proven prompts organized by category'),
  R(/Categories: lingerie, shower, POV, gym, light fetishes, PPV packs/, 'Categories: fashion, beach, gym, travel, selfies, lifestyle'),
  R(/Bonus: Trickster's Dictionary — 80 undetectable \+18 prompts/, 'Bonus: Advanced Prompt Dictionary — 80 pro prompts'),
  R(/The AI that builds \+18 prompts for you/, 'The AI that builds prompts for you'),
  R(/Bonus: Fanvue &amp; OnlyFans Playbook — from zero to your first \$1,000|Bonus: Fanvue & OnlyFans Playbook — from zero to your first \$1,000/, 'Bonus: AI Creator Playbook — from zero to your first sale'),
  R(/Access to the UNCENSORED AI<\/strong>\s*🔥/, 'Access to the PRO AI</strong>'),
  R(/Commercial license for Fanvue\/OnlyFans \+ lifetime updates/, 'Commercial license + lifetime updates'),
  R(/I WANT THE COMPLETE \+18 MODEL/, 'I WANT THE COMPLETE PACK'),
  R(/\+100 Sensual Video Prompts/, '+100 Video Prompts'),
  R(/shower, lingerie, latex, pool, dance and roleplay/, 'beach, pool, gym, dance, fashion and city'),
  // garantia e FAQ
  R(/Generate your first \+18 model with the prompts\. If the result doesn't impress you or you don't see the\s+potential to earn on Fanvue\/OnlyFans, we refund/, "Generate your first AI model with the prompts. If the result doesn't impress you, we refund"),
  R(/300\+ ready-to-use \+18 prompts to copy and paste, organized by category \(lingerie[\s\S]*?your first \$1,000\./, '300+ ready-to-use prompts to copy and paste, organized by category (fashion, beach, gym, travel, selfies, lifestyle and more). Plus, as bonuses, you get the Advanced Prompt Dictionary (80 pro prompts), PromptGPT (the AI that builds prompts for you), the complete tutorial of the PRO AI and the AI Creator Playbook.'),
  R(/<summary>Do Fanvue and OnlyFans allow AI-generated content\?<\/summary>[\s\S]*?<\/details>/, '<summary>Can I use my model commercially?</summary>\n          <div class="answer">Yes. Your model is your character and your brand. The commercial license lets you use it on your social and creator profiles, and the Playbook shows how to label AI content on each platform.</div>\n        </details>'),
  R(/The AI model is the one who appears, poses, talks and sells\.\s*You just collect the payments\./, 'The AI model is the one who appears and poses.'),
  R(/a 100% fictional model that doesn't exist in real life, and/, 'a 100% fictional model, and'),
  R(/Fanvue's top creators like Aitana López/, 'top AI influencers like Aitana López'),
  R(/<details class="faq-item">\s*<summary>How much can I earn and how long does it take\?<\/summary>[\s\S]*?<\/details>\s*/, ''),
  R(/Unlock my \+18 model/, 'Unlock my AI model'),
];

const ES = [
  R(/Una IA sin censura crea fotos hiperrealistas\./, 'Una IA PRO crea fotos hiperrealistas.'),
  R(/¿Ya intentaste crear tu modelo \+18 y la IA <span style="color:hsl\(0,84%,60%\)">bloqueó todo<\/span> o salió/, '¿Ya intentaste crear tu modelo de IA y <span style="color:hsl(0,84%,60%)">salió</span>'),
  R(/ChatGPT, Midjourney y Leonardo te bloquearon<\/strong> cada vez que intentaste algo \+18 — y los pocos resultados que pasaron salieron/, 'ChatGPT, Midjourney y Leonardo te fallaron</strong> cada vez — y los pocos resultados salieron'),
  R(/ningún suscriptor/, 'nadie'),
  R(/Copiaste prompts \+18 de YouTube y Reddit/, 'Copiaste prompts de YouTube y Reddit'),
  R(/cero suscriptores/, 'cero seguidores'),
  R(/ — mientras otras personas ya publican en Fanvue con modelos de IA que no existen, y nadie verá jamás su cara real\./, ' — mientras otros creadores ya publican todos los días con sus modelos de IA, y nadie ve jamás su cara real.'),
  R(/Fue que estabas usando las IAs censuradas y los prompts equivocados\./, 'Fue que estabas usando la IA equivocada y los prompts equivocados.'),
  R(/Con la IA SIN CENSURA correcta \+ los prompts probados, generas tu modelo \+18 hiperrealista con la misma cara siempre, lista para Fanvue, OnlyFans, Privacy y Fansly/, 'Con la IA correcta + los prompts probados, generas tu modelo de IA hiperrealista con la misma cara siempre, lista para tus perfiles de creador'),
  R(/300\+ prompts \+18 listos para usar/, '300+ prompts listos para usar'),
  R(/Videos \+18 cinematográficos listos para vender en DMs y feed/, 'Videos cinematográficos listos para Reels, feed y DMs'),
  R(/Categorías: lencería, ducha, gym, POV, fetiches suaves, PPV y más 🔥/, 'Categorías: moda, playa, gym, viajes, selfies, lifestyle y más'),
  R(/Probado en cuentas reales que facturan \+\$10K USD\/mes en Fanvue/, 'Probado en cuentas reales de creadores con IA'),
  R(/Licencia comercial — vende en Fanvue, OnlyFans, Privacy, Fansly/, 'Licencia comercial — usa tu modelo en cualquier plataforma'),
  R(/Acceso a la IA SIN CENSURA<\/strong> — contenido explícito \+18 con cero bloqueos 🔥/, 'Acceso al motor de IA PRO</strong> — más realismo, menos bloqueos'),
  R(/QUIERES CREAR UN MODELO \+18 CON IA/, 'QUIERES CREAR TU PROPIO MODELO DE IA'),
  R(/para vender en Fanvue\/OnlyFans pero no sabes escribir prompts que la IA no bloquee/, 'pero no sabes escribir prompts que se vean reales'),
  R(/QUIERES FACTURAR EN FANVUE\/ONLYFANS/, 'QUIERES EMPEZAR UN PERFIL DE CREADOR CON IA'),
  R(/<p class="desc">[^<]*familia[^<]*<\/p>/, '<p class="desc">pero no quieres mostrar tu propia cara</p>'),
  R(/y necesitas contenido \+18 infinito sin/, 'y necesitas contenido infinito sin'),
  R(/QUIERES PPV Y DMs SIN PARAR/, 'QUIERES CONTENIDO SIN PARAR'),
  R(/para vender packs personalizados sin descanso — fotos y videos exclusivos que se viralizan/, 'fotos y videos nuevos todos los días — escenas hechas para viralizar'),
  R(/<p class="desc">tu cara nunca aparece[^<]*<\/p>/, '<p class="desc">tu cara nunca aparece y tu identidad queda protegida</p>'),
  R(/empieza a ganar suscriptores hoy/, 'empieza a ganar seguidores hoy'),
  R(/Prompts \+18 Probados/, 'Prompts Probados'),
  R(/IA censurada \+ prompt copiado/, 'IA genérica + prompt copiado'),
  R(/IA sin censura \+ prompt probado/, 'IA PRO + prompt probado'),
  R(/Piel, poros, indetectable/, 'Piel, poros, reales'),
  R(/>Pack \+18</, '>Pack<'),
  R(/🔥 EL ARMA SECRETA DE LOS TOP CREADORES DE FANVUE/, 'EL ARMA SECRETA DE LOS TOP CREADORES CON IA'),
  R(/Acceso a una <span class="flame">IA SIN CENSURA<\/span><br \/>que genera lo que ChatGPT y Midjourney <span\s+class="strike">[^<]*<\/span>/, 'Acceso a una <span class="flame">IA PRO</span><br />con el realismo que ChatGPT y Midjourney <span class="strike">no logran</span>'),
  R(/Mientras todos pelean con IAs que bloquean cualquier prompt \+18,[\s\S]*?sin que tu cara real aparezca jamás\./, 'Mientras todos pelean con caras de plástico, tú obtienes acceso a la IA PRO que usamos para crear fotos, videos y contenido de DM para perfiles de creadores con IA — sin que tu cara real aparezca jamás.'),
  R(/Cero bloqueos — genera explícito \+18 sin filtros/, 'Misma cara y cuerpo en cada generación'),
  R(/Lencería, ducha, POV, fetiches suaves y packs PPV/, 'Escenas de moda, playa, gym, viajes y lifestyle'),
  R(/El motor real detrás de cuentas que facturan \+\$10K\/mes/, 'El motor detrás de cuentas reales de creadores con IA'),
  R(/BONO 1: DICCIONARIO DEL TRAMPOSO — 80 PROMPTS \+18 INDETECTABLES/, 'BONO 1: DICCIONARIO DE PROMPTS AVANZADOS — 80 PROMPTS PRO'),
  R(/80 prompts con vocabulario disfrazado[\s\S]*?pague por algo personalizado\./, '80 prompts avanzados con el vocabulario exacto que da resultados realistas al primer intento. Incluye el diccionario de palabras para que construyas tus propios prompts — cada vez que un seguidor pida algo personalizado.'),
  R(/LA IA QUE CREA PROMPTS \+18 POR TI/, 'LA IA QUE CREA PROMPTS POR TI'),
  R(/\("mi modelo en lencería negra sobre la cama"\)/, '("mi modelo con vestido negro en una terraza al atardecer")'),
  R(/Tus suscriptores piden algo nuevo/, 'Tus seguidores piden algo nuevo'),
  R(/cómo crear tu modelo \+18 desde cero/, 'cómo crear tu modelo de IA desde cero'),
  R(/generar packs PPV en serie y subirlos a Fanvue, OnlyFans, Privacy o Fansly\./, 'generar contenido en serie y publicarlo en tus perfiles.'),
  R(/BONO 4: PLAYBOOK FANVUE (&amp;|&) ONLYFANS — DE CERO A TUS PRIMEROS \$1,000/, 'BONO 4: PLAYBOOK DEL CREADOR CON IA — DE CERO A TU PRIMERA VENTA'),
  R(/(<h3><span>BONO 4[^<]*<\/span><\/h3>\s*<p>)[\s\S]*?(<\/p>)/, (m, a, b) => a + 'El paso a paso que usan cuentas reales de creadores con IA: qué plataformas aceptan modelos de IA, cómo configurar el perfil, precios, estrategia de contenido, scripts de DM y tráfico gratis desde Threads, X (Twitter), Reddit y TikTok — sin mostrar tu cara real.' + b),
  R(/video con movimiento real y contenido sin censura\./, 'video con movimiento real y la misma cara siempre.'),
  R(/De cero a tu primer PPV en 3 pasos/, 'De cero a tu primera publicación en 3 pasos'),
  R(/Pégalo en la IA sin censura y dale generar\. Misma cara, mismo cuerpo, siempre\. Sin bloqueos\./, 'Pégalo en la IA PRO y dale generar. Misma cara, mismo cuerpo, siempre.'),
  R(/Publica y cobra/, 'Publica y crece'),
  R(/Sube a Fanvue u OnlyFans, vende packs en DMs y PPV\./, 'Publica en tus perfiles todos los días.'),
  R(/Pack 300\+ Prompts \+18 para Modelo de IA con IA SIN CENSURA/, 'Pack 300+ Prompts para Modelo de IA'),
  R(/300\+ prompts \+18 probados organizados por categoría/, '300+ prompts probados organizados por categoría'),
  R(/Categorías: lencería, ducha, POV, gym, fetiches suaves, packs PPV/, 'Categorías: moda, playa, gym, viajes, selfies, lifestyle'),
  R(/Bono: Diccionario del Tramposo — 80 prompts \+18 indetectables/, 'Bono: Diccionario de Prompts Avanzados — 80 prompts pro'),
  R(/La IA que crea prompts \+18 por ti/, 'La IA que crea prompts por ti'),
  R(/Bono: Playbook Fanvue (&amp;|&) OnlyFans — de cero a tus primeros \$1,000/, 'Bono: Playbook del Creador con IA — de cero a tu primera venta'),
  R(/Acceso a la IA SIN CENSURA<\/strong>\s*🔥/, 'Acceso a la IA PRO</strong>'),
  R(/Licencia comercial para Fanvue\/OnlyFans \+ actualizaciones de por vida/, 'Licencia comercial + actualizaciones de por vida'),
  R(/QUIERO EL MODELO \+18 COMPLETO/, 'QUIERO EL PACK COMPLETO'),
  R(/\+100 Prompts de Video Sensual(es)?/, '+100 Prompts de Video'),
  R(/ducha, lencería, látex, piscina, baile y personajes/, 'playa, piscina, gym, baile, moda y ciudad'),
  R(/Genera tu primer modelo \+18 con los prompts\. Si el resultado no te impresiona o no ves el\s+potencial de ganar en Fanvue\/OnlyFans, te devolvemos/, 'Genera tu primer modelo de IA con los prompts. Si el resultado no te impresiona, te devolvemos'),
  R(/300\+ prompts \+18 listos para copiar y pegar, organizados por categoría \(lencería[\s\S]*?tus primeros \$1,000\./, '300+ prompts listos para copiar y pegar, organizados por categoría (moda, playa, gym, viajes, selfies, lifestyle y más). Además, como bonos, recibes el Diccionario de Prompts Avanzados (80 prompts pro), PromptGPT (la IA que crea prompts por ti), el tutorial completo de la IA PRO y el Playbook del Creador con IA.'),
  R(/<summary>¿Fanvue y OnlyFans permiten contenido generado con IA\?<\/summary>[\s\S]*?<\/details>/, '<summary>¿Puedo usar mi modelo comercialmente?</summary>\n          <div class="answer">Sí. Tu modelo es tu personaje y tu marca. La licencia comercial te permite usarla en tus perfiles sociales y de creador, y el Playbook muestra cómo identificar el contenido de IA en cada plataforma.</div>\n        </details>'),
  R(/El modelo de IA es quien aparece, posa, habla y vende\.\s*Tú solo cobras los pagos\./, 'El modelo de IA es quien aparece y posa.'),
  R(/un modelo 100% ficticio que no existe en la vida real, y/, 'un modelo 100% ficticio, y'),
  R(/las top creadoras de Fanvue como Aitana López/, 'las top influencers de IA como Aitana López'),
  R(/<details class="faq-item">\s*<summary>¿Cuánto puedo ganar y cuánto tarda\?<\/summary>[\s\S]*?<\/details>\s*/, ''),
  R(/Desbloquea mi modelo \+18/, 'Desbloquea mi modelo de IA'),
  R(/\/\/ imagen · video · sensual · adulto/, '// imagen · video · realismo'),
];

const PT = [
  R(/Uma IA sem censura cria fotos hiper-realistas\./, 'Uma IA PRO cria fotos hiper-realistas.'),
  R(/Já tentou criar sua modelo \+18 e a IA <span style="color:hsl\(0,84%,60%\)">bloqueou tudo<\/span> ou veio/, 'Já tentou criar sua modelo de IA e ela <span style="color:hsl(0,84%,60%)">veio</span>'),
  R(/ChatGPT, Midjourney e Leonardo te bloquearam<\/strong> toda vez que tentou qualquer coisa \+18 — e os poucos resultados que passaram saíram/, 'ChatGPT, Midjourney e Leonardo te deixaram na mão</strong> toda vez — e os poucos resultados saíram'),
  R(/nenhum assinante/, 'ninguém'),
  R(/Você copiou prompts \+18 do YouTube e do Reddit/, 'Você copiou prompts do YouTube e do Reddit'),
  R(/zero assinantes?/, 'zero seguidor'),
  R(/ — enquanto outras pessoas já estão postando no Fanvue com modelos de IA que não existem,[^<]*\./, ' — enquanto outros criadores já postam todo dia com as suas modelos de IA, e ninguém nunca vê o rosto real deles.'),
  R(/Foi você usando as IAs censuradas e os prompts errados\./, 'Foi você usando a IA errada e os prompts errados.'),
  R(/Com a IA SEM CENSURA certa \+ os prompts validados, você gera sua modelo \+18 hiper-realista com o mesmo rosto toda vez, pronta pra Fanvue, OnlyFans, Privacy e Fansly/, 'Com a IA certa + os prompts validados, você gera sua modelo de IA hiper-realista com o mesmo rosto toda vez, pronta pros seus perfis de criador'),
  R(/300\+ prompts \+18 prontos pra usar/, '300+ prompts prontos pra usar'),
  R(/Vídeos \+18 cinematográficos prontos pra vender em DM e no feed/, 'Vídeos cinematográficos prontos pra Reels, feed e DM'),
  R(/Categorias: lingerie, banho, academia, POV, fetiches leves, PPV e mais 🔥/, 'Categorias: moda, praia, academia, viagem, selfies, lifestyle e mais'),
  R(/Testado em contas reais faturando \+US\$ 10 mil\/mês no Fanvue/, 'Testado em contas reais de criadores com IA'),
  R(/Licença comercial — venda no Fanvue, OnlyFans, Privacy e Fansly/, 'Licença comercial — use sua modelo em qualquer plataforma'),
  R(/Acesso à IA SEM CENSURA<\/strong> — conteúdo \+18 explícito, zero bloqueio 🔥/, 'Acesso ao motor de IA PRO</strong> — mais realismo, menos bloqueio'),
  R(/VOCÊ QUER CRIAR UMA MODELO \+18 COM IA/, 'VOCÊ QUER CRIAR SUA PRÓPRIA MODELO DE IA'),
  R(/pra vender no Fanvue\/OnlyFans mas não sabe escrever prompt que a IA não bloqueie/, 'mas não sabe escrever prompt que pareça real'),
  R(/VOCÊ QUER FATURAR NO FANVUE\/ONLYFANS/, 'VOCÊ QUER COMEÇAR UM PERFIL DE CRIADOR COM IA'),
  R(/<p class="desc">[^<]*fam[ií]lia[^<]*<\/p>/, '<p class="desc">mas não quer mostrar o próprio rosto</p>'),
  R(/e precisa de conteúdo \+18 infinito sem/, 'e precisa de conteúdo infinito sem'),
  R(/VOCÊ QUER PPV E DMs INFINITOS/, 'VOCÊ QUER CONTEÚDO INFINITO'),
  R(/pra vender packs personalizados sem parar — fotos e vídeos exclusivos que viralizam/, 'fotos e vídeos novos todo dia — cenas feitas pra viralizar'),
  R(/<p class="desc">seu rosto nunca aparece[^<]*<\/p>/, '<p class="desc">seu rosto nunca aparece e sua identidade fica protegida</p>'),
  R(/começa a ganhar assinantes hoje/, 'começa a ganhar seguidores hoje'),
  R(/Prompts \+18 validados/, 'Prompts validados'),
  R(/IA censurada \+ prompt copiado/, 'IA genérica + prompt copiado'),
  R(/IA sem censura \+ prompt validado/, 'IA PRO + prompt validado'),
  R(/Pele, poros, indetectável/, 'Pele, poros, reais'),
  R(/>Pack \+18</, '>Pack<'),
  R(/🔥 A ARMA SECRETA DOS TOPS DO FANVUE/, 'A ARMA SECRETA DOS TOPS DE IA'),
  R(/Acesso a uma <span class="flame">IA SEM CENSURA<\/span><br\s*\/?>que gera o que ChatGPT e Midjourney <span class="strike">bloqueiam<\/span>/, 'Acesso a uma <span class="flame">IA PRO</span><br>com o realismo que ChatGPT e Midjourney <span class="strike">não entregam</span>'),
  R(/Enquanto todo mundo briga com IAs que bloqueiam qualquer prompt \+18,[\s\S]*?nem por um segundo\./, 'Enquanto todo mundo briga com cara de boneca, você ganha acesso à IA PRO que a gente usa pra criar fotos, vídeos e conteúdo de DM pra perfis de criador com IA — sem o seu rosto real aparecer nem por um segundo.'),
  R(/Zero bloqueio — gera \+18 explícito sem filtro nenhum/, 'Mesmo rosto e corpo em toda geração'),
  R(/Lingerie, banho, POV, fetiches leves e packs de PPV/, 'Cenas de moda, praia, academia, viagem e lifestyle'),
  R(/O motor real por trás de contas faturando \+US\$ 10 mil\/mês/, 'O motor por trás de contas reais de criadores com IA'),
  R(/BÔNUS 1: DICIONÁRIO DO TRAPACEIRO — 80 PROMPTS \+18 INDETECTÁVEIS/, 'BÔNUS 1: DICIONÁRIO DE PROMPTS AVANÇADOS — 80 PROMPTS PRO'),
  R(/80 prompts com vocabulário disfarçado[\s\S]*?pagar por algo personalizado\./, '80 prompts avançados com o vocabulário exato que dá resultado realista de primeira. Inclui o dicionário de palavras pra você montar seus próprios prompts — sempre que um seguidor pedir algo personalizado.'),
  R(/A IA QUE CRIA PROMPTS \+18 PRA VOCÊ/, 'A IA QUE CRIA PROMPTS PRA VOCÊ'),
  R(/\("minha modelo de lingerie preta na cama"\)/, '("minha modelo de vestido preto num rooftop no pôr do sol")'),
  R(/Seu assinante pede algo novo/, 'Seu seguidor pede algo novo'),
  R(/como criar sua modelo \+18 do zero/, 'como criar sua modelo de IA do zero'),
  R(/gerar packs PPV em série e subir tudo no Fanvue, OnlyFans, Privacy ou Fansly\./, 'gerar conteúdo em série e postar nos seus perfis.'),
  R(/BÔNUS 4: PLAYBOOK FANVUE (&amp;|&) ONLYFANS — DO ZERO AOS PRIMEIROS US\$ 1\.000/, 'BÔNUS 4: PLAYBOOK DO CRIADOR COM IA — DO ZERO À PRIMEIRA VENDA'),
  R(/(<h3><span>BÔNUS 4[^<]*<\/span><\/h3>\s*<p>)[\s\S]*?(<\/p>)/, (m, a, b) => a + 'O passo a passo usado por contas reais de criadores com IA: quais plataformas aceitam modelos de IA, como montar o perfil, preço, estratégia de conteúdo, scripts de DM e tráfego orgânico no Threads, X (Twitter), Reddit e TikTok — sem mostrar o seu rosto real.' + b),
  R(/vídeo com movimento real e conteúdo sem censura\./, 'vídeo com movimento real e o mesmo rosto sempre.'),
  R(/Do zero ao seu primeiro PPV em 3 passos/, 'Do zero ao seu primeiro post em 3 passos'),
  R(/Cole na IA sem censura e mande gerar\. Mesmo rosto, mesmo corpo, sempre\. Sem bloqueio\./, 'Cole na IA PRO e mande gerar. Mesmo rosto, mesmo corpo, sempre.'),
  R(/Poste e (cobre|fature|receba|ganhe)/, 'Poste e cresça'),
  R(/\/\/ imagem · vídeo · sensual · adulto/, '// imagem · vídeo · realismo'),
  R(/Suba no Fanvue ou OnlyFans, venda packs em DMs e PPV\./, 'Poste nos seus perfis todo dia.'),
  R(/Pack com 300 Prompts \+18 pra sua modelo de IA/, 'Pack com 300 Prompts pra sua modelo de IA'),
  R(/Dicionário do Trapaceiro — 80 prompts \+18 indetectáveis/g, 'Dicionário de Prompts Avançados — 80 prompts pro'),
  R(/A IA que cria prompts \+18 pra você/g, 'A IA que cria prompts pra você'),
  R(/Playbook Fanvue (&amp;|&) OnlyFans — do zero aos primeiros US\$ 1\.000/g, 'Playbook do Criador com IA — do zero à primeira venda'),
  R(/Acesso à IA SEM CENSURA(<\/strong>)?\s*🔥/g, (m, s) => 'Acesso à IA PRO' + (s || '')),
  R(/Licença comercial pra vender no Fanvue\/OnlyFans \+ atualizações vitalícias|Licença comercial pra Fanvue\/OnlyFans \+ atualizações vitalícias/g, 'Licença comercial + atualizações vitalícias'),
  R(/Pack 300\+ Prompts \+18 para Modelo de IA com IA SEM CENSURA/, 'Pack 300+ Prompts para Modelo de IA'),
  R(/300\+ prompts \+18 validados organizados por categoria/, '300+ prompts validados organizados por categoria'),
  R(/Categorias: lingerie, banho, POV, academia, fetiches leves, packs de PPV/, 'Categorias: moda, praia, academia, viagem, selfies, lifestyle'),
  R(/QUERO O PACK COMPLETO \+18/, 'QUERO O PACK COMPLETO'),
  R(/\+100 Prompts de Vídeo Sensua(l|is)/, '+100 Prompts de Vídeo'),
  R(/banho, lingerie, látex, piscina, dança e personagens/, 'praia, piscina, academia, dança, moda e cidade'),
  R(/Gere sua primeira modelo \+18 com os prompts\. Se o resultado não te impressionar ou se você não enxergar\s+potencial pra faturar no Fanvue\/OnlyFans, a gente devolve/, 'Gere sua primeira modelo de IA com os prompts. Se o resultado não te impressionar, a gente devolve'),
  R(/300\+ prompts \+18 prontos pra copiar e colar, organizados por categoria \(lingerie[\s\S]*?(aos primeiros US\$ 1\.000|do zero à primeira venda)\./, '300+ prompts prontos pra copiar e colar, organizados por categoria (moda, praia, academia, viagem, selfies, lifestyle e mais). Além disso, como bônus, você leva o Dicionário de Prompts Avançados (80 prompts pro), o PromptGPT (a IA que cria prompts pra você), o tutorial completo da IA PRO e o Playbook do Criador com IA.'),
  R(/<summary>O Fanvue e o OnlyFans permitem conteúdo gerado por IA\?<\/summary>[\s\S]*?<\/details>/, '<summary>Posso usar minha modelo comercialmente?</summary>\n          <div class="answer">Sim. Sua modelo é sua personagem e sua marca. A licença comercial deixa você usar nos seus perfis sociais e de criador, e o Playbook mostra como identificar o conteúdo de IA em cada plataforma.</div>\n        </details>'),
  R(/Quem aparece, posa, fala e vende é a modelo de IA\.[^<]*/, 'Quem aparece e posa é a modelo de IA.'),
  R(/uma modelo 100% fictícia que não existe na vida real, e/, 'uma modelo 100% fictícia, e'),
  R(/pelos tops do Fanvue, tipo a Aitana López/, 'pelas top influencers de IA, tipo a Aitana López'),
  R(/<details class="faq-item">\s*<summary>[^<]*[Qq]uanto[^<]*(ganhar|faturar)[^<]*<\/summary>[\s\S]*?<\/details>\s*/, ''),
  R(/Desbloqueie minha modelo \+18/, 'Desbloqueie minha modelo de IA'),
];

const LANG = { en: EN, es: ES, pt: PT };

// Depois das trocas específicas: nome do motor e classes CSS (visíveis no código-fonte que o robô lê)
const FINAIS = {
  en: [R(/UNCENSORED AI|Uncensored AI|uncensored AI/g, 'PRO AI'), R(/\ban PRO AI/g, 'a PRO AI')],
  es: [R(/IA SIN CENSURA|IA sin censura|IA Sin Censura/g, 'IA PRO')],
  pt: [R(/IA SEM CENSURA|IA sem censura|IA Sem Censura/g, 'IA PRO')],
};
const CLASSES = [R(/uncensored-/g, 'pro-')];

// O que ainda pode sobrar no TEXTO visível (o rodapé "fictional adults (18+)" é aviso legal e fica)
const RISCO = /onlyfans|fanvue|fansly|privacy and|privacy y|privacy e|uncensored|sin censura|sem censura|\+18|18\+|explicit|expl[ií]cit|\bppv\b|fetish|fetich|\$\s?\d[\d,.]*\s?(k|\/|usd per|al mes|por m)|don't exist|no existe|n[aã]o existe|undetectable|indetect|nsfw|\bhot\b|lingerie|latex|l[aá]tex/i;

function textoVisivel(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .split('\n').map((s) => s.trim()).filter(Boolean);
}

for (const lang of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LANG)) {
  const origem = path.join(RAIZ, lang, 'index.html');
  let html = fs.readFileSync(origem, 'utf8');
  const falhas = [];
  for (const r of [...BLOCOS, ...LANG[lang], ...(FINAIS[lang] || []), ...CLASSES]) {
    const antes = html;
    html = html.replace(r.re, typeof r.to === 'function' ? r.to : () => r.to);
    if (html === antes && !r.re.global) falhas.push(String(r.re).slice(0, 90));
  }
  fs.writeFileSync(path.join(RAIZ, lang, 'limpa.html'), html);
  const sobras = textoVisivel(html).filter((l) => RISCO.test(l) && !/fictional adults|ficticios|fictícias|adultos ficticios|adultas fictícias|personajes fict|personagens fict|Content for adults|Contenido para adultos|Conteúdo para adultos/i.test(l));
  console.log(`== ${lang}: limpa.html gravado · ${falhas.length} regra(s) sem efeito · ${sobras.length} linha(s) com risco`);
  falhas.forEach((f) => console.log('  sem efeito:', f));
  sobras.forEach((s) => console.log('  sobra:', s.slice(0, 160)));
}
