// Requires playwright and sharp. Set NODE_PATH if using a bundled runtime.
// Run with the actual app's web server available at STORE_PREVIEW_URL.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const project = path.resolve(root, '..');
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

async function main() {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  const icon = fs.readFileSync(path.join(project, 'assets/branding/minute-work-icon.png')).toString('base64');
  // Export established branding at store-required sizes; no new logo artwork.
  await sharp(path.join(project,'web/icons/icon-512.png')).flatten({background:'#FF5538'}).png().toFile(path.join(root,'Android/graphics/store-icon-512.png'));
  await sharp(path.join(project,'ios/EmomTimer/Images.xcassets/AppIcon.appiconset/AppIcon-1024.png')).flatten({background:'#FF5538'}).png().toFile(path.join(root,'iOS/graphics/app-store-icon-1024.png'));
  const page = await browser.newPage({viewport:{width:1024,height:500},deviceScaleFactor:1});
  const feature = `<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#F7F4ED;color:#20201E;font-family:Arial,sans-serif;width:1024px;height:500px;padding:66px 64px}.brand{font-size:22px;font-weight:800;letter-spacing:-.6px}.dot{display:inline-block;background:#FF5538;width:16px;height:16px;border-radius:50%;margin-right:12px}h1{font-size:66px;line-height:1.01;letter-spacing:-3px;margin:37px 0 20px;max-width:620px}p{font-size:19px;color:#66625C}.art{position:absolute;width:234px;height:234px;right:64px;top:126px;border-radius:42px}.rule{width:38px;height:4px;background:#FF5538;margin-top:28px}</style><div class="brand"><span class="dot"></span>Minute Work</div><h1>Show up<br>every minute.</h1><p>A focused EMOM workout timer.</p><div class="rule"></div><img class="art" src="data:image/png;base64,${icon}"></html>`;
  fs.writeFileSync(path.join(root,'Android/graphics/feature-graphic-source.html'),feature);
  await page.setContent(feature);
  await page.screenshot({path:path.join(root,'Android/graphics/feature-graphic-1024x500.png')});
  await page.close();

  const shots = [
    ['01-setup','Your minutes. Your pace.','Choose 5, 10, 15 or 20 rounds.'],
    ['02-running','One minute. One job.','A clear countdown for every round.'],
    ['03-paused','Take a breath.','Pause, then pick up where you left off.'],
    ['04-dark','Find your focus.','A dark appearance for your workout.'],
    ['05-complete','Finish. Breathe. Repeat.','See your rounds through to the end.'],
  ];
  for (const [platform,w,h] of [['Android',1080,1920],['iOS',1320,2868]]) {
    const app = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,colorScheme:'light'});
    await app.clock.install({time:new Date('2026-09-15T09:41:00Z')});
    await app.goto(process.env.STORE_PREVIEW_URL || 'http://127.0.0.1:3015/');
    await app.getByRole('button',{name:'5 rounds',exact:true}).click();
    await app.clock.pauseAt(new Date('2026-09-15T09:41:10Z'));
    const output = path.join(root,platform,'screenshots/preview-only');
    for (let i=0;i<shots.length;i++) {
      if(i===1){await app.getByRole('button',{name:'Start workout',exact:false}).click();await app.clock.runFor(18000);}
      if(i===2){await app.getByRole('button',{name:'Pause',exact:true}).click();}
      if(i===3){await app.emulateMedia({colorScheme:'dark'});await app.getByRole('button',{name:'Resume',exact:true}).click();await app.clock.runFor(5000);}
      if(i===4){await app.emulateMedia({colorScheme:'light'});await app.clock.runFor(281000);}
      const raw=await app.screenshot();
      fs.writeFileSync(path.join(output,`${shots[i][0]}-web-capture.png`),raw);
      const dark=i===3;
      const composition=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
      const sw=Math.round(w*(platform==='Android'?.63:.76)), sh=Math.round(sw*844/390);
      const top=Math.round(h*.20);
      const html=`<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:${w}px;height:${h}px;background:${dark?'#171512':'#F7F4ED'};font-family:Arial,sans-serif;color:${dark?'#F2EFE8':'#20201E'};text-align:center;padding-top:${Math.round(h*.058)}px}.eyebrow{color:#FF5538;font-size:${Math.round(w*.019)}px;font-weight:800;letter-spacing:4px}h1{font-size:${Math.round(w*.061)}px;letter-spacing:-2px;line-height:1.06;margin:26px 25px 17px}p{font-size:${Math.round(w*.024)}px;color:${dark?'#A8A39A':'#66625C'};margin:0}img{position:absolute;left:${(w-sw)/2}px;top:${top}px;width:${sw}px;height:${sh}px;border-radius:28px;box-shadow:0 16px 55px #0002;border:1px solid ${dark?'#3A3733':'#D8D3C8'}}</style><div class="eyebrow">MINUTE WORK · EMOM TIMER</div><h1>${escape(shots[i][1])}</h1><p>${escape(shots[i][2])}</p><img src="data:image/png;base64,${raw.toString('base64')}"></html>`;
      await composition.setContent(html);
      await composition.screenshot({path:path.join(output,`${shots[i][0]}-${w}x${h}-PREVIEW.png`)});
      await composition.close();
    }
    await app.close();
  }
  await browser.close();
}
main().catch(e=>{console.error(e);process.exit(1)});
