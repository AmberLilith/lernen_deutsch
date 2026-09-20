import { conteudos } from "./conteudos.js";
import { exercicios } from "./exercicios.js";
import { database } from "./firebase.js";
import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const input = document.getElementById("buscaSite");
const status = document.getElementById("buscaSiteStatus");
const resultados = document.getElementById("buscaSiteResultados");

if (!input || !status || !resultados) {
  throw new Error("Área de pesquisa global não encontrada.");
}

let indicePaginasPromise = null;
let indiceVocabularioPromise = null;
let temporizadorBusca = null;

function normalizar(texto) {
  return String(texto || "")
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensDaBusca(termo) {
  return normalizar(termo).split(" ").filter(Boolean);
}

function corresponde(texto, tokens) {
  const alvo = normalizar(texto);
  return tokens.every(token => alvo.includes(token));
}

function escaparTrecho(texto, termo, limite = 190) {
  const limpo = String(texto || "").replace(/\s+/g, " ").trim();
  if (!limpo) return "";

  const alvo = normalizar(limpo);
  const busca = normalizar(termo);
  const indice = alvo.indexOf(busca);

  if (indice < 0) {
    return limpo.length > limite
      ? limpo.slice(0, limite).trim() + "…"
      : limpo;
  }

  const inicio = Math.max(0, indice - 70);
  const fim = Math.min(limpo.length, inicio + limite);
  const trecho = limpo.slice(inicio, fim).trim();

  return (inicio > 0 ? "… " : "") +
    trecho +
    (fim < limpo.length ? " …" : "");
}

function urlExercicio(arquivo) {
  if (arquivo === "adjetivos-extras.html") {
    return "exercicios/adjetivos-extras/adjetivos-extras.html";
  }

  return "exercicios/" + arquivo;
}

function montarPaginasBase() {
  const paginas = conteudos.map(item => ({
    tipo: "Conteúdo",
    grupo: item.categoria,
    titulo: item.titulo,
    descricao: item.descricao,
    url: "paginas/" + item.arquivo
  }));

  paginas.push(
    {
      tipo: "Conteúdo",
      grupo: "Estrutura das frases",
      titulo: "Conjunções",
      descricao: "Página de estudo sobre conjunções em alemão",
      url: "paginas/conjuncoes.html"
    },
    {
      tipo: "Conteúdo",
      grupo: "Verbos",
      titulo: "Futuro com presente",
      descricao: "Uso do presente do indicativo com sentido de futuro",
      url: "paginas/presentisches-futur.html"
    },
    {
      tipo: "Exercício",
      grupo: "Substantivos",
      titulo: "Vocabulário de substantivos",
      descricao: "Prática de artigos, substantivos e plurais",
      url: "exercicios/vocabulario_substantivos/vocabulario_substantivos.html"
    }
  );

  exercicios.forEach(grupo => {
    grupo.itens.forEach(item => {
      paginas.push({
        tipo: "Exercício",
        grupo: grupo.tema,
        titulo: item.titulo,
        descricao: item.detalhe || "Exercício",
        url: urlExercicio(item.arquivo)
      });
    });
  });

  const unicas = new Map();

  paginas.forEach(item => {
    if (!unicas.has(item.url)) unicas.set(item.url, item);
  });

  return [...unicas.values()];
}

async function obterTextoPagina(item) {
  try {
    const resposta = await fetch(item.url);

    if (!resposta.ok) {
      throw new Error("HTTP " + resposta.status);
    }

    const html = await resposta.text();
    const documento = new DOMParser().parseFromString(html, "text/html");

    documento
      .querySelectorAll("script, style, noscript, svg")
      .forEach(elemento => elemento.remove());

    const principal = documento.querySelector("main") || documento.body;
    const texto = principal?.textContent || "";

    return {
      ...item,
      texto: texto.replace(/\s+/g, " ").trim()
    };
  } catch (erro) {
    console.warn("Não foi possível indexar " + item.url + ":", erro);

    return {
      ...item,
      texto: ""
    };
  }
}

function carregarIndicePaginas() {
  if (!indicePaginasPromise) {
    indicePaginasPromise = Promise.all(
      montarPaginasBase().map(obterTextoPagina)
    );
  }

  return indicePaginasPromise;
}

function transformarSnapshot(snapshot, tipo, url, criarTexto) {
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val()).map(([nome, dados]) => ({
    tipo: "Vocabulário",
    grupo: tipo,
    titulo: nome,
    descricao: criarTexto(dados || {}),
    texto: criarTexto(dados || {}),
    url
  }));
}

