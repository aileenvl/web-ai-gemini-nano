var prepareButton=document.getElementById('prepareButton');
var notes=document.getElementById('notes');
var progress=document.getElementById('progress');
var report={startedAt:new Date().toISOString(),origin:location.origin,userAgent:navigator.userAgent,secureContext:isSecureContext,modelDownloadsTriggered:[],checks:[],runs:[]};
var activeTest=null;
function renderReport(){document.getElementById('report').textContent=JSON.stringify(report,null,2);}
function beginTest(id){activeTest={id,start:performance.now()};document.querySelectorAll('button:not(#save)').forEach(b=>b.disabled=true);document.getElementById('status').textContent='Ejecutando '+id+'…';}
function finishTest(status,value,error){
 if(!activeTest)return;
 report.runs.push({id:activeTest.id,status,elapsedMs:Math.round(performance.now()-activeTest.start),output:value,error:error?{name:error.name,message:error.message}:undefined});
 document.getElementById('answer').textContent=typeof value==='string'?value:JSON.stringify(value??error?.message,null,2);
 document.getElementById('status').textContent=activeTest.id+': '+status;
 activeTest=null;document.querySelectorAll('button').forEach(b=>b.disabled=false);renderReport();
}
function showManual(){finishTest('unavailable','La API no está disponible con estas opciones.');}
function showEditableAnswer(answer){finishTest('passed',answer);}
prepareButton.addEventListener('click',()=>beginTest('original-prompt'));
window.addEventListener('unhandledrejection',e=>{finishTest('failed',null,e.reason);});
window.addEventListener('error',e=>{finishTest('failed',null,e.error||new Error(e.message));});
document.getElementById('save').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));a.download='verificacion-apis-chrome-2026-10-30.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
