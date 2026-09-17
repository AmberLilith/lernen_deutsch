const VERBOS_POR_PAGINA = 10;

let paginaVerbos = 1;
let verbosFiltrados = [...listaVerbos];

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

/*
 * ============================================================
 * Präsens
 * ============================================================
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
 * ============================================================
 * Präteritum
 * ============================================================
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
 * ============================================================
 * Verbos modais
 * ============================================================
 */

const M = {
  dürfen: [P.dürfen, T.dürfen],
  können: [P.können, T.können],
  mögen: [P.mögen, T.mögen],
  müssen: [P.müssen, T.müssen],
  sollen: [P.sollen, T.sollen],
  wollen: [P.wollen, T.wollen]
};


/*
 * ============================================================
 * METADADOS DOS VERBOS
 *
 * Esta estrutura define as particularidades gramaticais.
 * ============================================================
 */

const METADADOS_VERBOS = {

  /*
   * Verbos normais
   */
  arbeiten: {
    tipo: "normal"
  },

  kaufen: {
    tipo: "normal"
  },

  lernen: {
    tipo: "normal"
  },

  wohnen: {
    tipo: "normal"
  },

  machen: {
    tipo: "normal"
  },


  /*
   * Verbos separáveis
   */
  ankommen: {
    tipo: "separável",
    prefixo: "an"
  },

  anrufen: {
    tipo: "separável",
    prefixo: "an"
  },

  anziehen: {
    tipo: "separável",
    prefixo: "an"
  },

  aufstehen: {
    tipo: "separável",
    prefixo: "auf"
  },

  einkaufen: {
    tipo: "separável",
    prefixo: "ein"
  },


  /*
   * Verbos inseparáveis
   */
  besuchen: {
    tipo: "inseparável",
    prefixo: "be"
  },


  /*
   * Verbos preposicionais
   */
  warten: {
    tipo: "preposicional",
    preposicao: "auf",
    caso: "Akkusativ"
  },

  denken: {
    tipo: "preposicional",
    preposicao: "an",
    caso: "Akkusativ"
  },


  /*
   * Verbos reflexivos
   */
  "sich waschen": {
    tipo: "reflexivo"
  },

  "sich freuen": {
    tipo: "reflexivo"
  },


  /*
   * Verbos reflexivos-preposicionais
   */
  "sich freuen auf": {
    tipo: "reflexivo-preposicional",
    preposicao: "auf",
    caso: "Akkusativ"
  },

  "sich freuen über": {
    tipo: "reflexivo-preposicional",
    preposicao: "über",
    caso: "Akkusativ"
  },

  "sich erinnern an": {
    tipo: "reflexivo-preposicional",
    preposicao: "an",
    caso: "Akkusativ"
  },

  "sich interessieren für": {
    tipo: "reflexivo-preposicional",
    preposicao: "für",
    caso: "Akkusativ"
  },

  "sich kümmern um": {
    tipo: "reflexivo-preposicional",
    preposicao: "um",
    caso: "Akkusativ"
  },


  /*
   * Verbos modais
   */
  dürfen: {
    tipo: "modal"
  },

  können: {
    tipo: "modal"
  },

  mögen: {
    tipo: "modal"
  },

  müssen: {
    tipo: "modal"
  },

  sollen: {
    tipo: "modal"
  },

  wollen: {
    tipo: "modal"
  },


  /*
   * Verbos auxiliares
   */
  sein: {
    tipo: "auxiliar"
  },

  haben: {
    tipo: "auxiliar"
  },

  werden: {
    tipo: "auxiliar"
  },


  /*
   * Verbos impessoais
   */
  regnen: {
    tipo: "impessoal"
  }

};


/*
 * ============================================================
 * FUNÇÕES DE IDENTIFICAÇÃO
 * ============================================================
 */

function obterMetadados(verbo) {
  return METADADOS_VERBOS[verbo] || {};
}


function obterTipo(verbo) {
  return obterMetadados(verbo).tipo || "normal";
}


function base(verbo) {
  const tipo = obterTipo(verbo);

  if (
    tipo === "reflexivo" ||
    tipo === "reflexivo-preposicional"
  ) {
    return verbo.replace(/^sich\s+/, "");
  }

  return verbo;
}


function isReflexivo(verbo) {
  const tipo = obterTipo(verbo);

  return (
    tipo === "reflexivo" ||
    tipo === "reflexivo-preposicional"
  );
}


function isSeparavel(verbo) {
  return obterTipo(verbo) === "separável";
}


function isPreposicional(verbo) {
  const tipo = obterTipo(verbo);

  return (
    tipo === "preposicional" ||
    tipo === "reflexivo-preposicional"
  );
}


function isModal(verbo) {
  return obterTipo(verbo) === "modal";
}


