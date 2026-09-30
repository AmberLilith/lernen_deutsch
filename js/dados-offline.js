const DB_NAME = "lernen-deutsch-offline";
const DB_VERSION = 1;
const STORE_COLECOES = "colecoes";
const COLECOES_PUBLICAS = [
  "substantivos",
  "verbos",
  "adjetivos",
  "adverbios",
  "expressoes"
];

let firebasePromise = null;

function abrirBanco() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("INDEXEDDB_INDISPONIVEL"));
      return;
    }

    const requisicao = indexedDB.open(DB_NAME, DB_VERSION);

    requisicao.onupgradeneeded = () => {
      const banco = requisicao.result;

      if (!banco.objectStoreNames.contains(STORE_COLECOES)) {
        banco.createObjectStore(STORE_COLECOES, { keyPath: "nome" });
      }
    };

    requisicao.onsuccess = () => resolve(requisicao.result);
    requisicao.onerror = () => reject(requisicao.error);
  });
}

export async function lerColecaoLocal(nome) {
  try {
    const banco = await abrirBanco();

    return await new Promise((resolve, reject) => {
      const transacao = banco.transaction(STORE_COLECOES, "readonly");
      const store = transacao.objectStore(STORE_COLECOES);
      const requisicao = store.get(nome);

      requisicao.onsuccess = () => resolve(requisicao.result || null);
      requisicao.onerror = () => reject(requisicao.error);
      transacao.oncomplete = () => banco.close();
    });
  } catch (error) {
    console.warn("Não foi possível ler o cache offline:", error);
    return null;
  }
}

async function salvarColecaoLocal(nome, dados) {
  try {
    const banco = await abrirBanco();

    await new Promise((resolve, reject) => {
      const transacao = banco.transaction(STORE_COLECOES, "readwrite");
      const store = transacao.objectStore(STORE_COLECOES);

      store.put({
        nome,
        dados: dados || {},
        atualizadoEm: Date.now()
      });

      transacao.oncomplete = resolve;
      transacao.onerror = () => reject(transacao.error);
      transacao.onabort = () => reject(transacao.error);
    });

    banco.close();
  } catch (error) {
    console.warn("Não foi possível atualizar o cache offline:", error);
  }
}

async function carregarFirebase() {
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import("./firebase.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js")
    ])
      .then(([firebase, sdk]) => ({
        database: firebase.database,
        ref: sdk.ref,
        get: sdk.get,
        onValue: sdk.onValue
      }))
      .catch(error => {
        firebasePromise = null;
        throw error;
      });
  }

  return firebasePromise;
}

export async function obterColecao(nome) {
  const local = await lerColecaoLocal(nome);

  if (!navigator.onLine) {
    if (local) return local.dados;

    const erro = new Error("OFFLINE_SEM_CACHE");
    erro.code = "OFFLINE_SEM_CACHE";
    throw erro;
  }

  try {
    const { database, ref, get } = await carregarFirebase();
    const snapshot = await get(ref(database, nome));
    const dados = snapshot.exists() ? snapshot.val() : {};

    await salvarColecaoLocal(nome, dados);
    return dados;
  } catch (error) {
    if (local) return local.dados;
    throw error;
  }
}

export function observarColecao(nome, aoAtualizar, aoErro) {
  let ativo = true;
  let cancelarFirebase = null;
  let possuiCache = false;

  async function entregarCache() {
    const local = await lerColecaoLocal(nome);
    if (!ativo || !local) return;

    possuiCache = true;
    aoAtualizar(local.dados || {}, {
      origem: "local",
      atualizadoEm: local.atualizadoEm || null
    });
  }

  async function conectarFirebase() {
    if (!ativo || !navigator.onLine || cancelarFirebase) return;

    try {
      const { database, ref, onValue } = await carregarFirebase();

      if (!ativo) return;

      cancelarFirebase = onValue(
        ref(database, nome),
        snapshot => {
          const dados = snapshot.exists() ? snapshot.val() : {};

          salvarColecaoLocal(nome, dados);

          if (ativo) {
            possuiCache = true;
            aoAtualizar(dados, {
              origem: "firebase",
              atualizadoEm: Date.now()
            });
          }
        },
        error => {
          console.warn("Falha ao sincronizar " + nome + ":", error);

          if (!possuiCache && ativo && aoErro) {
            aoErro(error);
          }
        }
      );
    } catch (error) {
      console.warn("Falha ao conectar " + nome + " ao Firebase:", error);

      if (!possuiCache && ativo && aoErro) {
        aoErro(error);
      }
    }
  }

  function aoFicarOnline() {
    conectarFirebase();
  }

  function aoFicarOffline() {
    if (cancelarFirebase) {
      cancelarFirebase();
      cancelarFirebase = null;
    }
  }

  entregarCache().finally(() => {
    if (!navigator.onLine && !possuiCache && ativo && aoErro) {
      const erro = new Error("OFFLINE_SEM_CACHE");
      erro.code = "OFFLINE_SEM_CACHE";
      aoErro(erro);
      return;
    }

    conectarFirebase();
  });

  window.addEventListener("online", aoFicarOnline);
  window.addEventListener("offline", aoFicarOffline);

  return () => {
    ativo = false;

    if (cancelarFirebase) {
      cancelarFirebase();
      cancelarFirebase = null;
    }

    window.removeEventListener("online", aoFicarOnline);
    window.removeEventListener("offline", aoFicarOffline);
  };
}

export async function sincronizarColecoes(nomes = COLECOES_PUBLICAS) {
  if (!navigator.onLine) return false;

  let api;

  try {
    api = await carregarFirebase();
  } catch (error) {
    console.warn("Não foi possível iniciar a sincronização offline:", error);
    return false;
  }

  const resultados = await Promise.allSettled(
    nomes.map(async nome => {
      const snapshot = await api.get(api.ref(api.database, nome));
      const dados = snapshot.exists() ? snapshot.val() : {};
      await salvarColecaoLocal(nome, dados);
      return nome;
    })
  );

  return resultados.some(resultado => resultado.status === "fulfilled");
}
