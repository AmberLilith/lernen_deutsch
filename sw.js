const CACHE_NAME = "lernen-deutsch-static-20261125-3";
const ARQUIVOS = [
  "index.html",
  "manifest.webmanifest",
  "assets/favicon.svg",
  "assets/logo.svg",
  "css/style.css",
  "js/app.js",
  "js/busca-site.js",
  "js/componentes/busca-site.js",
  "js/conteudos.js",
  "js/exercicios.js",
  "js/firebase.js",
  "js/vocabulario_substantivos.js",
  "js/dados-offline.js",
  "exercicios/vocabulario/exercicio_vocabulario_1.html",
  "exercicios/vocabulario/exercicios-vocabulario-i.html",
  "exercicios/vocabulario/vocabulario-ii.html",
  "exercicios/vocabulario/vocabulario-ii-dados.js",
  "exercicios/vocabulario_iii.html",
  "exercicios/vocabulario_iii-dados.js",
  "exercicios/vocabulario_substantivos/vocabulario_substantivos.css",
  "exercicios/vocabulario_substantivos/vocabulario_substantivos.html",
  "exercicios/vocabulario_verbos/vocabulario_verbos.html",
  "exercicios/adjetivos-extras/adjetivos-extras.html",
  "exercicios/adjetivos-extras/questions.js",
  "exercicios/adjetivos/adjetivos.html",
  "exercicios/adjetivos/adjetivos-dados.js",
  "exercicios/adjetivos/indefinidos-plural.html",
  "exercicios/adjetivos/indefinidos-plural-dados.js",
  "exercicios/artigos-definidos/artigos-definidos.html",
  "exercicios/artigos-indefinidos/artigos-indefinidos.html",
  "exercicios/casos/casos.html",
  "exercicios/dativ/dativ.html",
  "exercicios/generos/generos.html",
  "exercicios/generos/generos-dados.js",
  "exercicios/modais/modais.html",
  "exercicios/modais/modais-dados.js",
  "exercicios/modais/modais.css",
  "exercicios/modais/modais.js",
  "exercicios/ndeklination/ndeklination.html",
  "exercicios/negacao/negacao.html",
  "exercicios/negacao/negacao-dados.js",
  "exercicios/ordem-frase/ordem-frase.html",
  "exercicios/perfekt/perfekt.html",
  "exercicios/perfekt/perfekt-dados.js",
  "exercicios/preposicoes/preposicoes.html",
  "exercicios/preposicoes/preposicoes-dados.js",
  "exercicios/preposicoes/wechsel.html",
  "exercicios/presente-irregulares/presente-irregulares.html",
  "exercicios/presente-irregulares/presente-irregulares-dados.js",
  "exercicios/presente-regulares/presente-regulares.html",
  "exercicios/presente-regulares/presente-regulares-dados.js",
  "exercicios/pronomes-pessoais/pronomes-pessoais.html",
  "exercicios/pronomes-pessoais/pronomes-pessoais-dados.js",
  "exercicios/pronomes_indefinidos/pronomes_indefinidos.html",
  "exercicios/pronomes_indefinidos/pronomes_indefinidos-dados.js",
  "exercicios/separaveis/separaveis.html",
  "exercicios/separaveis/separaveis-dados.js",
  "exercicios/subordinadas/subordinadas.html",
  "exercicios/subordinadas/subordinadas-dados.js",
  "exercicios/verbos-preposicionais/sich-freuen-auf-ueber.html",
  "paginas/adjetivos.html",
  "paginas/adverbios.html",
  "paginas/artigos-definidos.html",
  "paginas/artigos-indefinidos.html",
  "paginas/casos.html",
  "paginas/comparativo-superlativo.html",
  "paginas/conjuncoes.html",
  "paginas/dativ.html",
  "paginas/futur-1.html",
  "paginas/generos.html",
  "paginas/indefinidos-plural.html",
  "paginas/modais.html",
  "paginas/nach-danach-nachdem-nachher.html",
  "paginas/nach-zu-in.html",
  "paginas/ndeklination.html",
  "paginas/negacao.html",
  "paginas/ob-wenn.html",
  "paginas/ordem-frase.html",
  "paginas/perfekt.html",
  "paginas/prateritum.html",
  "paginas/preposicoes.html",
  "paginas/presente-irregulares.html",
  "paginas/presente-regulares.html",
  "paginas/presentisches-futur.html",
  "paginas/pronomes-demonstrativos.html",
  "paginas/pronomes-indefinidos.html",
  "paginas/pronomes-pessoais.html",
  "paginas/pronomes-possessivos.html",
  "paginas/pronomes-relativos.html",
  "paginas/reflexivos.html",
  "paginas/sehr-viel.html",
  "paginas/separaveis.html",
  "paginas/stehen-stellen-liegen-legen.html",
  "paginas/subordinadas.html",
  "paginas/uhr-stunde.html",
  "paginas/verbos-preposicionais.html",
  "paginas/verbos/vocabulario_verbos.css",
  "paginas/verbos/vocabulario_verbos.html",
  "paginas/verbos/vocabulario_verbos.js",
  "paginas/vocabulario-adjetivos.html",
  "paginas/vocabulario-adverbios.html",
  "paginas/vocabulario-expressoes.html",
  "paginas/vocabulario_substantivos.html",
  "paginas/vor-bevor.html",
  "paginas/waehrend-solange.html",
  "paginas/wechsel.html"
];

