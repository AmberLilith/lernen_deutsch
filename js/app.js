function ensureFavicon(){
 const link = document.createElement("link");
 link.rel = "icon";
 link.type = "image/svg+xml";
 const inSubdirectory = /\/(paginas|exercicios)\//.test(window.location.pathname);
 link.href = inSubdirectory ? "../assets/favicon.svg" : "assets/favicon.svg";
 document.head.appendChild(link);
}

ensureFavicon();

function ensureAdminLink(){
 const footer = document.querySelector(".site-footer .footer-inner");
 if(!footer || footer.querySelector(".footer-admin")) return;

 const inicio = [...footer.querySelectorAll("a")].find(link =>
   link.textContent.includes("Início")
 );

 if(!inicio) return;

 const links = document.createElement("div");
 links.className = "footer-links";

 inicio.replaceWith(links);
 links.appendChild(inicio);

 const admin = document.createElement("a");
 admin.className = "footer-admin";
 admin.href = "https://amberlilith.github.io/lernen-deutsch-admin/";
 admin.textContent = "Admin";
 admin.title = "Painel administrativo";

 links.appendChild(admin);
}

function agruparConteudos(conteudos){
 const categorias = [];
 conteudos.forEach(pagina => {
   let grupo = categorias.find(item => item.nome === pagina.categoria);
   if(!grupo){
     grupo = { nome: pagina.categoria, paginas: [] };
     categorias.push(grupo);
   }
   grupo.paginas.push(pagina);
 });
 return categorias;
}

function obterRaizSite(){
 const scriptApp = [...document.scripts].find(script =>
   /\/js\/app\.js(?:\?|$)/.test(script.src)
 );
 if(scriptApp?.src) return new URL("../", scriptApp.src);

 const marca = document.querySelector(".brand");
 if(marca){
   const paginaInicial = new URL(marca.getAttribute("href"), window.location.href);
   return new URL("./", paginaInicial);
 }

 return new URL("./", window.location.href);
}

