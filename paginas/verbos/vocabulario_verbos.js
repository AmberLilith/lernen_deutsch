import { database } from "../../js/firebase.js";
import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const VERBOS_POR_PAGINA = 10;

const pessoas = [
  "ich",
  "du",
  "er/sie/es",
  "wir",
  "ihr",
  "sie/Sie"
];

const reflexivos = [
  "mich",
  "dich",
  "sich",
  "uns",
  "euch",
  "sich"
];

let listaVerbos = [];
let verbosFiltrados = [];
let paginaVerbos = 1;

function normalizarTexto(texto) {
  return (texto || "")
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizarLista(valor) {
  if (Array.isArray(valor)) return valor;

  if (valor && typeof valor === "object") {
    return Object.keys(valor)
      .sort((a, b) => Number(a) - Number(b))
      .map(chave => valor[chave]);
  }

  return [];
}

function infinitivoSemSich(dados) {
  return dados.verbo.replace(/^sich\s+/, "");
}

function infinitivoBaseRegular(dados) {
  let infinitivo = infinitivoSemSich(dados);

  if (
    dados.separavel &&
    dados.prefixo &&
    infinitivo.startsWith(dados.prefixo)
  ) {
    infinitivo = infinitivo.slice(dados.prefixo.length);
  }

  return infinitivo;
}

function radicalDoInfinitivo(infinitivo) {
  if (infinitivo.endsWith("en")) {
    return infinitivo.slice(0, -2);
  }

  if (infinitivo.endsWith("n")) {
    return infinitivo.slice(0, -1);
  }

  return infinitivo;
}

function precisaEDeLigacao(radical) {
  if (/[dt]$/.test(radical)) return true;

  if (/[mn]$/.test(radical)) {
    const anterior = radical.at(-2) || "";

    // Em verbos como wohnen, mahnen e rahmen, o "h" apenas alonga
    // a vogal anterior. Não há encontro consonantal que exija o "e".
    if (/[aeiouäöü]h[mn]$/i.test(radical)) return false;

    // Depois de l ou r também não se acrescenta o "e" de ligação.
    if (anterior === "l" || anterior === "r") return false;

    return true;
  }

  return false;
}

function terminaEmSibilante(radical) {
  return /(s|ß|x|z)$/.test(radical);
}

function completarForma(dados, forma, indice) {
  const partes = [forma];

  if (dados.reflexivo) {
    partes.push(reflexivos[indice]);
  }

  if (dados.separavel && dados.prefixo) {
    partes.push(dados.prefixo);
  }

  return partes.join(" ");
}

function gerarPresenteRegular(dados) {
  const infinitivo = infinitivoBaseRegular(dados);
  const radical = radicalDoInfinitivo(infinitivo);
  const usaE = precisaEDeLigacao(radical);

  const formas = [
    `${radical}e`,
    usaE
      ? `${radical}est`
      : terminaEmSibilante(radical)
        ? `${radical}t`
        : `${radical}st`,
    usaE ? `${radical}et` : `${radical}t`,
    infinitivo,
    usaE ? `${radical}et` : `${radical}t`,
    infinitivo
  ];

  return formas.map((forma, indice) =>
    completarForma(dados, forma, indice)
  );
}

function gerarPreteritoRegular(dados) {
  const infinitivo = infinitivoBaseRegular(dados);
  const radical = radicalDoInfinitivo(infinitivo);
  const usaE = precisaEDeLigacao(radical);

  const formas = usaE
    ? [
        `${radical}ete`,
        `${radical}etest`,
        `${radical}ete`,
        `${radical}eten`,
        `${radical}etet`,
        `${radical}eten`
      ]
    : [
        `${radical}te`,
        `${radical}test`,
        `${radical}te`,
        `${radical}ten`,
        `${radical}tet`,
        `${radical}ten`
      ];

  return formas.map((forma, indice) =>
    completarForma(dados, forma, indice)
  );
}

function presente(dados) {
  if (dados.regularidade === "irregular") {
    const formas = normalizarLista(dados.presente);
    if (formas.length === 6) return formas;
  }

  return gerarPresenteRegular(dados);
}

function preterito(dados) {
  if (dados.regularidade === "irregular") {
    const formas = normalizarLista(dados.preterito);
    if (formas.length === 6) return formas;
  }

  return gerarPreteritoRegular(dados);
}

function obterVerbo(nome) {
  return listaVerbos.find(item => item.verbo === nome);
}

function formasPresenteDoVerbo(nome) {
  const dados = obterVerbo(nome);
  return dados ? presente(dados) : Array(6).fill("-");
}

function perfekt(dados) {
  const auxiliares = dados.auxiliar
    .split("/")
    .map(item => item.trim())
    .filter(Boolean);

  return pessoas.map((_, indice) => {
    const alternativas = auxiliares.map(auxiliar => {
      const formasAuxiliar = formasPresenteDoVerbo(auxiliar);
      const partes = [formasAuxiliar[indice]];

      if (dados.reflexivo) {
        partes.push(reflexivos[indice]);
      }

      partes.push(dados.partizip);

      return partes.join(" ");
    });

    return alternativas.join(" / ");
  });
}

function futur(dados) {
  const formasWerden = formasPresenteDoVerbo("werden");
  const infinitivo = infinitivoSemSich(dados);

  return formasWerden.map((forma, indice) => {
    const partes = [forma];

    if (dados.reflexivo) {
      partes.push(reflexivos[indice]);
    }

    partes.push(infinitivo);

    return partes.join(" ");
  });
}

function caracteristicas(dados) {
  const tipos = [];

  if (dados.separavel) tipos.push("separável");
  if (dados.inseparavel) tipos.push("inseparável");
  if (dados.reflexivo) tipos.push("reflexivo");
  if (dados.preposicional) tipos.push("preposicional");
  if (dados.modal) tipos.push("modal");
  if (dados.verboAuxiliar) tipos.push("auxiliar");
  if (dados.impessoal) tipos.push("impessoal");

  return tipos.length ? tipos.join(", ") : "normal";
}

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function criarTabela(titulo, formas) {
  const section = document.createElement("section");
  section.className = "conjugacao-secao";

  section.innerHTML = `
    <h3>${escaparHTML(titulo)}</h3>
    <table class="tabela-conjugacao">
      <thead>
        <tr>
          <th>Pessoa</th>
          <th>Conjugação</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  const tbody = section.querySelector("tbody");

  pessoas.forEach((pessoa, indice) => {
    const tr = document.createElement("tr");
    const tdPessoa = document.createElement("td");
    const tdForma = document.createElement("td");

    tdPessoa.textContent = pessoa;
    tdForma.textContent = formas[indice] || "-";

    tr.append(tdPessoa, tdForma);
    tbody.appendChild(tr);
  });

  return section;
}

function normalizarRegencias(regencias) {
  return normalizarLista(regencias).filter(Boolean);
}

function criarInformacoesGramaticais(dados) {
  let html = `
    <span>
      <strong>Regularidade:</strong>
      ${escaparHTML(dados.regularidade || "não informada")}
    </span>
    <span>
      <strong>Características:</strong>
      ${escaparHTML(caracteristicas(dados))}
    </span>
  `;

  if (dados.prefixo) {
    html += `
      <span>
        <strong>Prefixo:</strong>
        ${escaparHTML(dados.prefixo)}
      </span>
    `;
  }

  normalizarRegencias(dados.regencias).forEach(regencia => {
    html += `
      <span>
        <strong>Regência:</strong>
        ${escaparHTML(regencia.preposicao)} + ${escaparHTML(regencia.caso)}
      </span>
    `;
  });

  return html;
}

function abrirModal(dados) {
  const titulo = document.getElementById("modal-titulo");
  const traducao = document.getElementById("modal-traducao");
  const info = document.getElementById("modal-info");
  const conjugacao = document.getElementById("modal-conjugacao");
  const modal = document.getElementById("modal-verbo");

  const formasPreterito = preterito(dados);

  titulo.textContent = dados.verbo;
  traducao.textContent = dados.traducao;

  info.innerHTML = `
    <div class="info-verbo">
      ${criarInformacoesGramaticais(dados)}
      <span>
        <strong>Partizip II:</strong>
        ${escaparHTML(dados.partizip)}
      </span>
      <span>
        <strong>Auxiliar:</strong>
        ${escaparHTML(dados.auxiliar)}
      </span>
      <span>
        <strong>Präteritum:</strong>
        ${escaparHTML(formasPreterito[0])}
      </span>
    </div>
  `;

  conjugacao.innerHTML = "";
  conjugacao.appendChild(
    criarTabela("Präsens · Presente", presente(dados))
  );
  conjugacao.appendChild(
    criarTabela("Präteritum · Passado simples", formasPreterito)
  );
  conjugacao.appendChild(
    criarTabela("Perfekt · Passado composto", perfekt(dados))
  );
  conjugacao.appendChild(
    criarTabela("Futur I · Futuro", futur(dados))
  );

  modal.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  document
    .getElementById("modal-verbo")
    .classList.remove("aberto");

  document.body.style.overflow = "";
}

function renderizarVerbos() {
  const container = document.getElementById("lista-verbos");
  container.innerHTML = "";

  const inicio = (paginaVerbos - 1) * VERBOS_POR_PAGINA;
  const fim = inicio + VERBOS_POR_PAGINA;
  const itensDaPagina = verbosFiltrados.slice(inicio, fim);

  itensDaPagina.forEach(dados => {
    const card = document.createElement("article");
    card.className = "verbo-card";
    card.tabIndex = 0;

    const formasPreterito = preterito(dados);

    card.innerHTML = `
      <h3>${escaparHTML(dados.verbo)}</h3>
      <p>
        <strong>Tradução:</strong>
        ${escaparHTML(dados.traducao)}
      </p>
      <p>
        <strong>Regularidade:</strong>
        ${escaparHTML(dados.regularidade)}
      </p>
      <p>
        <strong>Tipo:</strong>
        ${escaparHTML(caracteristicas(dados))}
      </p>
      <p>
        <strong>Präteritum:</strong>
        ${escaparHTML(formasPreterito[0])}
      </p>
      <p>
        <strong>Auxiliar:</strong>
        ${escaparHTML(dados.auxiliar)}
      </p>
      <p>
        <strong>Partizip II:</strong>
        ${escaparHTML(dados.partizip)}
      </p>
    `;

    card.addEventListener("click", () => abrirModal(dados));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrirModal(dados);
      }
    });

    container.appendChild(card);
  });

  if (itensDaPagina.length === 0) {
    container.innerHTML = `
      <div class="sem-resultados">
        Nenhum verbo encontrado.
      </div>
    `;
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(verbosFiltrados.length / VERBOS_POR_PAGINA)
  );

  if (paginaVerbos > totalPaginas) {
    paginaVerbos = totalPaginas;
    renderizarVerbos();
    return;
  }

  document.getElementById("pagina-atual").textContent =
    `Página ${paginaVerbos} de ${totalPaginas}`;

  document.getElementById("pagina-anterior").disabled =
    paginaVerbos === 1;

  document.getElementById("pagina-proxima").disabled =
    paginaVerbos >= totalPaginas;

  document.getElementById("resultado-pesquisa").textContent =
    `${verbosFiltrados.length} verbo(s)`;
}

function aplicarFiltro() {
  const busca = normalizarTexto(
    document.getElementById("pesquisa-verbo").value.trim()
  );

  verbosFiltrados = listaVerbos.filter(item => {
    return (
      normalizarTexto(item.verbo).includes(busca) ||
      normalizarTexto(item.traducao).includes(busca)
    );
  });

  paginaVerbos = 1;
  renderizarVerbos();
}

document
  .getElementById("pesquisa-verbo")
  .addEventListener("input", aplicarFiltro);

document
  .getElementById("pagina-anterior")
  .addEventListener("click", () => {
    if (paginaVerbos > 1) {
      paginaVerbos--;
      renderizarVerbos();
    }
  });

document
  .getElementById("pagina-proxima")
  .addEventListener("click", () => {
    const totalPaginas = Math.ceil(
      verbosFiltrados.length / VERBOS_POR_PAGINA
    );

    if (paginaVerbos < totalPaginas) {
      paginaVerbos++;
      renderizarVerbos();
    }
  });

document
  .getElementById("fechar-modal")
  .addEventListener("click", fecharModal);

document
  .getElementById("modal-verbo")
  .addEventListener("click", event => {
    if (event.target.id === "modal-verbo") {
      fecharModal();
    }
  });

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    fecharModal();
  }
});

function carregarVerbos() {
  const resultado = document.getElementById("resultado-pesquisa");
  const container = document.getElementById("lista-verbos");

  resultado.textContent = "Carregando verbos...";

  onValue(
    ref(database, "verbos"),
    snapshot => {
      if (!snapshot.exists()) {
        listaVerbos = [];
        verbosFiltrados = [];
        renderizarVerbos();
        return;
      }

      listaVerbos = Object.entries(snapshot.val())
        .map(([verbo, dados]) => ({
          verbo,
          ...dados
        }))
        .sort((a, b) =>
          a.verbo.localeCompare(b.verbo, "de", { sensitivity: "base" })
        );

      aplicarFiltro();
    },
    error => {
      console.error("Não foi possível carregar os verbos do Firebase:", error);
      resultado.textContent = "Não foi possível carregar os verbos.";
      container.innerHTML = `
        <div class="sem-resultados">
          Não foi possível carregar o vocabulário.
        </div>
      `;
      document.querySelector(".paginacao-verbos").style.display = "none";
    }
  );
}

carregarVerbos();
