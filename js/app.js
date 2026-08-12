const conteudos = [
  { arquivo: "fundamentos.html", titulo: "Gênero dos substantivos", descricao: "der, die, das; aprender substantivos com o artigo", categoria: "Fundamentos", tag: "Fundamentos" },
  { arquivo: "artigos-definidos.html", titulo: "Artigos definidos", descricao: "der/die/das/die e suas formas nos quatro casos", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "artigos-indefinidos.html", titulo: "Artigos indefinidos", descricao: "ein/eine/ein e suas formas nos casos", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "casos.html", titulo: "Os quatro casos", descricao: "Nominativ, Akkusativ, Dativ e Genitiv", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "negacao.html", titulo: "Negação: nicht e kein", descricao: "quando usar nicht e quando usar kein", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "pronomes.html", titulo: "Pronomes pessoais", descricao: "pronomes pessoais e relação com os casos", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "dativ.html", titulo: "Dativ", descricao: "artigos, preposições e verbos relacionados ao Dativ", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "ndeklination.html", titulo: "n-Deklination", descricao: "substantivos masculinos com formas especiais", categoria: "Artigos e casos", tag: "Gramática" },
  { arquivo: "presente-regulares.html", titulo: "Presente: verbos regulares", descricao: "conjugação e terminações no presente", categoria: "Verbos", tag: "Verbos" },
  { arquivo: "presente-irregulares.html", titulo: "Presente: verbos irregulares", descricao: "mudanças no radical em verbos frequentes", categoria: "Verbos", tag: "Verbos" },
  { arquivo: "modais.html", titulo: "Verbos modais", descricao: "können e outros modais estudados", categoria: "Verbos", tag: "Verbos" },
  { arquivo: "separaveis.html", titulo: "Verbos separáveis", descricao: "verbos como aufstehen e a posição da partícula", categoria: "Verbos", tag: "Verbos" },
  { arquivo: "perfekt.html", titulo: "Perfekt", descricao: "haben/sein + Partizip II", categoria: "Verbos", tag: "Verbos" },
  { arquivo: "ordem-frase.html", titulo: "Ordem das palavras", descricao: "posição do verbo e inversão", categoria: "Estrutura das frases", tag: "Estrutura" },
  { arquivo: "subordinadas.html", titulo: "Orações subordinadas", descricao: "weil e outras estruturas estudadas", categoria: "Estrutura das frases", tag: "Estrutura" },
  { arquivo: "preposicoes.html", titulo: "Preposições", descricao: "mit, bei, von, zu, aus, nach e outras", categoria: "Preposições", tag: "Preposições" },
  { arquivo: "wechsel.html", titulo: "Wechselpräpositionen", descricao: "movimento/direção x localização", categoria: "Preposições", tag: "Preposições" },
  { arquivo: "adjetivos.html", titulo: "Adjetivos", descricao: "terminações e relação com artigo/caso/gênero", categoria: "Adjetivos e vocabulário", tag: "Gramática" },
  { arquivo: "vocabulario_substantivos.html", titulo: "Vocabulário de substantivos acumulado", descricao: "palavras e expressões trabalhadas durante o percurso", categoria: "Adjetivos e vocabulário", tag: "Vocabulário" },
  { arquivo: "indefinidos-plural.html", titulo: "Indefinidos no plural", descricao: "einige, manche e ausência de artigo", categoria: "Adjetivos e vocabulário", tag: "Gramática" }
];

function norm(s){
 return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[“”"']/g,"").replace(/\s+/g," ");
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

function renderConteudos(){
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
   <div class="section">
     <div class="eyebrow">${grupo.nome}</div>
     <div class="grid">
       ${grupo.paginas.map(pagina => `
         <a class="card" href="paginas/${pagina.arquivo}">
           <span class="tag">${pagina.tag}</span>
           <h3>${pagina.titulo}</h3>
           <p>${pagina.descricao}</p>
         </a>
       `).join("")}
     </div>
   </div>
 `).join("");
}

function renderLessonNav(){
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

document.addEventListener("DOMContentLoaded",()=>{
 renderConteudos();
 renderLessonNav();
 document.querySelectorAll(".answer-input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")checkExercise();}));
});
