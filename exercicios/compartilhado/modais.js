(() => {
"use strict";
const PAGE_SIZE=10, MIN_TENTATIVAS=3;
const lista=(window.EXERCICIOS_MODAIS||[]).map((registro,indice)=>{
  const entrada=Object.entries(registro||{})[0];
  return entrada?{id:entrada[0],...entrada[1]}:null;
}).filter(Boolean);
const container=document.getElementById("lista-exercicios");
const topo=document.getElementById("paginacao-topo"),base=document.getElementById("paginacao-base");
const resumo=document.getElementById("resumo-pagina"),statusGeral=document.getElementById("status-geral");
const corrigirBtn=document.getElementById("btn-corrigir"),limparBtn=document.getElementById("btn-limpar");
if(!container||!corrigirBtn||!limparBtn)return;
const estados=new Map();let ordem=embaralhar(lista),paginaAtual=0;
const rotulosTipo={multiplas_escolhas:"Múltipla escolha",completar_com_palavra_correta:"Completar",traducao:"Tradução",relacionar:"Relacionar",montar_frase:"Montar frase"};
function embaralhar(array){const copia=[...array];for(let i=copia.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copia[i],copia[j]]=[copia[j],copia[i]];}return copia;}
function el(tag,classe,texto){const n=document.createElement(tag);if(classe)n.className=classe;if(texto!==undefined)n.textContent=texto;return n;}
function normalizar(v){return String(v??"").normalize("NFC").trim().replace(/\s+([.,!?;:])/gu,"$1").replace(/\s+/gu," ").replace(/[.!?…]+$/u,"").toLocaleLowerCase("de-DE");}
function itensDe(ex){if(Array.isArray(ex.itens))return ex.itens;if(!ex.letras)return [];return (Array.isArray(ex.letras)?ex.letras:[ex.letras]);}
function tokens(frase){return String(frase||"").trim().split(/\s+/u).filter(Boolean);}
function novoItemState(item,tipo){const s={tentativas:0,acertou:false,gabaritoVisivel:false,feedback:"",verificou:false,entrada:"",frase:[]};if(tipo==="montar_frase")s.palavras=embaralhar(tokens(item.resposta).map((texto,indice)=>({indice,texto})));return s;}
function novoEstado(ex){const s={tentativas:0,acertou:false,gabaritoVisivel:false,feedback:"",verificou:false};if(ex.tipo==="multiplas_escolhas"){s.alternativas=embaralhar(ex.alternativas||[]);s.selecionada="";}else if(ex.tipo==="relacionar"){s.pares={};s.origemSelecionada=null;s.origens=embaralhar((ex.alternativas||[]).map((texto,indice)=>({indice,texto})));s.destinos=embaralhar((ex.respostas||[]).map((texto,indice)=>({indice,texto})));}else{s.itens=itensDe(ex).map(item=>novoItemState(item,ex.tipo));}return s;}
function estadoDe(ex){if(!estados.has(ex.id))estados.set(ex.id,novoEstado(ex));return estados.get(ex.id);}
function atualizarStatus(area,s,answerText,rationaleText=""){
 const feedback=area.querySelector(".modal-exercise-feedback"),hint=area.querySelector(".modal-attempt-hint"),button=area.querySelector(".modal-reveal-button"),answer=area.querySelector(".modal-answer"),rationale=area.querySelector(".modal-rationale");
 feedback.textContent=s.feedback;feedback.classList.toggle("is-correct",s.verificou&&s.acertou);feedback.classList.toggle("is-wrong",s.verificou&&!s.acertou&&!!s.feedback);
 hint.hidden=s.tentativas===0||s.acertou||s.tentativas>=MIN_TENTATIVAS;
 const faltam=MIN_TENTATIVAS-s.tentativas;
 hint.textContent="Falta"+(faltam===1?"":"m")+" "+faltam+" tentativa"+(faltam===1?"":"s")+" para liberar o gabarito.";
 button.hidden=s.acertou||s.tentativas<MIN_TENTATIVAS;
 answer.hidden=!s.gabaritoVisivel;answer.textContent=s.gabaritoVisivel?answerText:"";
 if(rationale){rationale.hidden=!(s.acertou||s.gabaritoVisivel);rationale.textContent=(s.acertou||s.gabaritoVisivel)&&rationaleText?"Justificativa: "+rationaleText:"";}
}
function respostaItem(item,tipo){if(tipo==="montar_frase")return item.resposta;return (item.respostas_possiveis||[]).join(" / ");}
function criarAreaItem(card,item,s,tipo,indice){
 const area=el("section","modal-subexercise");area.dataset.itemIndex=String(indice);
 area.append(el("div","modal-subexercise-heading","Item "+(item.letra||String.fromCharCode(65+indice))));
 if(tipo==="montar_frase"){
   area.append(el("p","sentence-translation",item.resposta_portugues||""));
   const banco=el("div","sentence-bank"),montada=el("div","sentence-built");
   area.append(el("strong","sentence-label","Palavras disponíveis"),banco,el("strong","sentence-label","Sua frase"),montada);
   function draw(){
     banco.replaceChildren();montada.replaceChildren();const usadas=new Set(s.frase);
     s.palavras.forEach(p=>{const b=el("button","",p.texto);b.type="button";b.disabled=usadas.has(p.indice);b.addEventListener("click",()=>{if(s.acertou)return;s.frase.push(p.indice);s.verificou=false;s.feedback="";draw();});banco.append(b);});
     s.frase.forEach((id,pos)=>{const p=s.palavras.find(x=>x.indice===id),b=el("button","",p?.texto||"");b.type="button";b.addEventListener("click",()=>{if(s.acertou)return;s.frase.splice(pos,1);s.verificou=false;s.feedback="";draw();});montada.append(b);});
   }draw();area._draw=draw;
 }else{
   area.append(el("p","modal-letter-prompt",item.enunciado||""));
   const input=document.createElement("input");input.type="text";input.autocomplete="off";input.spellcheck=false;input.placeholder=tipo==="traducao"?"Digite a tradução em alemão...":"Digite a palavra que falta...";input.value=s.entrada;
   input.addEventListener("input",()=>{s.entrada=input.value;if(!s.acertou){s.verificou=false;s.feedback="";}});
   area.append(input);
 }
 area.append(el("p","modal-exercise-feedback"),el("p","modal-attempt-hint"),el("p","modal-rationale"),el("button","secondary modal-reveal-button","Exibir resposta"),el("div","modal-answer"));
 const btn=area.querySelector(".modal-reveal-button");btn.type="button";btn.hidden=true;btn.addEventListener("click",()=>{s.gabaritoVisivel=true;atualizarStatus(area,s,respostaItem(item,tipo),item.justificativa||"");});
 atualizarStatus(area,s,respostaItem(item,tipo),item.justificativa||"");card.append(area);return area;
}
function criarMultipla(card,ex,s){
 const opcoes=el("div","modal-choice-list");s.alternativas=embaralhar(ex.alternativas||[]);
 s.alternativas.forEach(alternativa=>{const label=el("label","modal-choice"),input=document.createElement("input");input.type="radio";input.name="resposta-"+ex.id;input.value=alternativa;input.checked=s.selecionada===alternativa;input.addEventListener("change",()=>{if(s.acertou)return;s.selecionada=alternativa;s.verificou=false;s.feedback="";});label.append(input,el("span","",alternativa));opcoes.append(label);});card.append(opcoes);
}
function criarRelacionar(card,ex,s){
 const reiniciar=el("button","secondary matching-reset","Reiniciar");reiniciar.type="button";reiniciar.addEventListener("click",()=>{
  s.pares={};s.origemSelecionada=null;s.tentativas=0;s.acertou=false;s.gabaritoVisivel=false;s.verificou=false;s.feedback="";
  atualizar();atualizarStatus(card,s,textoGabaritoPrincipal(ex),ex.justificativa||"");
 });
 card.append(reiniciar);
 const layout=el("div","matching-layout"),a=el("div","matching-column"),b=el("div","matching-column");a.append(el("h3","","Selecione uma opção"));b.append(el("h3","","Selecione o significado"));
 s.origens.forEach(o=>{const btn=el("button","match-source",o.texto);btn.type="button";btn.addEventListener("click",()=>{if(s.acertou||Object.values(s.pares).includes(o.indice))return;s.origemSelecionada=o.indice;atualizar();});a.append(btn);});
 s.destinos.forEach(d=>{const btn=el("button","match-target",d.texto);btn.type="button";btn.addEventListener("click",()=>{if(s.acertou||s.origemSelecionada===null||Object.prototype.hasOwnProperty.call(s.pares,d.indice))return;s.pares[d.indice]=s.origemSelecionada;s.origemSelecionada=null;s.verificou=false;s.feedback="";atualizar();});b.append(btn);});
 layout.append(a,b);card.append(layout);
 function atualizar(){
  a.querySelectorAll("button").forEach((x,i)=>{const usado=Object.values(s.pares).includes(s.origens[i].indice);x.disabled=usado||s.acertou;x.classList.toggle("is-selected",s.origemSelecionada===s.origens[i].indice);x.classList.toggle("is-used",usado);});
  b.querySelectorAll("button").forEach((x,i)=>{const destino=s.destinos[i],origem=s.origens.find(o=>o.indice===s.pares[destino.indice]),usado=Object.prototype.hasOwnProperty.call(s.pares,destino.indice);x.disabled=usado||s.acertou;x.textContent=destino.texto+(origem?"  ← "+origem.texto:"");x.classList.toggle("is-filled",usado);});
 }
 atualizar();
}
function corretaItem(item,s,tipo){if(tipo==="montar_frase"){const frase=s.frase.map(i=>s.palavras.find(p=>p.indice===i)?.texto||"").join(" ");return normalizar(frase)===normalizar(item.resposta);}return (item.respostas_possiveis||[]).some(r=>normalizar(r)===normalizar(s.entrada));}
function temRespostaItem(s,tipo){return tipo==="montar_frase"?s.frase.length>0:!!s.entrada.trim();}
function respostaPrincipal(ex,s){if(ex.tipo==="multiplas_escolhas")return (ex.respostas_possiveis||[]).some(r=>normalizar(r)===normalizar(s.selecionada));if(ex.tipo==="relacionar"){const n=(ex.alternativas||[]).length;return Object.keys(s.pares).length===n&&Array.from({length:n},(_,i)=>Number(s.pares[i])===i).every(Boolean);}return false;}
function textoGabaritoPrincipal(ex){if(ex.tipo==="multiplas_escolhas")return "Resposta: "+(ex.respostas_possiveis||[]).join(" / ");return (ex.alternativas||[]).map((a,i)=>a+" → "+ex.respostas[i]).join(" | ");}
function criarCartao(ex,numero){
 const s=estadoDe(ex),card=el("article","panel modal-exercise");card.dataset.exerciseId=ex.id;
 const head=el("div","modal-exercise-header");head.append(el("span","modal-exercise-number","Exercício "+numero),el("span","modal-exercise-type",rotulosTipo[ex.tipo]||ex.tipo));card.append(head,el("p","modal-exercise-prompt",ex.enunciado||""));
 if(ex.tipo==="multiplas_escolhas")criarMultipla(card,ex,s);
 else if(ex.tipo==="relacionar")criarRelacionar(card,ex,s);
 else{const itens=itensDe(ex);itens.forEach((item,i)=>criarAreaItem(card,item,s.itens[i],ex.tipo,i));}
 if(ex.tipo==="multiplas_escolhas"||ex.tipo==="relacionar"){
   card.append(el("p","modal-exercise-feedback"),el("p","modal-attempt-hint"),el("p","modal-rationale"),el("button","secondary modal-reveal-button","Exibir resposta"),el("div","modal-answer"));
   const btn=card.querySelector(".modal-reveal-button");btn.type="button";btn.hidden=true;btn.addEventListener("click",()=>{s.gabaritoVisivel=true;atualizarStatus(card,s,textoGabaritoPrincipal(ex),ex.justificativa||"");});atualizarStatus(card,s,textoGabaritoPrincipal(ex),ex.justificativa||"");
 }
 return card;
}
function corrigirPagina(){
 const atuais=ordem.slice(paginaAtual*PAGE_SIZE,(paginaAtual+1)*PAGE_SIZE);let acertos=0,respondidos=0;
 atuais.forEach(ex=>{
  const s=estadoDe(ex),card=container.querySelector('[data-exercise-id="'+ex.id+'"]');
  if(ex.tipo==="multiplas_escolhas"||ex.tipo==="relacionar"){
   if(s.acertou){acertos++;respondidos++;return;}
   const tem=ex.tipo==="multiplas_escolhas"?!!s.selecionada:Object.keys(s.pares).length>0;
   if(!tem){s.feedback="Responda a questão antes de corrigir.";s.verificou=false;atualizarStatus(card,s,textoGabaritoPrincipal(ex),ex.justificativa||"");return;}
   s.tentativas++;s.verificou=true;s.acertou=respostaPrincipal(ex,s);s.feedback=s.acertou?"Resposta correta!":"Ainda não. Revise e tente novamente.";if(s.acertou)acertos++;respondidos++;atualizarStatus(card,s,textoGabaritoPrincipal(ex),ex.justificativa||"");
  }else{
   const itens=itensDe(ex);itens.forEach((item,i)=>{const st=s.itens[i],area=card.querySelector('[data-item-index="'+i+'"]');if(st.acertou){acertos++;respondidos++;return;}if(!temRespostaItem(st,ex.tipo)){st.feedback="Responda o item antes de corrigir.";st.verificou=false;atualizarStatus(area,st,respostaItem(item,ex.tipo),item.justificativa||"");return;}st.tentativas++;st.verificou=true;st.acertou=corretaItem(item,st,ex.tipo);st.feedback=st.acertou?"Resposta correta!":"Ainda não. Revise e tente novamente.";if(st.acertou)acertos++;respondidos++;atualizarStatus(area,st,respostaItem(item,ex.tipo),item.justificativa||"");if(area._draw)area._draw();});
  }
 });
 statusGeral.textContent="Nesta página: "+acertos+" acerto(s) · "+respondidos+" item(ns) respondido(s).";
}
function renderizarPagina(){
 container.replaceChildren();const inicio=paginaAtual*PAGE_SIZE;ordem.slice(inicio,inicio+PAGE_SIZE).forEach((ex,i)=>container.append(criarCartao(ex,inicio+i+1)));
 criarPaginacao(topo);criarPaginacao(base);resumo.textContent="São "+ordem.length+" exercícios principais. Nos exercícios agrupados, cada item de A a J tem tentativas e gabarito independentes.";statusGeral.textContent="";
}
function criarPaginacao(destino){destino.replaceChildren();const total=Math.ceil(ordem.length/PAGE_SIZE),ini=paginaAtual*PAGE_SIZE+1,fim=Math.min((paginaAtual+1)*PAGE_SIZE,ordem.length);const prev=el("button","secondary","← Anterior");prev.type="button";prev.disabled=paginaAtual===0;prev.addEventListener("click",()=>mudarPagina(paginaAtual-1));const label=el("span","modais-page-indicator","Página "+(paginaAtual+1)+" de "+total+" · Exercícios "+ini+"–"+fim+" de "+ordem.length);const next=el("button","secondary","Próxima →");next.type="button";next.disabled=paginaAtual>=total-1;next.addEventListener("click",()=>mudarPagina(paginaAtual+1));destino.append(prev,label,next);}
function mudarPagina(n){const total=Math.ceil(ordem.length/PAGE_SIZE);if(n<0||n>=total)return;paginaAtual=n;renderizarPagina();document.querySelector(".hero")?.scrollIntoView({behavior:"smooth",block:"start"});}
function limparPagina(){ordem.slice(paginaAtual*PAGE_SIZE,(paginaAtual+1)*PAGE_SIZE).forEach(ex=>estados.set(ex.id,novoEstado(ex)));renderizarPagina();}
if(!lista.length){container.textContent="Não há exercícios cadastrados.";corrigirBtn.disabled=true;limparBtn.disabled=true;return;}
corrigirBtn.addEventListener("click",corrigirPagina);limparBtn.addEventListener("click",limparPagina);renderizarPagina();
})();