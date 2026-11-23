import test from "node:test";
import assert from "node:assert/strict";
import {planTasks} from "../src/runner.js";

test("dependencies come first",()=>{const p=planTasks([{name:"test",command:"true",dependsOn:["build"]},{name:"build",command:"true"}]);assert.deepEqual(p.map(x=>x.name),["build","test"]);});
test("cycles are rejected",()=>assert.throws(()=>planTasks([{name:"a",command:"true",dependsOn:["b"]},{name:"b",command:"true",dependsOn:["a"]}]),/dependency cycle/));
