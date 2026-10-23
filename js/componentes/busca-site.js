let proximaInstancia = 0;

export function renderizarBuscaSite(container) {
  if (!(container instanceof HTMLElement)) {
    throw new TypeError("O componente de pesquisa precisa de um elemento HTML.");
  }

  const instancia = ++proximaInstancia;
  const tituloId = `busca-site-${instancia}-titulo`;

  container.innerHTML = `
    <section class="site-search" aria-labelledby="${tituloId}">
      <div class="eyebrow">Pesquisa</div>
      <h2 id="${tituloId}">Pesquisar no material</h2>
      <p class="site-search-intro">
        Pesquise por assunto, página, exercício ou termo presente no conteúdo e no vocabulário.
      </p>

      <div class="site-search-field">
        <span class="site-search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          data-busca-site-input
          placeholder="Ex.: Verbos, Dativ, wohnen, pronomes possessivos..."
          autocomplete="off"
          aria-label="Pesquisar em todo o site"
        >
      </div>

      <p data-busca-site-status class="site-search-status" role="status" aria-live="polite">
        Digite ao menos 2 caracteres para pesquisar.
      </p>

      <div data-busca-site-resultados class="site-search-results" hidden></div>
    </section>
  `;

  return {
    input: container.querySelector("[data-busca-site-input]"),
    status: container.querySelector("[data-busca-site-status]"),
    resultados: container.querySelector("[data-busca-site-resultados]")
  };
}
