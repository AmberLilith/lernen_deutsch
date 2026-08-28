const VERBOS_POR_PAGINA = 10;
let paginaVerbos = 1;
let verbosFiltrados = [...listaVerbos];

const pessoas = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
const reflexivos = ["mich", "dich", "sich", "uns", "euch", "sich"];

/*
 * Präsens
 */
const P = {
  arbeiten: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"],
  ankommen: ["komme an", "kommst an", "kommt an", "kommen an", "kommt an", "kommen an"],
  anrufen: ["rufe an", "rufst an", "ruft an", "rufen an", "ruft an", "rufen an"],
  anziehen: ["ziehe an", "ziehst an", "zieht an", "ziehen an", "zieht an", "ziehen an"],
  aufstehen: ["stehe auf", "stehst auf", "steht auf", "stehen auf", "steht auf", "stehen auf"],
  besuchen: ["besuche", "besuchst", "besucht", "besuchen", "besucht", "besuchen"],
  bleiben: ["bleibe", "bleibst", "bleibt", "bleiben", "bleibt", "bleiben"],
  denken: ["denke", "denkst", "denkt", "denken", "denkt", "denken"],
  dürfen: ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"],
  einkaufen: ["kaufe ein", "kaufst ein", "kauft ein", "kaufen ein", "kauft ein", "kaufen ein"],
  essen: ["esse", "isst", "isst", "essen", "esst", "essen"],
  fahren: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
  geben: ["gebe", "gibst", "gibt", "geben", "gebt", "geben"],
  gehen: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
  haben: ["habe", "hast", "hat", "haben", "habt", "haben"],
  helfen: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"],
  kaufen: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"],
  kochen: ["koche", "kochst", "kocht", "kochen", "kocht", "kochen"],
  können: ["kann", "kannst", "kann", "können", "könnt", "können"],
  kommen: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"],
  lernen: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"],
  lesen: ["lese", "liest", "liest", "lesen", "lest", "lesen"],
  machen: ["mache", "machst", "macht", "machen", "macht", "machen"],
  mögen: ["mag", "magst", "mag", "mögen", "mögt", "mögen"],
  müssen: ["muss", "musst", "muss", "müssen", "müsst", "müssen"],
  nehmen: ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"],
  regnen: ["regne", "regnest", "regnet", "regnen", "regnet", "regnen"],
  schwimmen: ["schwimme", "schwimmst", "schwimmt", "schwimmen", "schwimmt", "schwimmen"],
  sehen: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"],
  sein: ["bin", "bist", "ist", "sind", "seid", "sind"],
  sollen: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"],
  sprechen: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"],
  trinken: ["trinke", "trinkst", "trinkt", "trinken", "trinkt", "trinken"],
  warten: ["warte", "wartest", "wartet", "warten", "wartet", "warten"],
  wissen: ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"],
  wollen: ["will", "willst", "will", "wollen", "wollt", "wollen"],
  wohnen: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"],
  werden: ["werde", "wirst", "wird", "werden", "werdet", "werden"],
  waschen: ["wasche", "wäschst", "wäscht", "waschen", "wascht", "waschen"],
  ziehen: ["ziehe", "ziehst", "zieht", "ziehen", "zieht", "ziehen"],
  liegen: ["liege", "liegst", "liegt", "liegen", "liegt", "liegen"],
  stehen: ["stehe", "stehst", "steht", "stehen", "steht", "stehen"],
  legen: ["lege", "legst", "legt", "legen", "legt", "legen"],
  stellen: ["stelle", "stellst", "stellt", "stellen", "stellt", "stellen"],
  hängen: ["hänge", "hängst", "hängt", "hängen", "hängt", "hängen"]
};

/*
 * Präteritum
 */
