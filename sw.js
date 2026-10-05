const CACHE_NAME = "lernen-deutsch-static-20261005-2";
const ARQUIVOS = [
  "index.html",
  "manifest.webmanifest",
  "assets/favicon.svg",
  "assets/logo.svg",
  "css/style.css",
  "js/app.js",
  "js/busca-site.js",
  "js/conteudos.js",
  "js/exercicios.js",
  "js/firebase.js",
  "js/vocabulario_substantivos.js",
  "js/dados-offline.js",
  "exercicios/adjetivos-extras/adjetivos-extras.html",
  "exercicios/adjetivos-extras/questions.js",
  "exercicios/adjetivos.html",
  "exercicios/artigos-definidos.html",
  "exercicios/artigos-indefinidos.html",
  "exercicios/casos.html",
  "exercicios/dativ.html",
  "exercicios/generos.html",
  "exercicios/indefinidos-plural.html",
  "exercicios/modais.html",
  "exercicios/ndeklination.html",
  "exercicios/negacao.html",
  "exercicios/ordem-frase.html",
  "exercicios/perfekt.html",
  "exercicios/preposicoes.html",
  "exercicios/presente-irregulares.html",
  "exercicios/presente-regulares.html",
  "exercicios/pronomes-pessoais.html",
  "exercicios/separaveis.html",
  "exercicios/sich-freuen-auf-ueber.html",
  "exercicios/subordinadas.html",
  "exercicios/vocabulario_substantivos/vocabulario_substantivos.css",
  "exercicios/vocabulario_substantivos/vocabulario_substantivos.html",
  "exercicios/vocabulario_verbos/vocabulario_verbos.html",
  "exercicios/wechsel.html",
  "paginas/adjetivos.html",
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
  "paginas/nach-zu-in.html",
  "paginas/ndeklination.html",
  "paginas/negacao.html",
  "paginas/ordem-frase.html",
  "paginas/perfekt.html",
  "paginas/prateritum.html",
  "paginas/preposicoes.html",
  "paginas/presente-irregulares.html",
  "paginas/presente-regulares.html",
  "paginas/presentisches-futur.html",
  "paginas/pronomes-demonstrativos.html",
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
        return (
          await caches.match(requisicao, { ignoreSearch: true }) ||
          await caches.match(urlLocal("index.html")) ||
          new Response("Conteúdo indisponível offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          })
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
