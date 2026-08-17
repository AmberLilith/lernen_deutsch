const VERBOS_POR_PAGINA = 10;
let paginaVerbos = 1;
let verbosFiltrados = [...listaVerbos];
const pessoas = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
const reflexivos = ["mich", "dich", "sich", "uns", "euch", "sich"];

const P = {
  sein:["bin","bist","ist","sind","seid","sind"], haben:["habe","hast","hat","haben","habt","haben"],
  werden:["werde","wirst","wird","werden","werdet","werden"], fahren:["fahre","fährst","fährt","fahren","fahrt","fahren"],
  sehen:["sehe","siehst","sieht","sehen","seht","sehen"], sprechen:["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],
  nehmen:["nehme","nimmst","nimmt","nehmen","nehmt","nehmen"], essen:["esse","isst","isst","essen","esst","essen"],
  geben:["gebe","gibst","gibt","geben","gebt","geben"], gehen:["gehe","gehst","geht","gehen","geht","gehen"],
  kommen:["komme","kommst","kommt","kommen","kommt","kommen"], lesen:["lese","liest","liest","lesen","lest","lesen"],
  trinken:["trinke","trinkst","trinkt","trinken","trinkt","trinken"], helfen:["helfe","hilfst","hilft","helfen","helft","helfen"],
  denken:["denke","denkst","denkt","denken","denkt","denken"], wissen:["weiß","weißt","weiß","wissen","wisst","wissen"],
  bleiben:["bleibe","bleibst","bleibt","bleiben","bleibt","bleiben"], schwimmen:["schwimme","schwimmst","schwimmt","schwimmen","schwimmt","schwimmen"],
  waschen:["wasche","wäschst","wäscht","waschen","wascht","waschen"]
};
const T = {
  sein:["war","warst","war","waren","wart","waren"], haben:["hatte","hattest","hatte","hatten","hattet","hatten"],
  werden:["wurde","wurdest","wurde","wurden","wurdet","wurden"], fahren:["fuhr","fuhrst","fuhr","fuhren","fuhrt","fuhren"],
  sehen:["sah","sahst","sah","sahen","saht","sahen"], sprechen:["sprach","sprachst","sprach","sprachen","spracht","sprachen"],
  nehmen:["nahm","nahmst","nahm","nahmen","nahmt","nahmen"], essen:["aß","aßest","aß","aßen","aßt","aßen"],
  geben:["gab","gabst","gab","gaben","gabt","gaben"], gehen:["ging","gingst","ging","gingen","gingt","gingen"],
  kommen:["kam","kamst","kam","kamen","kamt","kamen"], lesen:["las","lasest","las","lasen","last","lasen"],
  trinken:["trank","trankst","trank","tranken","trankt","tranken"], helfen:["half","halfst","half","halfen","halft","halfen"],
  denken:["dachte","dachtest","dachte","dachten","dachtet","dachten"], wissen:["wusste","wusstest","wusste","wussten","wusstet","wussten"],
  bleiben:["blieb","bliebst","blieb","blieben","bliebt","blieben"], schwimmen:["schwamm","schwammst","schwamm","schwammen","schwammt","schwammen"],
  waschen:["wusch","wuschst","wusch","wuschen","wuscht","wuschen"]
};
const M = {
  dürfen:[["darf","darfst","darf","dürfen","dürft","dürfen"],["durfte","durftest","durfte","durften","durftet","durften"]],
  können:[["kann","kannst","kann","können","könnt","können"],["konnte","konntest","konnte","konnten","konntet","konnten"]],
  mögen:[["mag","magst","mag","mögen","mögt","mögen"],["mochte","mochtest","mochte","mochten","mochtet","mochten"]],
  müssen:[["muss","musst","muss","müssen","müsst","müssen"],["musste","musstest","musste","mussten","musstet","mussten"]],
  sollen:[["soll","sollst","soll","sollen","sollt","sollen"],["sollte","solltest","sollte","sollten","solltet","sollten"]],
  wollen:[["will","willst","will","wollen","wollt","wollen"],["wollte","wolltest","wollte","wollten","wolltet","wollten"]]
};

const FUTURO_PRESENS = {
  arbeiten:"Morgen arbeite ich zu Hause.", ankommen:"Ich komme morgen um acht Uhr an.", anrufen:"Ich rufe dich morgen an.", anziehen:"Morgen ziehe ich meine neue Jacke an.",
  aufstehen:"Morgen stehe ich um sieben Uhr auf.", besuchen:"Morgen besuche ich meine Familie.", bleiben:"Ich bleibe morgen zu Hause.", denken:"Morgen denke ich darüber nach.",
  dürfen:"Morgen darf ich länger schlafen.", einkaufen:"Morgen kaufe ich im Supermarkt ein.", essen:"Heute Abend esse ich zu Hause.", fahren:"Morgen fahre ich nach Berlin.",
  geben:"Morgen gebe ich dir das Buch.", gehen:"Morgen gehe ich zur Arbeit.", haben:"Morgen habe ich keine Zeit.", helfen:"Morgen helfe ich dir.",
  kaufen:"Morgen kaufe ich ein neues Handy.", kochen:"Heute Abend koche ich eine Suppe.", können:"Morgen kann ich dir helfen.", kommen:"Morgen komme ich früher.",
  lernen:"Heute Abend lerne ich Deutsch.", lesen:"Heute Abend lese ich ein Buch.", machen:"Morgen mache ich die Hausaufgaben.", mögen:"Morgen mag ich vielleicht etwas anderes.",
  müssen:"Morgen muss ich arbeiten.", nehmen:"Morgen nehme ich den Zug.", regnen:"Morgen regnet es wahrscheinlich.", schwimmen:"Morgen schwimme ich im See.",
  sehen:"Morgen sehe ich meine Freunde.", sein:"Morgen bin ich zu Hause.", sollen:"Morgen soll ich früher kommen.", sprechen:"Morgen spreche ich mit dem Lehrer.",
  trinken:"Heute Abend trinke ich Tee.", warten:"Morgen warte ich vor dem Bahnhof.", wissen:"Morgen weiß ich mehr.", wollen:"Morgen will ich länger schlafen.",
  wohnen:"Nächstes Jahr wohne ich in Berlin.", werden:"Bald werde ich besser Deutsch sprechen.", "sich waschen":"Heute Abend wasche ich mich.",
  "sich anziehen":"Morgen ziehe ich mich warm an.", "sich freuen":"Morgen freue ich mich auf das Wochenende.", "sich fühlen":"Morgen fühle ich mich besser.",
  "sich setzen":"Gleich setze ich mich hier hin.", "sich beeilen":"Ich beeile mich, damit ich den Zug nicht verpasse.", "sich erinnern":"Morgen erinnere ich mich daran."
};

function base(v){return v.replace(/^sich\s+/,"");}
function isRef(v){return v.startsWith("sich ");}
function splitPrefix(v){for(const p of ["an","auf","ein"]){if(v.startsWith(p))return[p,v.slice(p.length)];}return["",v];}
function stem(v){return v.endsWith("en")?v.slice(0,-2):v.endsWith("n")?v.slice(0,-1):v;}

function presente(v){
  const b=base(v), [prefix,root]=splitPrefix(b); let f=M[b]?.[0]||P[b];
  if(!f){const s=stem(root); f=[s+"e",s+"st",s+"t",s+"en",s+"t",s+"en"];}
  if(prefix)f=f.map(x=>x+" "+prefix); if(isRef(v))f=f.map((x,i)=>x+" "+reflexivos[i]); return f;
}
function preterito(v){
  const b=base(v), [prefix,root]=splitPrefix(b); let f=M[b]?.[1]||T[b];
  if(!f){const s=stem(root); f=[s+"te",s+"test",s+"te",s+"ten",s+"tet",s+"ten"];}
  if(prefix)f=f.map(x=>x+" "+prefix); if(isRef(v))f=f.map((x,i)=>x+" "+reflexivos[i]); return f;
}
function perfekt(v,part,aux){const a=aux.startsWith("sein")?P.sein:P.haben;return a.map((x,i)=>x+(isRef(v)?" "+reflexivos[i]:"")+" "+part);}
function futur(v){return P.werden.map((x,i)=>x+(isRef(v)?" "+reflexivos[i]:"")+" "+v);}

function tabela(titulo,formas){
  const s=document.createElement("section"); s.innerHTML=`<h3>${titulo}</h3><table class="tabela-conjugacao"><thead><tr><th>Pessoa</th><th>Forma</th></tr></thead><tbody></tbody></table>`;
  pessoas.forEach((p,i)=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${p}</td><td>${formas[i]}</td>`;s.querySelector("tbody").appendChild(tr);}); return s;
}
function abrir(item){
  const [v,tr,part,aux]=item; document.getElementById("modal-titulo").textContent=v; document.getElementById("modal-traducao").textContent=tr;
  document.getElementById("modal-info").innerHTML=`<div class="info-verbo"><span><strong>Partizip II:</strong> ${part}</span><span><strong>Auxiliar:</strong> ${aux}</span></div>`;
  const a=document.getElementById("modal-conjugacao");a.innerHTML="";
  a.append(tabela("Präsens · Presente",presente(v)),tabela("Präteritum · Passado simples",preterito(v)),tabela("Perfekt · Passado composto",perfekt(v,part,aux)),tabela("Futur I · Futuro",futur(v)));
  const box=document.createElement("div");box.className="futuro-presente";box.innerHTML=`<h3>Präsens com sentido de futuro</h3><p>${FUTURO_PRESENS[v]||"O presente pode indicar futuro quando o contexto temporal estiver claro."}</p>`;a.appendChild(box);
  document.getElementById("modal-verbo").classList.add("aberto");document.body.style.overflow="hidden";
}
function fechar(){document.getElementById("modal-verbo").classList.remove("aberto");document.body.style.overflow="";}
function render(){
  const c=document.getElementById("lista-verbos");c.innerHTML="";const ini=(paginaVerbos-1)*VERBOS_POR_PAGINA;
  verbosFiltrados.slice(ini,ini+VERBOS_POR_PAGINA).forEach(item=>{const card=document.createElement("article");card.className="verbo-card";card.tabIndex=0;card.innerHTML=`<h3>${item[0]}</h3><p>${item[1]}</p><p class="partizip">${item[3]} · ${item[2]}</p>`;card.onclick=()=>abrir(item);card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();abrir(item);}};c.appendChild(card);});
  if(!c.children.length)c.innerHTML='<div class="sem-resultados">Nenhum verbo encontrado.</div>';
  const total=Math.max(1,Math.ceil(verbosFiltrados.length/VERBOS_POR_PAGINA));document.getElementById("pagina-atual").textContent=`Página ${paginaVerbos} de ${total}`;document.getElementById("pagina-anterior").disabled=paginaVerbos===1;document.getElementById("pagina-proxima").disabled=paginaVerbos>=total;document.getElementById("resultado-pesquisa").textContent=`${verbosFiltrados.length} verbo(s)`;
}
document.getElementById("pesquisa-verbo").oninput=e=>{const q=e.target.value.trim().toLocaleLowerCase("pt-BR");verbosFiltrados=listaVerbos.filter(x=>x[1].toLocaleLowerCase("pt-BR").includes(q));paginaVerbos=1;render();};
document.getElementById("pagina-anterior").onclick=()=>{if(paginaVerbos>1){paginaVerbos--;render();}};
document.getElementById("pagina-proxima").onclick=()=>{if(paginaVerbos<Math.ceil(verbosFiltrados.length/VERBOS_POR_PAGINA)){paginaVerbos++;render();}};
document.getElementById("fechar-modal").onclick=fechar;document.getElementById("modal-verbo").onclick=e=>{if(e.target.id==="modal-verbo")fechar();};document.onkeydown=e=>{if(e.key==="Escape")fechar();};render();