const T = {
  arbeiten: ["arbeitete", "arbeitetest", "arbeitete", "arbeiteten", "arbeitetet", "arbeiteten"],
  ankommen: ["kam an", "kamst an", "kam an", "kamen an", "kamt an", "kamen an"],
  anrufen: ["rief an", "riefst an", "rief an", "riefen an", "rieft an", "riefen an"],
  anziehen: ["zog an", "zogst an", "zog an", "zogen an", "zogt an", "zogen an"],
  aufstehen: ["stand auf", "standest auf", "stand auf", "standen auf", "standet auf", "standen auf"],
  besuchen: ["besuchte", "besuchtest", "besuchte", "besuchten", "besuchtet", "besuchten"],
  bleiben: ["blieb", "bliebst", "blieb", "blieben", "bliebt", "blieben"],
  denken: ["dachte", "dachtest", "dachte", "dachten", "dachtet", "dachten"],
  dürfen: ["durfte", "durftest", "durfte", "durften", "durftet", "durften"],
  einkaufen: ["kaufte ein", "kauftest ein", "kaufte ein", "kauften ein", "kauftet ein", "kauften ein"],
  essen: ["aß", "aßest", "aß", "aßen", "aßt", "aßen"],
  fahren: ["fuhr", "fuhrst", "fuhr", "fuhren", "fuhrt", "fuhren"],
  geben: ["gab", "gabst", "gab", "gaben", "gabt", "gaben"],
  gehen: ["ging", "gingst", "ging", "gingen", "gingt", "gingen"],
  haben: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
  helfen: ["half", "halfst", "half", "halfen", "halft", "halfen"],
  kaufen: ["kaufte", "kauftest", "kaufte", "kauften", "kauftet", "kauften"],
  kochen: ["kochte", "kochtest", "kochte", "kochten", "kochtet", "kochten"],
  können: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
  kommen: ["kam", "kamst", "kam", "kamen", "kamt", "kamen"],
  lernen: ["lernte", "lerntest", "lernte", "lernten", "lerntet", "lernten"],
  lesen: ["las", "lasest", "las", "lasen", "last", "lasen"],
  machen: ["machte", "machtest", "machte", "machten", "machtet", "machten"],
  mögen: ["mochte", "mochtest", "mochte", "mochten", "mochtet", "mochten"],
  müssen: ["musste", "musstest", "musste", "mussten", "musstet", "mussten"],
  nehmen: ["nahm", "nahmst", "nahm", "nahmen", "nahmt", "nahmen"],
  regnen: ["regnete", "regnetest", "regnete", "regneten", "regnetet", "regneten"],
  schwimmen: ["schwamm", "schwammst", "schwamm", "schwammen", "schwammt", "schwammen"],
  sehen: ["sah", "sahst", "sah", "sahen", "saht", "sahen"],
  sein: ["war", "warst", "war", "waren", "wart", "waren"],
  sollen: ["sollte", "solltest", "sollte", "sollten", "solltet", "sollten"],
  sprechen: ["sprach", "sprachst", "sprach", "sprachen", "spracht", "sprachen"],
  trinken: ["trank", "trankst", "trank", "tranken", "trankt", "tranken"],
  warten: ["wartete", "wartetest", "wartete", "warteten", "wartetet", "warteten"],
  wissen: ["wusste", "wusstest", "wusste", "wussten", "wusstet", "wussten"],
  wollen: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
  wohnen: ["wohnte", "wohntest", "wohnte", "wohnten", "wohntet", "wohnten"],
  werden: ["wurde", "wurdest", "wurde", "wurden", "wurdet", "wurden"],
  waschen: ["wusch", "wuschst", "wusch", "wuschen", "wuscht", "wuschen"],
  ziehen: ["zog", "zogst", "zog", "zogen", "zogt", "zogen"],
  liegen: ["lag", "lagst", "lag", "lagen", "lagt", "lagen"],
  stehen: ["stand", "standest", "stand", "standen", "standet", "standen"],
  legen: ["legte", "legtest", "legte", "legten", "legtet", "legten"],
  stellen: ["stellte", "stelltest", "stellte", "stellten", "stelltet", "stellten"],
  hängen: ["hing", "hingst", "hing", "hingen", "hingt", "hingen"]
};

/*
 * Verbos modais.
 * Präsens e Präteritum completos, pessoa por pessoa.
 */
const M = {
  dürfen: [P.dürfen, T.dürfen],
  können: [P.können, T.können],
  mögen: [P.mögen, T.mögen],
  müssen: [P.müssen, T.müssen],
  sollen: [P.sollen, T.sollen],
  wollen: [P.wollen, T.wollen]
};

function base(verbo) {
  return verbo.replace(/^sich\s+/, "");
}

function isReflexivo(verbo) {
  return verbo.startsWith("sich ");
}

function normalizarItem(item) {
  /*
   * Formato normal:
   * [verbo, tradução, Partizip II, auxiliar]
   */
  return {
    verbo: item[0],
    traducao: item[1],
    partizip: item[2],
    auxiliar: item[3]
  };
}

function adicionarReflexivo(formas, verbo) {
  if (!isReflexivo(verbo)) {
    return [...formas];
  }

  return formas.map((forma, i) => {
    return `${forma} ${reflexivos[i]}`;
  });
}

function presente(verbo) {
  const b = base(verbo);
  const formas = M[b]?.[0] || P[b];

  if (!formas) {
    return ["-", "-", "-", "-", "-", "-"];
  }

  return adicionarReflexivo(formas, verbo);
}

function preterito(verbo) {
  const b = base(verbo);
  const formas = M[b]?.[1] || T[b];

  if (!formas) {
    return ["-", "-", "-", "-", "-", "-"];
  }

  return adicionarReflexivo(formas, verbo);
}

function auxiliarPresente(auxiliar) {
  if (auxiliar === "sein") {
    return P.sein;
  }

  return P.haben;
}

function perfekt(verbo, partizip, auxiliar) {
  const formasAuxiliar = auxiliarPresente(auxiliar);

  return formasAuxiliar.map((forma, i) => {
    const reflexivo = isReflexivo(verbo)
      ? ` ${reflexivos[i]}`
      : "";

    return `${forma}${reflexivo} ${partizip}`;
  });
}