function isImpessoal(verbo) {
  return obterTipo(verbo) === "impessoal";
}


function obterPreposicao(verbo) {
  return obterMetadados(verbo).preposicao || "";
}


function pronomeReflexivo(indice) {
  return reflexivos[indice];
}


/*
 * ============================================================
 * NORMALIZAÇÃO DOS DADOS
 * ============================================================
 *
 * Compatível com o formato atual:
 *
 * [verbo, tradução, Partizip II, auxiliar]
 *
 * Também aceita:
 *
 * [verbo, tradução, Partizip II, auxiliar, tipo]
 *
 * Caso o tipo não seja informado, tenta utilizar os metadados.
 * ============================================================
 */

function normalizarItem(item) {

  const verbo = item[0];

  const tipoInformado = item[4];

  const tipo =
    tipoInformado ||
    obterTipo(verbo);

  return {
    verbo,
    traducao: item[1],
    partizip: item[2],
    auxiliar: item[3],
    tipo
  };
}


/*
 * ============================================================
 * AUXILIAR DO PERFEKT
 * ============================================================
 */

function auxiliarPresente(auxiliar) {

  if (auxiliar === "sein") {
    return P.sein;
  }

  return P.haben;
}


/*
 * ============================================================
 * PRÄSENS
 * ============================================================
 */

function presente(verbo) {

  const b = base(verbo);

  const formas =
    M[b]?.[0] ||
    P[b];

  if (!formas) {
    return ["-", "-", "-", "-", "-", "-"];
  }

  return formas.map((forma, i) => {

    const partes = [forma];

    /*
     * Verbos reflexivos:
     *
     * Ich wasche mich.
     * Du wäschst dich.
     */
    if (isReflexivo(verbo)) {
      partes.push(pronomeReflexivo(i));
    }

    /*
     * Verbos preposicionais:
     *
     * Ich warte auf.
     *
     * A preposição aparece acompanhando o verbo.
     * O objeto será apresentado nos exemplos completos.
     */
    if (isPreposicional(verbo)) {
      partes.push(obterPreposicao(verbo));
    }

    return partes.join(" ");
  });
}


/*
 * ============================================================
 * PRÄTERITUM
 * ============================================================
 */

function preterito(verbo) {

  const b = base(verbo);

  const formas =
    M[b]?.[1] ||
    T[b];

  if (!formas) {
    return ["-", "-", "-", "-", "-", "-"];
  }

  return formas.map((forma, i) => {

    const partes = [forma];

    if (isReflexivo(verbo)) {
      partes.push(pronomeReflexivo(i));
    }

    if (isPreposicional(verbo)) {
      partes.push(obterPreposicao(verbo));
    }

    return partes.join(" ");
  });
}


/*
 * ============================================================
 * PERFEKT
 * ============================================================
 *
 * Estrutura:
 *
 * Ich habe gearbeitet.
 * Ich bin gegangen.
 * Ich habe mich gewaschen.
 * Ich bin aufgestanden.
 *
 * Verbos separáveis já possuem o prefixo no Partizip II.
 * ============================================================
 */

function perfekt(verbo, partizip, auxiliar) {

  const formasAuxiliar =
    auxiliarPresente(auxiliar);

  return formasAuxiliar.map((forma, i) => {

    const partes = [forma];

    /*
     * Reflexivo fica entre o auxiliar e o particípio.
     */
    if (isReflexivo(verbo)) {
      partes.push(pronomeReflexivo(i));
    }

    partes.push(partizip);

    return partes.join(" ");
  });
}


/*
 * ============================================================
 * FUTUR I
 * ============================================================
 *
 * Estrutura:
 *
 * Ich werde arbeiten.
 * Ich werde aufstehen.
 * Ich werde mich waschen.
 * Ich werde mich auf die Reise freuen.
 *
 * O infinitivo permanece inteiro no final.
 * ============================================================
 */

function futur(verbo) {

  const formasWerden = P.werden;

  return formasWerden.map((forma, i) => {

    const partes = [forma];

    if (isReflexivo(verbo)) {
      partes.push(pronomeReflexivo(i));
    }

    partes.push(verbo);

    return partes.join(" ");
  });
}


/*
 * ============================================================
 * CONJUGAÇÃO DE VERBOS MODAIS COM INFINITIVO
 * ============================================================
 *
 * Exemplo:
 *
 * Ich kann Deutsch lernen.
 * Du musst arbeiten.
 * Wir wollen nach Hause gehen.
 * ============================================================
 */

function modalComInfinitivo(verbo, infinitivo = "lernen") {

  const b = base(verbo);

  const formas =
    M[b]?.[0];

  if (!formas) {
    return ["-", "-", "-", "-", "-", "-"];
  }

  return formas.map(forma => {
    return `${forma} ${infinitivo}`;
  });
}