function carregarIndiceVocabulario() {
  if (!indiceVocabularioPromise) {
    indiceVocabularioPromise = Promise.all([
      get(ref(database, "substantivos")),
      get(ref(database, "verbos")),
      get(ref(database, "adjetivos"))
    ])
      .then(([substantivos, verbos, adjetivos]) => [
        ...transformarSnapshot(
          substantivos,
          "Substantivos",
          "paginas/vocabulario_substantivos.html",
          dados => [
            dados.artigo,
            dados.traducao,
            dados.plural,
            dados.generoOposto,
            dados.pluralGeneroOposto,
            dados.observacao
          ].filter(Boolean).join(" · ")
        ),
        ...transformarSnapshot(
          verbos,
          "Verbos",
          "paginas/verbos/vocabulario_verbos.html",
          dados => [
            dados.traducao,
            dados.partizip,
            dados.auxiliar,
            dados.prefixo,
            dados.regularidade
          ].filter(Boolean).join(" · ")
        ),
        ...transformarSnapshot(
          adjetivos,
          "Adjetivos",
          "paginas/vocabulario-adjetivos.html",
          dados => [
            dados.traducao,
            dados.comparativo,
            dados.superlativo
          ].filter(Boolean).join(" · ")
        )
      ])
      .catch(erro => {
        console.warn("Não foi possível indexar o vocabulário do Firebase:", erro);
        return [];
      });
  }

  return indiceVocabularioPromise;
}

function criarSecao(titulo) {
  const secao = document.createElement("section");
  secao.className = "site-search-section";

  const heading = document.createElement("h3");
  heading.className = "site-search-section-title";
  heading.textContent = titulo;

  secao.appendChild(heading);
  return secao;
}

function criarResultado(item, termo) {
  const link = document.createElement("a");
  link.className = "site-search-result";
  link.href = item.url;

  const topo = document.createElement("div");
  topo.className = "site-search-result-top";

  const badge = document.createElement("span");
  badge.className = "site-search-badge";
  badge.textContent = item.tipo + " · " + item.grupo;

  const titulo = document.createElement("h3");
  titulo.textContent = item.titulo;

  topo.append(badge, titulo);
  link.appendChild(topo);

  const baseTrecho = item.texto || item.descricao;

  if (baseTrecho) {
    const descricao = document.createElement("p");
    descricao.textContent = escaparTrecho(baseTrecho, termo);
    link.appendChild(descricao);
  }

  return link;
}

function categoriasCorrespondentes(tokens) {
  const grupos = [];

  conteudos.forEach(item => {
    let grupo = grupos.find(atual => atual.nome === item.categoria);

    if (!grupo) {
      grupo = { nome: item.categoria, paginas: [] };
      grupos.push(grupo);
    }

    grupo.paginas.push(item);
  });

  return grupos.filter(grupo =>
    corresponde(grupo.nome, tokens) ||
    grupo.paginas.some(pagina =>
      corresponde(
        [pagina.titulo, pagina.descricao, pagina.tag].join(" "),
        tokens
      )
    )
  );
}

