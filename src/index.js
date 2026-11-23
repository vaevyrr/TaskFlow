import {readFile,writeFile} from "node:fs/promises";
import {planTasks,runTask} from "./runner.js";

const [file,...args]=process.argv.slice(2);
if(!file){console.error("Usage: node src/index.js tasks.json [--dry-run]");process.exit(2);}
try{
  const config=JSON.parse(await readFile(file,"utf8"));const tasks=planTasks(config.tasks||[]);
  console.log("Plan: "+tasks.map(t=>t.name).join(" -> "));
  if(args.includes("--dry-run"))process.exit(0);
  const historyPath=config.historyFile||".taskflow-history.json";
  let history=[];try{history=JSON.parse(await readFile(historyPath,"utf8"));}catch{}
  const failed=new Set();
  for(const task of tasks){
    if((task.dependsOn||[]).some(d=>failed.has(d))){console.log(`SKIP  ${task.name} (dependency failed)`);continue;}
    const r=await runTask(task);console.log(`${r.status.toUpperCase()} ${task.name} ${r.durationMs}ms`);
    history.push({...r,command:task.command,at:new Date().toISOString()});
    await writeFile(historyPath,JSON.stringify(history.slice(-200),null,2));
    if(r.status!=="passed"){failed.add(task.name);process.exitCode=1;}
  }
}catch(e){console.error(`taskflow: ${e.message}`);process.exitCode=2;}