function renderMenuLateral(conteudos){
 if(document.querySelector(".side-menu")) return;

 const raizSite = obterRaizSite();
 const categorias = agruparConteudos(conteudos);
 const caminhoAtual = decodeURIComponent(window.location.pathname);

 const botaoAbrir = document.createElement("button");
 botaoAbrir.type = "button";
 botaoAbrir.className = "side-menu-toggle";
 botaoAbrir.setAttribute("aria-controls", "menu-lateral");
 botaoAbrir.setAttribute("aria-expanded", "false");
 botaoAbrir.setAttribute("aria-label", "Abrir menu de conteúdos");

 const icone = document.createElement("span");
 icone.className = "side-menu-toggle-icon";
 icone.setAttribute("aria-hidden", "true");
 icone.textContent = "☰";

 const rotulo = document.createElement("span");
 rotulo.className = "side-menu-toggle-label";
 rotulo.textContent = "Conteúdos";

 botaoAbrir.append(icone, rotulo);

 const nav = document.querySelector(".nav");
 if(nav){
   nav.appendChild(botaoAbrir);
 }else{
   botaoAbrir.classList.add("side-menu-toggle--floating");
   document.body.appendChild(botaoAbrir);
 }

 const fundo = document.createElement("div");
 fundo.className = "side-menu-backdrop";
 fundo.hidden = true;

 const menu = document.createElement("aside");
 menu.id = "menu-lateral";
 menu.className = "side-menu";
 menu.setAttribute("aria-label", "Menu de conteúdos");
 menu.setAttribute("aria-hidden", "true");

 const topo = document.createElement("div");
 topo.className = "side-menu-header";

 const tituloArea = document.createElement("div");
 const eyebrow = document.createElement("span");
 eyebrow.className = "side-menu-eyebrow";
 eyebrow.textContent = "Mapa do estudo";

 const titulo = document.createElement("h2");
 titulo.textContent = "Conteúdos";
 tituloArea.append(eyebrow, titulo);

 const botaoFechar = document.createElement("button");
 botaoFechar.type = "button";
 botaoFechar.className = "side-menu-close";
 botaoFechar.setAttribute("aria-label", "Fechar menu");
 botaoFechar.textContent = "×";

 topo.append(tituloArea, botaoFechar);
 menu.appendChild(topo);

 const inicio = document.createElement("a");
 inicio.className = "side-menu-home";
 inicio.href = new URL("index.html#conteudos", raizSite).href;
 inicio.textContent = "Todos os conteúdos";
 menu.appendChild(inicio);

 const listaCategorias = document.createElement("nav");
 listaCategorias.className = "side-menu-groups";
 listaCategorias.setAttribute("aria-label", "Seções de conteúdo");

 categorias.forEach(grupo => {
   const detalhes = document.createElement("details");
   detalhes.className = "side-menu-group";

   const resumo = document.createElement("summary");
   resumo.textContent = grupo.nome;
   detalhes.appendChild(resumo);

   const lista = document.createElement("div");
   lista.className = "side-menu-links";

   let grupoAtual = false;

   grupo.paginas.forEach(pagina => {
     const link = document.createElement("a");
     const destino = new URL("paginas/" + pagina.arquivo, raizSite);
     link.href = destino.href;
     link.textContent = pagina.titulo;

     if(decodeURIComponent(destino.pathname) === caminhoAtual){
       link.classList.add("ativo");
       link.setAttribute("aria-current", "page");
       grupoAtual = true;
     }

     lista.appendChild(link);
   });

   detalhes.open = grupoAtual;
   detalhes.appendChild(lista);
   listaCategorias.appendChild(detalhes);
 });

 menu.appendChild(listaCategorias);
 document.body.append(fundo, menu);

 let ultimoFoco = null;

 function abrirMenu(){
   ultimoFoco = document.activeElement;
   menu.classList.add("aberto");
   fundo.hidden = false;
   requestAnimationFrame(() => fundo.classList.add("visivel"));
   document.body.classList.add("side-menu-open");
   menu.setAttribute("aria-hidden", "false");
   botaoAbrir.setAttribute("aria-expanded", "true");
   botaoFechar.focus();
 }

 function fecharMenu(){
   menu.classList.remove("aberto");
   fundo.classList.remove("visivel");
   document.body.classList.remove("side-menu-open");
   menu.setAttribute("aria-hidden", "true");
   botaoAbrir.setAttribute("aria-expanded", "false");

   setTimeout(() => {
     if(!menu.classList.contains("aberto")) fundo.hidden = true;
   }, 180);

   if(ultimoFoco instanceof HTMLElement) ultimoFoco.focus();
 }

 botaoAbrir.addEventListener("click", abrirMenu);
 botaoFechar.addEventListener("click", fecharMenu);
 fundo.addEventListener("click", fecharMenu);

 menu.querySelectorAll("a").forEach(link => {
   link.addEventListener("click", fecharMenu);
 });

 document.addEventListener("keydown", event => {
   if(event.key === "Escape" && menu.classList.contains("aberto")){
     fecharMenu();
   }
 });
}