/*
 * ============================================================
 * FUTUR I DE MODAIS
 * ============================================================
 *
 * Exemplo:
 *
 * Ich werde Deutsch lernen können.
 * Du wirst arbeiten müssen.
 * ============================================================
 */

function futurModal(verbo, infinitivo = "lernen") {

  const formasWerden = P.werden;

  const b = base(verbo);

  return formasWerden.map(forma => {
    return `${forma} ${infinitivo} ${b}`;
  });
}


/*
 * ============================================================
 * PERFEKT DE MODAIS
 * ============================================================
 *
 * Exemplo:
 *
 * Ich habe Deutsch lernen können.
 * Du hast arbeiten müssen.
 * ============================================================
 */

function perfektModal(verbo, infinitivo = "lernen") {

  const formasAuxiliar = P.haben;

  const b = base(verbo);

  return formasAuxiliar.map(forma => {
    return `${forma} ${infinitivo} ${b}`;
  });
}


/*
 * ============================================================
 * CRIAÇÃO DAS TABELAS
 * ============================================================
 */

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


/*
 * ============================================================
 * INFORMAÇÕES GRAMATICAIS
 * ============================================================
 */

function criarInformacoesGramaticais(verbo) {

  const dados = obterMetadados(verbo);

  const tipo = dados.tipo || "normal";

  let html = `
    <span>
      <strong>Tipo:</strong>
      ${tipo}
    </span>
  `;

  if (dados.prefixo) {
    html += `
      <span>
        <strong>Prefixo:</strong>
        ${dados.prefixo}
      </span>
    `;
  }

  if (dados.preposicao) {
    html += `
      <span>
        <strong>Preposição:</strong>
        ${dados.preposicao}
      </span>
    `;
  }

  if (dados.caso) {
    html += `
      <span>
        <strong>Caso:</strong>
        ${dados.caso}
      </span>
    `;
  }

  return html;
}


/*
 * ============================================================
 * ABERTURA DO MODAL
 * ============================================================
 */

function abrirModal(item) {

  const dados = normalizarItem(item);

  const titulo =
    document.getElementById("modal-titulo");

  const traducao =
    document.getElementById("modal-traducao");

  const info =
    document.getElementById("modal-info");

  const conjugacao =
    document.getElementById("modal-conjugacao");

  const modal =
    document.getElementById("modal-verbo");


  titulo.textContent = dados.verbo;

  traducao.textContent = dados.traducao;


  const formasPreterito =
    preterito(dados.verbo);


  info.innerHTML = `
    <div class="info-verbo">

      ${criarInformacoesGramaticais(dados.verbo)}

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


  /*
   * Präsens
   */

  conjugacao.appendChild(
    criarTabela(
      "Präsens · Presente",
      presente(dados.verbo)
    )
  );


  /*
   * Präteritum
   */

  conjugacao.appendChild(
    criarTabela(
      "Präteritum · Passado simples",
      formasPreterito
    )
  );


  /*
   * Perfekt
   *
   * Modais possuem construção especial quando
   * acompanhados de outro infinitivo.
   *
   * Como não temos um infinitivo definido no cadastro,
   * exibimos a forma normal do verbo.
   */

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


  /*
   * Futur I
   */

  conjugacao.appendChild(
    criarTabela(
      "Futur I · Futuro",
      futur(dados.verbo)
    )
  );


  /*
   * Abre modal
   */

  modal.classList.add("aberto");

  document.body.style.overflow = "hidden";
}


/*
 * ============================================================
 * FECHAR MODAL
 * ============================================================
 */

function fecharModal() {

  document
    .getElementById("modal-verbo")
    .classList.remove("aberto");

  document.body.style.overflow = "";
}


/*
 * ============================================================
 * RENDERIZAÇÃO DOS VERBOS
 * ============================================================
 */

function renderizarVerbos() {

  const container =
    document.getElementById("lista-verbos");

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

      <p>
        <strong>Tradução:</strong>
        ${dados.traducao}
      </p>

      <p>
        <strong>Tipo:</strong>
        ${dados.tipo}
      </p>

      <p>
        <strong>Präteritum:</strong>
        ${formasPreterito[0]}
      </p>

      <p>
        <strong>Auxiliar:</strong>
        ${dados.auxiliar}
      </p>

      <p>
        <strong>Partizip II:</strong>
        ${dados.partizip}
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
 * ============================================================
 * PESQUISA
 * ============================================================
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
 * ============================================================
 * PAGINAÇÃO
 * ============================================================
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
 * ============================================================
 * MODAL
 * ============================================================
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


/*
 * ============================================================
 * INICIALIZAÇÃO
 * ============================================================
 */

renderizarVerbos();