import {exec} from "node:child_process";
import {promisify} from "node:util";
const execAsync=promisify(exec);

export function planTasks(tasks){
  const byName=new Map(tasks.map(t=>[t.name,t])); if(byName.size!==tasks.length)throw new Error("task names must be unique");
  const state=new Map(),out=[];
  function visit(name,stack=[]){
    const task=byName.get(name);if(!task)throw new Error(`unknown dependency: ${name}`);
    if(state.get(name)==="done")return;
    if(state.get(name)==="visiting")throw new Error(`dependency cycle: ${[...stack,name].join(" -> ")}`);
    state.set(name,"visiting");for(const dep of task.dependsOn||[])visit(dep,[...stack,name]);
    state.set(name,"done");out.push(task);
  }
  for(const t of tasks)visit(t.name);return out;
}

export async function runTask(task,defaultTimeout=60000){
  const started=Date.now();
  try{
    const r=await execAsync(task.command,{timeout:task.timeoutMs||defaultTimeout,maxBuffer:1024*1024});
    return {name:task.name,status:"passed",durationMs:Date.now()-started,stdout:r.stdout.trim(),stderr:r.stderr.trim()};
  }catch(e){
    return {name:task.name,status:"failed",durationMs:Date.now()-started,stdout:e.stdout?.trim()||"",stderr:e.stderr?.trim()||e.message};
  }
}
