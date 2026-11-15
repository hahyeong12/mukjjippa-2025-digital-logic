// Record the separately implemented browser demo, not the original Logisim circuit.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
try {
  await mkdir("docs/media",{recursive:true});
  const base="http://127.0.0.1:8765";
  let ready=false;
  for(let n=0;n<35;n++){
    try {const r=await fetch(base,{signal:AbortSignal.timeout(1600)});if(r.ok){ready=true;break;}} catch {}
    await sleep(400);
  }
  if(!ready)throw new Error("Local demo server did not start");
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({
    viewport:{width:1200,height:900},deviceScaleFactor:1,
    recordVideo:{dir:"/tmp/mukjjippa-web-video",size:{width:1200,height:900}},
  });
  const page=await context.newPage();
  await page.goto(base,{waitUntil:"networkidle"});
  await page.locator("#computer-mode").selectOption("manual");
  await sleep(1900);
  const turn=async(player,computer)=>{
    await page.locator("#manual-hand").selectOption(computer);
    await page.locator('button[data-hand="'+player+'"]').click();
    await sleep(1750);
  };
  // Player obtains attack, scores on tie, then repeats for the 2nd point.
  await turn("R","S");
  await turn("P","P");
  await turn("S","P");
  await turn("R","R");
  await page.locator("#attacker").getByText("YOU WIN!",{exact:true}).waitFor();
  await sleep(2800);
  await page.screenshot({path:"docs/media/web-demo-final.png",fullPage:true});
  const video=page.video();
  await context.close();
  const inPath=await video.path();
  await browser.close();browser=null;
  const result=spawnSync("ffmpeg",[
    "-y","-loglevel","error","-i",inPath,
    "-vf","fps=15,format=yuv420p","-c:v","libx264","-preset","fast",
    "-crf","31","-movflags","+faststart","-an",
    "docs/media/web-demo.mp4",
  ],{stdio:"inherit"});
  if(result.status!==0)throw new Error("ffmpeg failed with exit status "+result.status);
  console.log("Recorded browser demo: docs/media/web-demo.mp4");
} catch(error){
  console.error(error.stack||error);
  process.exitCode=1;
} finally {if(browser)await browser.close();}