function futur(verbo) {
  return P.werden.map((forma, i) => {
    const reflexivo = isReflexivo(verbo)
      ? ` ${reflexivos[i]}`
      : "";

    return `${forma}${reflexivo} ${verbo}`;
  });
}

function criarTabela(titulo, formas) {
  const section = document.createElement("section");

  section.className = "conjugacao-secao";

  section.innerHTML = `
    <h3>${titulo}</h3>

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

  pessoas.forEach((pessoa, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pessoa}</td>
      <td>${formas[i]}</td>
    `;

    tbody.appendChild(tr);
  });

  return section;
}

function abrirModal(item) {
  const dados = normalizarItem(item);

  const titulo = document.getElementById("modal-titulo");
  const traducao = document.getElementById("modal-traducao");
  const info = document.getElementById("modal-info");
  const conjugacao = document.getElementById("modal-conjugacao");
  const modal = document.getElementById("modal-verbo");

  titulo.textContent = dados.verbo;
  traducao.textContent = dados.traducao;

  const formasPreterito = preterito(dados.verbo);

  info.innerHTML = `
    <div class="info-verbo">
      <span>
        <strong>Partizip II:</strong>
        ${dados.partizip}
      </span>

      <span>
        <strong>Auxiliar:</strong>
        ${dados.auxiliar}
      </span>

      <span>
        <strong>Präteritum:</strong>
        ${formasPreterito[0]}
      </span>
    </div>
  `;

  conjugacao.innerHTML = "";

  conjugacao.appendChild(
    criarTabela(
      "Präsens · Presente",
      presente(dados.verbo)
    )
  );

  conjugacao.appendChild(
    criarTabela(
      "Präteritum · Passado simples",
      formasPreterito
    )
  );

  conjugacao.appendChild(
    criarTabela(
      "Perfekt · Passado composto",
      perfekt(
        dados.verbo,
        dados.partizip,
        dados.auxiliar
      )
    )
  );

  conjugacao.appendChild(
    criarTabela(
      "Futur I · Futuro",
      futur(dados.verbo)
    )
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

  const inicio =
    (paginaVerbos - 1) * VERBOS_POR_PAGINA;

  const fim =
    inicio + VERBOS_POR_PAGINA;

  const paginaAtual =
    verbosFiltrados.slice(inicio, fim);

  paginaAtual.forEach(item => {
    const dados = normalizarItem(item);

    const card = document.createElement("article");

    card.className = "verbo-card";
    card.tabIndex = 0;

    const formasPreterito =
      preterito(dados.verbo);

    card.innerHTML = `
      <h3>${dados.verbo}</h3>

      <p>${dados.traducao}</p>

      <p class="preterito-card">
        <strong>Präteritum:</strong>
        ${formasPreterito[0]}
      </p>

      <p class="partizip">
        ${dados.auxiliar} · ${dados.partizip}
      </p>
    `;

    card.addEventListener("click", () => {
      abrirModal(item);
    });

    card.addEventListener("keydown", event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        abrirModal(item);
      }
    });

    container.appendChild(card);
  });

  if (paginaAtual.length === 0) {
    container.innerHTML = `
      <div class="sem-resultados">
        Nenhum verbo encontrado.
      </div>
    `;
  }

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      verbosFiltrados.length /
      VERBOS_POR_PAGINA
    )
  );

  document.getElementById(
    "pagina-atual"
  ).textContent =
    `Página ${paginaVerbos} de ${totalPaginas}`;

  document.getElementById(
    "pagina-anterior"
  ).disabled =
    paginaVerbos === 1;

  document.getElementById(
    "pagina-proxima"
  ).disabled =
    paginaVerbos >= totalPaginas;

  document.getElementById(
    "resultado-pesquisa"
  ).textContent =
    `${verbosFiltrados.length} verbo(s)`;
}

/*
 * Pesquisa
 */
document
  .getElementById("pesquisa-verbo")
  .addEventListener("input", event => {
    const busca =
      event.target.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    verbosFiltrados =
      listaVerbos.filter(item => {
        const verbo =
          item[0]
            .toLocaleLowerCase("pt-BR");

        const traducao =
          item[1]
            .toLocaleLowerCase("pt-BR");

        return (
          verbo.includes(busca) ||
          traducao.includes(busca)
        );
      });

    paginaVerbos = 1;

    renderizarVerbos();
  });

/*
 * Paginação
 */
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
    const totalPaginas =
      Math.ceil(
        verbosFiltrados.length /
        VERBOS_POR_PAGINA
      );

    if (paginaVerbos < totalPaginas) {
      paginaVerbos++;
      renderizarVerbos();
    }
  });

/*
 * Modal
 */
document
  .getElementById("fechar-modal")
  .addEventListener("click", fecharModal);

document
  .getElementById("modal-verbo")
  .addEventListener("click", event => {
    if (
      event.target.id === "modal-verbo"
    ) {
      fecharModal();
    }
  });

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      fecharModal();
    }
  }
);

renderizarVerbos();