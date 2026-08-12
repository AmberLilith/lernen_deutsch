
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
document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".answer-input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")checkExercise();}));
});
