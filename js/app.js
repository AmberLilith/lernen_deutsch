function ensureFavicon(){
 const link = document.createElement("link");
 link.rel = "icon";
 link.type = "image/svg+xml";
 const inSubdirectory = /\/(paginas|exercicios)\//.test(window.location.pathname);
 link.href = inSubdirectory ? "../assets/favicon.svg" : "assets/favicon.svg";
 document.head.appendChild(link);
}

ensureFavicon();

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

function renderExercicios(grupos){
 const container = document.querySelector("#exercicios-dinamicos");
 if(!container) return;

 container.innerHTML = grupos.map(grupo => `
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

function inicializar(conteudos, exercicios){
 renderConteudos(conteudos);
 renderExercicios(exercicios);
 renderLessonNav(conteudos);
 document.querySelectorAll(".answer-input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")checkExercise();}));
}

document.addEventListener("DOMContentLoaded",()=>{
 Promise.all([
   import("./conteudos.js"),
   import("./exercicios.js")
 ])
   .then(([conteudosMod, exerciciosMod]) => inicializar(conteudosMod.conteudos, exerciciosMod.exercicios))
   .catch(error => console.error("Não foi possível carregar a configuração do site:", error));
});

window.checkExercise = checkExercise;
window.clearExercise = clearExercise;