function renderizarCategorias(categorias) {
  if (!categorias.length) return;

  const secao = criarSecao("Assuntos");

  categorias.forEach(grupo => {
    const item = document.createElement("article");
    item.className = "site-search-result";

    const topo = document.createElement("div");
    topo.className = "site-search-result-top";

    const badge = document.createElement("span");
    badge.className = "site-search-badge";
    badge.textContent = "Assunto";

    const titulo = document.createElement("h3");
    titulo.textContent = grupo.nome;

    topo.append(badge, titulo);
    item.appendChild(topo);

    const subitens = document.createElement("div");
    subitens.className = "site-search-subitems";

    grupo.paginas.forEach(pagina => {
      const link = document.createElement("a");
      link.href = "paginas/" + pagina.arquivo;
      link.textContent = pagina.titulo;
      subitens.appendChild(link);
    });

    item.appendChild(subitens);
    secao.appendChild(item);
  });

  resultados.appendChild(secao);
}

function pontuar(item, tokens) {
  const titulo = normalizar(item.titulo);
  const descricao = normalizar(item.descricao);
  const texto = normalizar(item.texto);
  const grupo = normalizar(item.grupo);

  let pontos = 0;

  tokens.forEach(token => {
    if (titulo === token) pontos += 100;
    else if (titulo.startsWith(token)) pontos += 70;
    else if (titulo.includes(token)) pontos += 50;

    if (grupo.includes(token)) pontos += 25;
    if (descricao.includes(token)) pontos += 18;
    if (texto.includes(token)) pontos += 8;
  });

  return pontos;
}

function filtrarItens(itens, tokens) {
  return itens
    .filter(item =>
      corresponde(
        [item.titulo, item.grupo, item.descricao, item.texto].join(" "),
        tokens
      )
    )
    .map(item => ({ item, pontos: pontuar(item, tokens) }))
    .sort((a, b) =>
      b.pontos - a.pontos ||
      a.item.titulo.localeCompare(b.item.titulo, "pt-BR")
    )
    .map(resultado => resultado.item);
}

function renderizarLista(titulo, itens, termo, limite = 20) {
  if (!itens.length) return;

  const secao = criarSecao(titulo);

  itens.slice(0, limite).forEach(item => {
    secao.appendChild(criarResultado(item, termo));
  });

  if (itens.length > limite) {
    const aviso = document.createElement("p");
    aviso.className = "site-search-status";
    aviso.textContent =
      "Mostrando " + limite + " de " + itens.length + " resultados.";
    secao.appendChild(aviso);
  }

  resultados.appendChild(secao);
}

async function pesquisar(termo) {
  const consulta = termo.trim();

  if (consulta.length < 2) {
    resultados.hidden = true;
    resultados.innerHTML = "";
    status.textContent = "Digite ao menos 2 caracteres para pesquisar.";
    return;
  }

  const tokens = tokensDaBusca(consulta);

  status.textContent = "Pesquisando no site...";
  resultados.hidden = true;

  const categorias = categoriasCorrespondentes(tokens);

  const [paginas, vocabulario] = await Promise.all([
    carregarIndicePaginas(),
    carregarIndiceVocabulario()
  ]);

  if (input.value.trim() !== consulta) return;

  const paginasEncontradas = filtrarItens(paginas, tokens);
  const vocabularioEncontrado = filtrarItens(vocabulario, tokens);

  resultados.innerHTML = "";

  renderizarCategorias(categorias);
  renderizarLista("Páginas e exercícios", paginasEncontradas, consulta);
  renderizarLista("Vocabulário", vocabularioEncontrado, consulta);

  const total =
    categorias.length +
    paginasEncontradas.length +
    vocabularioEncontrado.length;

  if (total === 0) {
    const vazio = document.createElement("div");
    vazio.className = "site-search-empty";
    vazio.textContent = "Nenhum resultado encontrado para “" + consulta + "”.";
    resultados.appendChild(vazio);
  }

  resultados.hidden = false;
  status.textContent =
    total === 1
      ? "1 resultado encontrado."
      : total + " resultados encontrados.";
}

input.addEventListener("input", () => {
  clearTimeout(temporizadorBusca);

  temporizadorBusca = setTimeout(() => {
    pesquisar(input.value);
  }, 180);
});

input.addEventListener("search", () => {
  pesquisar(input.value);
});