function urlLocal(caminho) {
  return new URL(caminho, self.registration.scope).href;
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await Promise.allSettled(
      ARQUIVOS.map(async caminho => {
        const url = urlLocal(caminho);
        const resposta = await fetch(url, { cache: "reload" });

        if (resposta.ok) {
          await cache.put(url, resposta);
        }
      })
    );

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const chaves = await caches.keys();

    await Promise.all(
      chaves
        .filter(chave =>
          chave.startsWith("lernen-deutsch-static-") &&
          chave !== CACHE_NAME
        )
        .map(chave => caches.delete(chave))
    );

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const requisicao = event.request;

  if (requisicao.method !== "GET") return;

  const url = new URL(requisicao.url);

  if (url.origin !== self.location.origin) return;

  if (requisicao.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const resposta = await fetch(requisicao);
        const cache = await caches.open(CACHE_NAME);

        if (resposta.ok) {
          cache.put(requisicao, resposta.clone());
        }

        return resposta;
      } catch {
        const respostaEmCache = await caches.match(requisicao, {
          ignoreSearch: true
        });

        if (respostaEmCache) return respostaEmCache;

        const caminhoRaiz = new URL(self.registration.scope).pathname;
        const caminhoIndex = new URL(urlLocal("index.html")).pathname;

        if (url.pathname === caminhoRaiz || url.pathname === caminhoIndex) {
          return await caches.match(urlLocal("index.html")) ||
            new Response("Página inicial indisponível offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
        }

        return new Response(
          "<!doctype html>" +
          '<html lang="pt-BR"><meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width, initial-scale=1">' +
          "<title>Conteúdo indisponível offline</title>" +
          "<body><main><h1>Conteúdo indisponível offline</h1>" +
          "<p>Esta página não está salva neste dispositivo. Conecte-se à internet e tente novamente.</p>" +
          '<p><a href="' + urlLocal("index.html") + '">Voltar ao início</a></p>' +
          "</main></body></html>",
          {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          }
        );
      }
    })());

    return;
  }

  event.respondWith((async () => {
    const emCache = await caches.match(requisicao, { ignoreSearch: true });

    const atualizar = fetch(requisicao)
      .then(async resposta => {
        if (resposta.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(requisicao, resposta.clone());
        }

        return resposta;
      })
      .catch(() => null);

    if (emCache) {
      event.waitUntil(atualizar);
      return emCache;
    }

    return await atualizar || new Response("", { status: 504 });
  })());
});