function norm(s){
 return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[“”\"']/g,"").replace(/\s+/g," ");
}

function checkExercise(){
 const items=[...document.querySelectorAll("[data-answer]")];
 let ok=0;
 items.forEach(item=>{
   const input=item.querySelector(".answer-input"), feedback=item.querySelector(".feedback");
   const accepted=(item.dataset.answer||"").split("|").map(norm);
   const val=norm(input.value);
   if(accepted.includes(val)){
     ok++; feedback.textContent="✓ Correta"; feedback.className="feedback correct";
     input.style.borderColor="var(--green)";
   }else{
     feedback.textContent="✗ Incorreta"; feedback.className="feedback incorrect";
     input.style.borderColor="var(--red)";
   }
 });
 const score=document.querySelector(".score");
 if(score){score.style.display="block";score.textContent=`Resultado: ${ok} de ${items.length} correta(s).`;}
 const bar=document.querySelector(".progress span");
 if(bar) bar.style.width=(ok/items.length*100)+"%";
}

function clearExercise(){
 document.querySelectorAll(".answer-input").forEach(i=>{i.value="";i.style.borderColor="";});
 document.querySelectorAll(".feedback").forEach(f=>{f.textContent="";f.className="feedback";});
 const score=document.querySelector(".score"); if(score) score.style.display="none";
 const bar=document.querySelector(".progress span"); if(bar) bar.style.width="0";
}

function renderConteudos(conteudos){
 const container = document.querySelector("#conteudos-dinamicos");
 if(!container) return;

 const categorias = [];
 conteudos.forEach(pagina => {
   let grupo = categorias.find(item => item.nome === pagina.categoria);
   if(!grupo){
     grupo = { nome: pagina.categoria, paginas: [] };
     categorias.push(grupo);
   }
   grupo.paginas.push(pagina);
 });

 container.innerHTML = categorias.map(grupo => `
   <details class="content-group">
     <summary>${grupo.nome}</summary>
     <div class="grid">
       ${grupo.paginas.map(pagina => `
         <a class="card" href="paginas/${pagina.arquivo}">
           <span class="tag">${pagina.tag}</span>
           <h3>${pagina.titulo}</h3>
           <p>${pagina.descricao}</p>
         </a>
       `).join("")}
     </div>
   </details>
 `).join("");
}

function renderLessonNav(conteudos){
 const nav = document.querySelector(".lesson-nav");
 if(!nav) return;

 const arquivoAtual = decodeURIComponent(window.location.pathname.split("/").pop());
 const indice = conteudos.findIndex(pagina => pagina.arquivo === arquivoAtual);
 if(indice === -1) return;

 const anterior = conteudos[indice - 1];
 const proxima = conteudos[indice + 1];

 nav.innerHTML = `
   ${anterior ? `<a href="${anterior.arquivo}">← ${anterior.titulo}</a>` : `<span></span>`}
   ${proxima ? `<a href="${proxima.arquivo}">${proxima.titulo} →</a>` : `<a href="../index.html">Início →</a>`}
 `;
}

async function contarExercicios(item){
 if(!item.contagemDinamica) return item.detalhe;

 try{
   const resposta = await fetch(`exercicios/${item.arquivo}`);
   if(!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
   const html = await resposta.text();
   const quantidade = (html.match(/data-answer\s*=/g) || []).length;
   return `${quantidade} exercícios`;
 }catch(error){
   console.error(`Não foi possível contar os exercícios de ${item.arquivo}:`, error);
   return "Exercícios";
 }
}

async function renderExercicios(grupos){
 const container = document.querySelector("#exercicios-dinamicos");
 if(!container) return;

 const gruposRenderizados = await Promise.all(grupos.map(async grupo => ({
   ...grupo,
   itens: await Promise.all(grupo.itens.map(async item => ({
     ...item,
     detalhe: await contarExercicios(item)
   })))
 })));

 container.innerHTML = gruposRenderizados.map(grupo => `
   <details class="exercise-group">
     <summary>${grupo.tema}</summary>
     <div class="exercise-list">
       ${grupo.itens.map(item => `
         <a class="exercise-link" href="exercicios/${item.arquivo}">
           <span>${item.titulo} · <span class="note">${item.detalhe}</span></span>
           <span class="arrow">→</span>
         </a>
       `).join("")}
     </div>
   </details>
 `).join("");
}

async function inicializar(conteudos, exercicios){
 renderMenuLateral(conteudos);
 renderConteudos(conteudos);
 await renderExercicios(exercicios);
 renderLessonNav(conteudos);
 document.querySelectorAll(".answer-input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")checkExercise();}));
}

document.addEventListener("DOMContentLoaded",()=>{
 ensureAdminLink();
 Promise.all([
   import("./conteudos.js"),
   import("./exercicios.js")
 ])
   .then(([conteudosMod, exerciciosMod]) => inicializar(conteudosMod.conteudos, exerciciosMod.exercicios))
   .catch(error => console.error("Não foi possível carregar a configuração do site:", error));
});

function showAnswer(button) {
        const question = button.parentElement;
        const answerElement = question.querySelector(".answer");
        const resposta = question.dataset.answer;

        answerElement.textContent = `Resposta: ${resposta}`;
    }

function renderQuestions(container, list) {
  list.forEach(item => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.setAttribute('data-answer', item.answer);

    const promptDiv = document.createElement('div');
    promptDiv.className = 'prompt';
    promptDiv.textContent = item.question;

    const input = document.createElement('input');
    input.className = 'answer-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Escreva sua resposta...';

    const button = document.createElement('button');
    button.className = 'showAnswer';
    button.textContent = 'Exibir Resposta';
    button.addEventListener('click', function() {
      showAnswer(this);
    });

    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer';

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';

    questionDiv.appendChild(promptDiv);
    questionDiv.appendChild(input);
    questionDiv.appendChild(button);
    questionDiv.appendChild(answerDiv);
    questionDiv.appendChild(feedbackDiv);

    container.appendChild(questionDiv);
  });
}

window.checkExercise = checkExercise;
window.clearExercise = clearExercise;
window.renderQuestions = renderQuestions;
