(() => {
"use strict";
const PAGE_SIZE=10, MIN_TENTATIVAS=3;
const lista=(window.EXERCICIOS_MODAIS||[]).map(registro=>{
  const entrada=Object.entries(registro||{})[0];
  return entrada?{id:entrada[0],...entrada[1]}:null;
}).filter(Boolean);
const container=document.getElementById("lista-exercicios");
const topo=document.getElementById("paginacao-topo");
const base=document.getElementById("paginacao-base");
const resumo=document.getElementById("resumo-pagina");
const statusGeral=document.getElementById("status-geral");
const corrigirBtn=document.getElementById("btn-corrigir");
const limparBtn=document.getElementById("btn-limpar");
if(!container||!corrigirBtn||!limparBtn)return;

const estados=new Map();
let ordem=embaralhar(lista);
let paginaAtual=0;
const rotulosTipo={
  multiplas_escolhas:"Múltipla escolha",
  completar_com_palavra_correta:"Completar",
  traducao:"Tradução",
  relacionar:"Relacionar",
  montar_frase:"Montar frase"
};

function embaralhar(array){
  const copia=[...array];
  for(let i=copia.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copia[i],copia[j]]=[copia[j],copia[i]];
  }
  return copia;
}
function el(tag,classe,texto){
  const node=document.createElement(tag);
  if(classe)node.className=classe;
  if(texto!==undefined)node.textContent=texto;
  return node;
}
function normalizar(valor){
  return String(valor??"").normalize("NFC").trim()
    .replace(/\s+([.,!?;:])/gu,"$1")
    .replace(/\s+/gu," ")
    .replace(/[.!?…]+$/u,"")
    .toLocaleLowerCase("de-DE");
}
function letrasDe(exercicio){
  if(!exercicio.letras)return [];
  return Array.isArray(exercicio.letras)?exercicio.letras:[exercicio.letras];
}
function tokenizar(frase){
  return String(frase||"").trim().split(/\s+/u).filter(Boolean);
}
function novoEstado(exercicio){
  const s={tentativas:0,acertou:false,gabaritoVisivel:false,feedback:"",verificou:false};
  if(exercicio.tipo==="multiplas_escolhas"){
    s.alternativas=embaralhar(exercicio.alternativas||[]);
    s.selecionada="";
  }else if(exercicio.tipo==="completar_com_palavra_correta"||exercicio.tipo==="traducao"){
    s.entradas=letrasDe(exercicio).map(()=>"");
  }else if(exercicio.tipo==="relacionar"){
    s.origens=embaralhar((exercicio.alternativas||[]).map((texto,indice)=>({indice,texto})));
    s.destinos=embaralhar((exercicio.respostas||[]).map((texto,indice)=>({indice,texto})));
    s.pares={};
    s.origemSelecionada=null;
  }else if(exercicio.tipo==="montar_frase"){
    s.palavras=embaralhar(tokenizar((exercicio.resposta||[])[0]).map((texto,indice)=>({indice,texto})));
    s.frase=[];
  }
  return s;
}
function estadoDe(exercicio){
  if(!estados.has(exercicio.id))estados.set(exercicio.id,novoEstado(exercicio));
  return estados.get(exercicio.id);
}
function resetarCorrecao(s){
  s.acertou=false;s.gabaritoVisivel=false;s.feedback="";s.verificou=false;
}
function textoGabarito(exercicio){
  if(exercicio.tipo==="multiplas_escolhas")return "Resposta: "+(exercicio.respostas_possiveis||[]).join(" / ");
  if(exercicio.tipo==="completar_com_palavra_correta"||exercicio.tipo==="traducao"){
    return letrasDe(exercicio).map(l=>l.letra+": "+(l.respostas_possiveis||[]).join(" / ")).join(" · ");
  }
  if(exercicio.tipo==="relacionar"){
    return (exercicio.alternativas||[]).map((a,i)=>a+" → "+exercicio.respostas[i]).join(" | ");
  }
  if(exercicio.tipo==="montar_frase")return "Resposta: "+(exercicio.resposta||[]).join(" / ");
  return "Gabarito indisponível.";
}
function atualizarStatus(card,exercicio,s){
  const feedback=card.querySelector(".modal-exercise-feedback");
  const dica=card.querySelector(".modal-attempt-hint");
  const botao=card.querySelector(".modal-reveal-button");
  const resposta=card.querySelector(".modal-answer");
  feedback.textContent=s.feedback;
  feedback.classList.toggle("is-correct",s.verificou&&s.acertou);
  feedback.classList.toggle("is-wrong",s.verificou&&!s.acertou&&Boolean(s.feedback));
  dica.hidden=s.acertou||s.tentativas>=MIN_TENTATIVAS;
  dica.textContent="Faltam "+Math.max(0,MIN_TENTATIVAS-s.tentativas)+" tentativa(s) para liberar o gabarito.";
  botao.hidden=s.acertou||s.tentativas<MIN_TENTATIVAS;
  resposta.hidden=!s.gabaritoVisivel;
  resposta.textContent=s.gabaritoVisivel?textoGabarito(exercicio):"";
}
function renderizarMultiplasEscolhas(card,exercicio,s){
  const opcoes=el("div","modal-choice-list");
  s.alternativas.forEach(alternativa=>{
    const label=el("label","modal-choice");
    const input=document.createElement("input");
    input.type="radio";input.name="resposta-"+exercicio.id;input.value=alternativa;
    input.checked=s.selecionada===alternativa;
    input.addEventListener("change",()=>{
      s.selecionada=alternativa;resetarCorrecao(s);atualizarStatus(card,exercicio,s);
    });
    label.append(input,el("span","",alternativa));opcoes.appendChild(label);
  });
  card.appendChild(opcoes);
}
function renderizarLetras(card,exercicio,s){
  letrasDe(exercicio).forEach((letra,indice)=>{
    const bloco=el("label","modal-letter-question");
    bloco.append(el("span","modal-letter-label","Item "+(letra.letra||String.fromCharCode(65+indice))));
    bloco.append(el("span","modal-letter-prompt",letra.enunciado||""));
    const input=document.createElement("input");
    input.type="text";input.autocomplete="off";input.spellcheck=false;
    input.placeholder=exercicio.tipo==="traducao"?"Digite a tradução em alemão...":"Digite a palavra que falta...";
    input.value=s.entradas[indice]||"";
    input.addEventListener("input",()=>{
      s.entradas[indice]=input.value;resetarCorrecao(s);atualizarStatus(card,exercicio,s);
    });
    bloco.appendChild(input);card.appendChild(bloco);
  });
}
function renderizarRelacionar(card,exercicio,s){
  const layout=el("div","matching-layout");
  const colunaA=el("div","matching-column"),colunaB=el("div","matching-column");
  colunaA.appendChild(el("h3","","Arraste uma opção"));
  colunaB.appendChild(el("h3","","Solte no significado correspondente"));
  s.origens.forEach(origem=>{
    const botao=el("button","match-source",origem.texto);
    botao.type="button";botao.draggable=true;botao.dataset.sourceIndex=String(origem.indice);
    botao.addEventListener("click",()=>{s.origemSelecionada=origem.indice;atualizar();});
    botao.addEventListener("dragstart",event=>{
      event.dataTransfer.setData("text/plain",String(origem.indice));
      event.dataTransfer.effectAllowed="move";s.origemSelecionada=origem.indice;atualizar();
    });
    colunaA.appendChild(botao);
  });
  s.destinos.forEach(destino=>{
    const alvo=el("div","match-target");
    alvo.dataset.targetIndex=String(destino.indice);alvo.tabIndex=0;alvo.setAttribute("role","button");
    alvo.append(el("span","match-target-text",destino.texto),el("span","match-target-assignment"));
    alvo.addEventListener("dragover",event=>{event.preventDefault();alvo.classList.add("is-over");});
    alvo.addEventListener("dragleave",()=>alvo.classList.remove("is-over"));
    alvo.addEventListener("drop",event=>{
      event.preventDefault();alvo.classList.remove("is-over");
      atribuir(Number(event.dataTransfer.getData("text/plain")),destino.indice);
    });
    alvo.addEventListener("click",()=>{
      if(s.origemSelecionada!==null)atribuir(s.origemSelecionada,destino.indice);
    });
    alvo.addEventListener("keydown",event=>{
      if((event.key==="Enter"||event.key===" ")&&s.origemSelecionada!==null){
        event.preventDefault();atribuir(s.origemSelecionada,destino.indice);
      }
    });
    colunaB.appendChild(alvo);
  });
  layout.append(colunaA,colunaB);card.appendChild(layout);
  function atribuir(origemIndice,destinoIndice){
    if(!Number.isInteger(origemIndice))return;
    Object.keys(s.pares).forEach(chave=>{
      if(Number(s.pares[chave])===origemIndice)delete s.pares[chave];
    });
    s.pares[destinoIndice]=origemIndice;s.origemSelecionada=null;
    resetarCorrecao(s);atualizar();atualizarStatus(card,exercicio,s);
  }
  function atualizar(){
    colunaA.querySelectorAll(".match-source").forEach(botao=>{
      const indice=Number(botao.dataset.sourceIndex);
      botao.classList.toggle("is-selected",s.origemSelecionada===indice);
      botao.classList.toggle("is-used",Object.values(s.pares).some(valor=>Number(valor)===indice));
    });
    colunaB.querySelectorAll(".match-target").forEach(alvo=>{
      const indice=Number(alvo.dataset.targetIndex);
      const origem=s.origens.find(item=>item.indice===Number(s.pares[indice]));
      alvo.querySelector(".match-target-assignment").textContent=origem?"↳ "+origem.texto:"";
      alvo.classList.toggle("is-filled",Boolean(origem));
    });
  }
}
function renderizarMontarFrase(card,exercicio,s){
  card.appendChild(el("p","sentence-translation",exercicio.resposta_portugues||""));
  const banco=el("div","sentence-bank"),montada=el("div","sentence-built");
  card.append(el("strong","sentence-label","Palavras disponíveis"),banco);
  card.append(el("strong","sentence-label","Sua frase"),montada);
  function atualizar(){
    banco.replaceChildren();montada.replaceChildren();
    const usadas=new Set(s.frase);
    s.palavras.forEach(palavra=>{
      const botao=el("button","",palavra.texto);botao.type="button";botao.disabled=usadas.has(palavra.indice);
      botao.addEventListener("click",()=>{
        if(usadas.has(palavra.indice))return;
        s.frase.push(palavra.indice);resetarCorrecao(s);atualizar();atualizarStatus(card,exercicio,s);
      });
      banco.appendChild(botao);
    });
    s.frase.forEach((indice,posicao)=>{
      const palavra=s.palavras.find(item=>item.indice===indice);
      const botao=el("button","",palavra?palavra.texto:"");
      botao.type="button";botao.title="Clique para remover esta palavra";
      if(s.verificou)botao.classList.add(indice===posicao?"is-right":"is-wrong");
      botao.addEventListener("click",()=>{
        s.frase.splice(posicao,1);resetarCorrecao(s);atualizar();atualizarStatus(card,exercicio,s);
      });
      montada.appendChild(botao);
    });
  }
  atualizar();card._atualizarFrase=atualizar;
}
function criarCartao(exercicio,numero){
  const s=estadoDe(exercicio),card=el("article","panel modal-exercise");
  card.dataset.exerciseId=exercicio.id;
  const cabecalho=el("div","modal-exercise-header");
  cabecalho.append(el("span","modal-exercise-number","Exercício "+numero));
  cabecalho.append(el("span","modal-exercise-type",rotulosTipo[exercicio.tipo]||exercicio.tipo));
  card.append(cabecalho,el("p","modal-exercise-prompt",exercicio.enunciado));
  if(exercicio.tipo==="multiplas_escolhas")renderizarMultiplasEscolhas(card,exercicio,s);
  else if(exercicio.tipo==="completar_com_palavra_correta"||exercicio.tipo==="traducao")renderizarLetras(card,exercicio,s);
  else if(exercicio.tipo==="relacionar")renderizarRelacionar(card,exercicio,s);
  else if(exercicio.tipo==="montar_frase")renderizarMontarFrase(card,exercicio,s);
  card.append(el("p","modal-exercise-feedback"),el("p","modal-attempt-hint"),el("button","secondary modal-reveal-button","Verificar resposta"),el("div","modal-answer"));
  const botao=card.querySelector(".modal-reveal-button");
  botao.type="button";botao.hidden=true;
  botao.addEventListener("click",()=>{s.gabaritoVisivel=true;atualizarStatus(card,exercicio,s);});
  atualizarStatus(card,exercicio,s);
  return card;
}
function respostaCorreta(exercicio,s){
  if(exercicio.tipo==="multiplas_escolhas"){
    return (exercicio.respostas_possiveis||[]).some(resposta=>normalizar(resposta)===normalizar(s.selecionada));
  }
  if(exercicio.tipo==="completar_com_palavra_correta"||exercicio.tipo==="traducao"){
    const aceitas=letrasDe(exercicio).map(letra=>letra.respostas_possiveis||[]);
    return s.entradas.length===aceitas.length&&s.entradas.every((entrada,indice)=>
      aceitas[indice].some(resposta=>normalizar(resposta)===normalizar(entrada))
    );
  }
  if(exercicio.tipo==="relacionar"){
    const quantidade=(exercicio.alternativas||[]).length;
    return Object.keys(s.pares).length===quantidade&&
      Array.from({length:quantidade},(_,indice)=>Number(s.pares[indice])===indice).every(Boolean);
  }
  if(exercicio.tipo==="montar_frase"){
    const correta=(exercicio.resposta||[])[0]||"";
    const montada=s.frase.map(indice=>s.palavras.find(item=>item.indice===indice)?.texto||"").join(" ");
    return normalizar(montada)===normalizar(correta);
  }
  return false;
}
function temResposta(exercicio,s){
  if(exercicio.tipo==="multiplas_escolhas")return Boolean(s.selecionada);
  if(exercicio.tipo==="completar_com_palavra_correta"||exercicio.tipo==="traducao")return s.entradas.some(entrada=>entrada.trim()!=="");
  if(exercicio.tipo==="relacionar")return Object.keys(s.pares).length>0;
  if(exercicio.tipo==="montar_frase")return s.frase.length>0;
  return false;
}
function corrigirPagina(){
  const atuais=ordem.slice(paginaAtual*PAGE_SIZE,(paginaAtual+1)*PAGE_SIZE);
  let acertos=0,respondidos=0;
  atuais.forEach(exercicio=>{
    const s=estadoDe(exercicio),card=container.querySelector('[data-exercise-id="'+exercicio.id+'"]');
    if(s.acertou){acertos++;respondidos++;return;}
    if(!temResposta(exercicio,s)){
      s.feedback="Responda a questão antes de corrigir.";s.verificou=false;
      atualizarStatus(card,exercicio,s);return;
    }
    s.tentativas++;s.verificou=true;s.acertou=respostaCorreta(exercicio,s);
    s.feedback=s.acertou?"Resposta correta!":"Ainda não. Revise e tente novamente.";
    if(s.acertou)acertos++;
    respondidos++;atualizarStatus(card,exercicio,s);
    if(typeof card._atualizarFrase==="function")card._atualizarFrase();
  });
  statusGeral.textContent="Nesta página: "+acertos+" acerto(s) · "+respondidos+" questão(ões) respondida(s) de "+atuais.length+".";
}
function limparPagina(){
  ordem.slice(paginaAtual*PAGE_SIZE,(paginaAtual+1)*PAGE_SIZE).forEach(exercicio=>estados.set(exercicio.id,novoEstado(exercicio)));
  renderizarPagina();
}
function criarPaginacao(destino){
  destino.replaceChildren();
  const total=Math.ceil(ordem.length/PAGE_SIZE),inicio=paginaAtual*PAGE_SIZE+1;
  const fim=Math.min((paginaAtual+1)*PAGE_SIZE,ordem.length);
  const anterior=el("button","secondary","← Anterior");anterior.type="button";anterior.disabled=paginaAtual===0;
  anterior.addEventListener("click",()=>mudarPagina(paginaAtual-1));
  const indicador=el("span","modais-page-indicator","Página "+(paginaAtual+1)+" de "+total+" · Exercícios "+inicio+"–"+fim+" de "+ordem.length);
  const proxima=el("button","secondary","Próxima →");proxima.type="button";proxima.disabled=paginaAtual>=total-1;
  proxima.addEventListener("click",()=>mudarPagina(paginaAtual+1));
  destino.append(anterior,indicador,proxima);
}
function renderizarPagina(){
  container.replaceChildren();
  const inicio=paginaAtual*PAGE_SIZE;
  ordem.slice(inicio,inicio+PAGE_SIZE).forEach((exercicio,indice)=>container.appendChild(criarCartao(exercicio,inicio+indice+1)));
  criarPaginacao(topo);criarPaginacao(base);
  resumo.textContent="Os exercícios desta página são corrigidos em conjunto. O gabarito é liberado individualmente após três tentativas.";
  statusGeral.textContent="";
}
function mudarPagina(novaPagina){
  const total=Math.ceil(ordem.length/PAGE_SIZE);
  if(novaPagina<0||novaPagina>=total)return;
  paginaAtual=novaPagina;renderizarPagina();
  document.querySelector(".hero")?.scrollIntoView({behavior:"smooth",block:"start"});
}
if(!lista.length){
  container.textContent="Não há exercícios cadastrados.";
  corrigirBtn.disabled=true;limparBtn.disabled=true;return;
}
corrigirBtn.addEventListener("click",corrigirPagina);
limparBtn.addEventListener("click",limparPagina);
renderizarPagina();
})();