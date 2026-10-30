import {EXAMPLE_NOTES,PROMPT_OPTIONS,SUMMARY_OPTIONS,ACTION_SCHEMA,validateActions} from './demo-core.js';
notes.value=EXAMPLE_NOTES;
const languageOptions={expectedInputs:[{type:'text',languages:['es']}],expectedOutputs:[{type:'text',languages:['es']}]};
const summaryOptions={type:'key-points',expectedInputLanguages:['es'],outputLanguage:'es'};
function bind(id,name,fn){document.getElementById(id).addEventListener('click',async()=>{beginTest(name);try{const answer=await fn();finishTest('passed',answer);}catch(error){finishTest('failed',null,error);}});}
bind('inspect','availability',async()=>{
 if(navigator.userAgentData?.getHighEntropyValues)report.browser=await navigator.userAgentData.getHighEntropyValues(['fullVersionList','platformVersion','architecture']);
 const configs=[['LanguageModel',languageOptions],['Summarizer',summaryOptions],['Translator',{sourceLanguage:'es',targetLanguage:'en'}],['LanguageDetector',undefined],['Writer',{expectedInputLanguages:['es'],expectedContextLanguages:['es'],outputLanguage:'es'}],['Rewriter',{expectedInputLanguages:['es'],expectedContextLanguages:['es'],outputLanguage:'es'}],['Proofreader',undefined]];
 report.checks=[];
 for(const [name,config] of configs){const api=self[name];const entry={name,exposed:typeof api!=='undefined',native:api?String(api).includes('[native code]'):false,options:config};try{entry.availability=api?await api.availability(config):'not-exposed';}catch(e){entry.error={name:e.name,message:e.message};}report.checks.push(entry);}
 const table=document.createElement('table');const header=document.createElement('tr');['API','Expuesta','Nativa','Disponibilidad'].forEach(t=>{const c=document.createElement('th');c.textContent=t;header.append(c);});table.append(header);
 for(const e of report.checks){const row=document.createElement('tr');[e.name,e.exposed,e.native,e.availability||e.error?.name].forEach(t=>{const c=document.createElement('td');c.textContent=String(t);row.append(c);});table.append(row);}document.getElementById('matrix').replaceChildren(table);return report.checks;
});
// The original Prompt listener is loaded verbatim from original-prompt.js.
document.getElementById('summarizeButton').addEventListener('click',()=>beginTest('summarizer'));
summarizeButton.addEventListener('click',async()=>{
 if(!('Summarizer' in self))return showManual();
 const summaryOptions={
  type:'key-points',
  expectedInputLanguages:['es'],
  outputLanguage:'es',
 };
 const state=await Summarizer.availability(summaryOptions);
 if(state==='unavailable')return showManual();
 const summarizer=await Summarizer.create(summaryOptions);
 const summary=await summarizer.summarize(notes.value);
 showEditableAnswer(summary);
 summarizer.destroy();
});
bind('actionsButton','structured-actions',async()=>{
 const session=await LanguageModel.create(PROMPT_OPTIONS);
 try{const raw=await session.prompt('Extrae acciones explícitas con citas literales en español:\n'+notes.value,{responseConstraint:ACTION_SCHEMA});const actions=validateActions(raw,notes.value);return {raw,validated:actions,allQuotesLiteral:actions.every(a=>notes.value.normalize('NFC').replace(/\s+/g,' ').includes(a.evidence.normalize('NFC').replace(/\s+/g,' ')))};}finally{session.destroy();}
});
bind('languageButton','detect-and-translate',async()=>{
 const detector=await LanguageDetector.create();
 const [result]=await detector.detect(notes.value);
 const translator=await Translator.create({sourceLanguage:result.detectedLanguage,targetLanguage:'en'});
 try{const translation=await translator.translate(notes.value);return {detected:result,translation};}finally{detector.destroy();translator.destroy();}
});
bind('writerButton','writer-experimental',async()=>{const writer=await Writer.create({expectedInputLanguages:['es'],expectedContextLanguages:['es'],outputLanguage:'es'});try{return await writer.write('Escribe una bienvenida de una oración a una charla sobre JavaScript.');}finally{writer.destroy();}});
bind('rewriterButton','rewriter-experimental',async()=>{const rewriter=await Rewriter.create({expectedInputLanguages:['es'],expectedContextLanguages:['es'],outputLanguage:'es',tone:'more-formal'});try{return await rewriter.rewrite('Hola equipo, hay que revisar la demo antes de la charla.');}finally{rewriter.destroy();}});
bind('proofreaderButton','proofreader-experimental',async()=>{const proofreader=await Proofreader.create();try{return await proofreader.proofread('I has a error in this sentense.');}finally{proofreader.destroy();}});
renderReport();
