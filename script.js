/* ═══════════════════════════════════════════════════
   LAYER 1: BASE BACKGROUND — grid + particles + beams + waves (unchanged)
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('bg-canvas');
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);

  function drawGrid(){
    ctx.strokeStyle='rgba(0,245,255,0.03)';ctx.lineWidth=0.5;
    const step=60;
    for(let x=0;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  class Particle{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.vx=(Math.random()-0.5)*0.4;this.vy=(Math.random()-0.5)*0.4;
      this.life=Math.random()*200+100;this.maxLife=this.life;
      this.size=Math.random()*1.5+0.5;
      const r=Math.random();
      this.color=r>0.75?'255,165,0':(r>0.5?'255,34,68':'0,245,255');
    }
    update(){this.x+=this.vx;this.y+=this.vy;this.life--;if(this.life<=0||this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
    draw(){const a=this.life/this.maxLife*0.6;ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=`rgba(${this.color},${a})`;ctx.fill();}
  }
  const particles=[];for(let i=0;i<120;i++)particles.push(new Particle());

  let beams=[];
  function spawnBeam(){
    const isH=Math.random()>0.5;
    const r=Math.random();
    const color=r>0.66?'255,34,68':(r>0.33?'255,165,0':'0,245,255');
    beams.push({x:isH?0:Math.random()*W,y:isH?Math.random()*H:0,vx:isH?Math.random()*3+1:(Math.random()-0.5)*0.5,vy:isH?(Math.random()-0.5)*0.5:Math.random()*2+1,len:Math.random()*120+60,life:1,color});
  }
  setInterval(spawnBeam,800);
  function drawBeams(){
    beams=beams.filter(b=>b.life>0);
    beams.forEach(b=>{
      ctx.beginPath();ctx.moveTo(b.x-b.vx*b.len,b.y-b.vy*b.len);ctx.lineTo(b.x,b.y);
      const grad=ctx.createLinearGradient(b.x-b.vx*b.len,b.y-b.vy*b.len,b.x,b.y);
      grad.addColorStop(0,`rgba(${b.color},0)`);grad.addColorStop(1,`rgba(${b.color},${b.life*0.5})`);
      ctx.strokeStyle=grad;ctx.lineWidth=1;ctx.stroke();
      b.x+=b.vx;b.y+=b.vy;if(b.x>W+b.len||b.y>H+b.len)b.life=0;
    });
  }

  let waveT=0;
  function drawWavePulse(){
    waveT+=0.03;
    ctx.beginPath();ctx.strokeStyle='rgba(0,245,255,0.06)';ctx.lineWidth=1.5;
    for(let x=0;x<W;x++){const y=H/2+Math.sin(x*0.008+waveT)*30+Math.sin(x*0.02-waveT*1.3)*15;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();
    ctx.beginPath();ctx.strokeStyle='rgba(255,34,68,0.09)';ctx.lineWidth=1.5;
    for(let x=0;x<W;x++){const y=H*0.3+Math.sin(x*0.012-waveT*1.1)*25+Math.sin(x*0.03+waveT*0.9)*10;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();
    ctx.beginPath();ctx.strokeStyle='rgba(255,34,68,0.06)';ctx.lineWidth=1;
    for(let x=0;x<W;x++){const y=H*0.7+Math.sin(x*0.009+waveT*0.8)*20+Math.sin(x*0.025-waveT*1.5)*12;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();
  }

  function animate(){ctx.clearRect(0,0,W,H);drawGrid();drawWavePulse();particles.forEach(p=>{p.update();p.draw();});drawBeams();requestAnimationFrame(animate);}
  animate();
})();



/* ═══════════════════════════════════════════════════
   LAYER 3: RED CIRCUIT BOARD (like images B+C — circuit paths + nodes + glowing traces)
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('circuit-canvas');
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);

  /* circuit path segments */
  let paths=[];
  function buildPaths(){
    paths=[];
    const count=60;
    for(let i=0;i<count;i++){
      const sx=Math.random()*W;const sy=Math.random()*H;
      const segs=[];let cx=sx;let cy=sy;
      for(let s=0;s<Math.floor(Math.random()*5+3);s++){
        const dir=Math.random()<0.5;
        const len=(Math.random()*120+40)*(dir?1:-1);
        if(Math.random()<0.5){cx+=len;}else{cy+=len;}
        segs.push({x:cx,y:cy});
      }
      const r=Math.random();
      const color=r>0.55?`rgba(255,34,68,`:(r>0.3?`rgba(0,245,255,`:`rgba(255,45,206,`);
      paths.push({sx,sy,segs,color,progress:0,speed:Math.random()*0.012+0.004,alpha:Math.random()*0.18+0.06,done:false,pause:Math.floor(Math.random()*300)});
    }
  }
  buildPaths();

  /* junction nodes */
  let nodes=[];
  function buildNodes(){
    nodes=[];
    for(let i=0;i<80;i++){
      nodes.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*3+1,pulse:Math.random()*Math.PI*2,speed:Math.random()*0.04+0.02,r2:Math.random()>0.55?'255,34,68':'0,245,255'});
    }
  }
  buildNodes();

  /* connection web */
  function drawWeb(){
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[j].x-nodes[i].x;const dy=nodes[j].y-nodes[i].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<160){
          const a=(1-dist/160)*0.07;
          ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=`rgba(0,245,255,${a})`;ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    }
  }

  let t2=0;
  function animate(){
    ctx.clearRect(0,0,W,H);
    t2+=0.016;

    /* draw circuit paths */
    paths.forEach(p=>{
      if(p.pause>0){p.pause--;return;}
      if(p.done){
        /* fade out */
        p.alpha-=0.001;
        if(p.alpha<=0){p.progress=0;p.done=false;p.alpha=Math.random()*0.18+0.06;p.pause=Math.floor(Math.random()*200);}
      } else {
        p.progress+=p.speed;if(p.progress>=1)p.done=true;
      }
      /* draw the segments up to current progress */
      const totalSegs=p.segs.length;
      const drawn=p.progress*totalSegs;
      ctx.beginPath();ctx.moveTo(p.sx,p.sy);
      let px=p.sx,py=p.sy;
      for(let s=0;s<Math.floor(drawn);s++){ctx.lineTo(p.segs[s].x,p.segs[s].y);px=p.segs[s].x;py=p.segs[s].y;}
      /* partial last segment */
      const partial=drawn%1;
      if(Math.floor(drawn)<totalSegs){
        const nx=p.segs[Math.floor(drawn)].x,ny=p.segs[Math.floor(drawn)].y;
        ctx.lineTo(px+(nx-px)*partial,py+(ny-py)*partial);
      }
      ctx.strokeStyle=`${p.color}${Math.min(p.alpha,0.22)})`;ctx.lineWidth=1;ctx.stroke();
      /* glowing lead dot */
      if(!p.done){
        let lx,ly;
        if(Math.floor(drawn)>=totalSegs){lx=p.segs[totalSegs-1].x;ly=p.segs[totalSegs-1].y;}
        else{const s=Math.floor(drawn);const nx=p.segs[s].x,ny=p.segs[s].y;const ox=s>0?p.segs[s-1].x:p.sx,oy=s>0?p.segs[s-1].y:p.sy;lx=ox+(nx-ox)*partial;ly=oy+(ny-oy)*partial;}
        ctx.beginPath();ctx.arc(lx,ly,2.5,0,Math.PI*2);
        ctx.fillStyle=`${p.color}0.9)`;ctx.fill();
      }
    });

    /* nodes */
    nodes.forEach(n=>{
      n.pulse+=n.speed;
      const glow=(Math.sin(n.pulse)+1)/2;
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${n.r2},${0.15+glow*0.5})`;ctx.fill();
      ctx.beginPath();ctx.arc(n.x,n.y,n.r*3,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${n.r2},${0.04+glow*0.1})`;ctx.lineWidth=1;ctx.stroke();
    });

    drawWeb();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════════════════════
   HERO SECTION CANVAS — holographic eye / data rings
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('hero-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);

  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.018;
    const cx=W/2,cy=H/2;
    /* rotating HUD rings — cyberpunk eye aesthetic */
    for(let r=0;r<6;r++){
      const radius=120+r*80;
      const a=t*(r%2===0?1:-1)*(0.3+r*0.08);
      ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
      ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,245,255,${0.04-r*0.004})`;ctx.lineWidth=1.5;ctx.stroke();
      /* tick marks */
      for(let tick=0;tick<16;tick++){
        const ta=tick/16*Math.PI*2;
        const r0=radius-4,r1=radius+(tick%4===0?10:5);
        ctx.beginPath();ctx.moveTo(Math.cos(ta)*r0,Math.sin(ta)*r0);ctx.lineTo(Math.cos(ta)*r1,Math.sin(ta)*r1);
        ctx.strokeStyle=`rgba(0,245,255,${tick%4===0?0.25:0.1})`;ctx.lineWidth=tick%4===0?1.5:0.5;ctx.stroke();
      }
      ctx.restore();
    }
    /* red pulsing ring */
    const rr=200+Math.sin(t*1.5)*20;
    ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,34,68,${0.05+Math.sin(t*2)*0.03})`;ctx.lineWidth=2;ctx.stroke();
    /* center cross-hair */
    ctx.strokeStyle='rgba(0,245,255,0.15)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(cx-400,cy);ctx.lineTo(cx+400,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,cy-300);ctx.lineTo(cx,cy+300);ctx.stroke();
    /* floating data labels */
    const labels=['+SIGNAL','FREQ:104.5MHz','SOS','TCP/IP','ARCHIVE','NEURAL'];
    labels.forEach((lb,i)=>{
      const angle=t*0.2+i*(Math.PI*2/labels.length);
      const rad=340+Math.sin(t+i)*20;
      const lx=cx+Math.cos(angle)*rad,ly=cy+Math.sin(angle)*rad;
      ctx.fillStyle=`rgba(0,245,255,${0.15+Math.sin(t+i)*0.1})`;
      ctx.font='10px Share Tech Mono';ctx.fillText(lb,lx-25,ly);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   TIMELINE SECTION CANVAS — flowing data stream
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('timeline-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.02;
    /* flowing horizontal data streams */
    for(let row=0;row<20;row++){
      const y=row*(H/20);const offset=t*60+row*37;
      ctx.font='10px Share Tech Mono';
      for(let col=0;col<80;col++){
        const x=((col*40+offset)%W);
        const chars='01';const ch=chars[Math.floor(Math.random()*2)];
        const a=0.03+Math.sin(t+col+row)*0.02;
        ctx.fillStyle=row%3===0?`rgba(255,34,68,${a})`:`rgba(0,245,255,${a})`;
        ctx.fillText(ch,x,y);
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   MILESTONES SECTION — red network graph animation
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('milestones-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  const nodes=[];
  function resize(){
    W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;
    nodes.length=0;
    for(let i=0;i<50;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:Math.random()>0.5?'255,34,68':'0,245,255'});
  }
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.012;
    nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<180){const a=(1-d/180)*0.1;ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle=`rgba(${nodes[i].r},${a})`;ctx.lineWidth=0.5;ctx.stroke();}
    }
    nodes.forEach(n=>{const glow=(Math.sin(t+n.x)*0.5+0.5);ctx.beginPath();ctx.arc(n.x,n.y,2+glow*2,0,Math.PI*2);ctx.fillStyle=`rgba(${n.r},${0.2+glow*0.4})`;ctx.fill();});
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   SIGNAL LAB BG
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('lab-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.015;
    /* multiple layered sine waves in bg */
    const configs=[
      {color:'rgba(0,245,255,0.04)',freq:0.008,speed:0.8,amp:0.15},
      {color:'rgba(255,34,68,0.04)',freq:0.013,speed:-1.1,amp:0.12},
      {color:'rgba(255,165,0,0.03)',freq:0.006,speed:0.5,amp:0.18},
      {color:'rgba(26,107,255,0.04)',freq:0.02,speed:1.3,amp:0.08},
    ];
    configs.forEach(c=>{
      for(let row=0;row<8;row++){
        const baseY=(row+0.5)*(H/8);
        ctx.beginPath();ctx.strokeStyle=c.color;ctx.lineWidth=1;
        for(let x=0;x<W;x++){const y=baseY+Math.sin(x*c.freq+t*c.speed+row)*H*c.amp;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.stroke();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   ERAS SUMMARY — pink/cyan flowing lines
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('eras-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.01;
    for(let i=0;i<12;i++){
      const y=i*(H/12);
      ctx.beginPath();ctx.strokeStyle=i%3===0?`rgba(255,45,206,0.04)`:`rgba(0,245,255,0.03)`;ctx.lineWidth=1;
      for(let x=0;x<W;x++){const dy=Math.sin(x*0.006+t*(0.5+i*0.1)+i)*30;x===0?ctx.moveTo(x,y+dy):ctx.lineTo(x,y+dy);}
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   IMPACT SECTION — orbiting network
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('impact-canvas');
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize);
  const orbs=Array.from({length:30},(_,i)=>({angle:i*(Math.PI*2/30),speed:(Math.random()-0.5)*0.01+0.005,radius:100+Math.random()*H*0.3,cx:Math.random()*W,cy:Math.random()*H,r:Math.random()>0.5?'0,245,255':'255,165,0'}));
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.012;
    orbs.forEach(o=>{
      o.angle+=o.speed;
      const x=o.cx+Math.cos(o.angle)*o.radius*0.3;
      const y=o.cy+Math.sin(o.angle)*o.radius*0.15;
      ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(${o.r},0.2)`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════
   WAVE CANVAS — signal visualizer (unchanged logic)
   ═══════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('wave-canvas');
  const ctx=canvas.getContext('2d');
  let mode='optical',t=0;
  const modes={
    optical:{info:'OPTICAL TELEGRAPH — MECHANICAL PULSE — BINARY ANGLE ENCODING',draw(t){const w=canvas.width,h=canvas.height,mid=h/2;ctx.strokeStyle='#00f5ff';ctx.lineWidth=2;ctx.beginPath();const step=40;for(let x=0;x<w;x++){const ph=Math.floor((x+t*50)/step);const y=mid+(ph%2===0?-30:30);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='rgba(0,245,255,0.4)';ctx.font='10px Share Tech Mono';for(let x=step/2;x<w;x+=step){const ph=Math.floor((x+t*50)/step);ctx.fillText(ph%2===0?'HIGH':'LOW',x-14,mid-40);}}},
    morse:{info:'MORSE CODE — ELECTRIC PULSE — DOT/DASH BINARY ENCODING — SOS',draw(t){const w=canvas.width,h=canvas.height,mid=h/2;const pat=[1,0,1,0,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1,0,1,0,1,0,0,0];ctx.strokeStyle='#ffa500';ctx.lineWidth=3;ctx.beginPath();const unit=22;for(let x=0;x<w;x++){const idx=Math.floor((x+t*30)/unit)%pat.length;const y=mid+(pat[idx]?-35:20);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='rgba(255,165,0,0.5)';ctx.font='11px Share Tech Mono';ctx.fillText('· · ·  — — —  · · ·  (SOS)',20,24);}},
    radio:{info:'RADIO WAVE — ELECTROMAGNETIC — AM/FM MODULATION — 3.5 MHz',draw(t){const w=canvas.width,h=canvas.height,mid=h/2;const colors=['rgba(0,255,136,0.9)','rgba(0,245,255,0.5)','rgba(255,165,0,0.4)'];const freqs=[0.04,0.025,0.06];const amps=[45,25,15];for(let i=0;i<3;i++){ctx.strokeStyle=colors[i];ctx.lineWidth=1.5;ctx.beginPath();for(let x=0;x<w;x++){const mod=1+0.4*Math.sin(x*0.008+t*0.5);const y=mid+Math.sin(x*freqs[i]+t*(1+i*0.3))*amps[i]*mod;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Share Tech Mono';ctx.fillText('CARRIER',10,20);ctx.fillStyle='rgba(0,245,255,0.5)';ctx.fillText('3.5 MHz',10,35);ctx.fillStyle='rgba(255,165,0,0.4)';ctx.fillText('7.0 MHz',10,50);}},
    digital:{info:'DIGITAL PACKET — TCP/IP — BINARY DATA STREAM — INTERNET PROTOCOL',draw(t){const w=canvas.width,h=canvas.height,mid=h/2;const bits='1101001010110001111010000110110101'.split('');ctx.strokeStyle='#1a6bff';ctx.lineWidth=2;ctx.beginPath();const unit=14;for(let x=0;x<w;x++){const idx=Math.floor((x+t*40)/unit)%bits.length;const y=mid+(bits[idx]==='1'?-40:40);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();ctx.strokeStyle='rgba(26,107,255,0.2)';ctx.lineWidth=1;for(let x=0;x<w;x+=unit){ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,h-20);ctx.stroke();}ctx.fillStyle='rgba(26,107,255,0.6)';ctx.font='9px Share Tech Mono';for(let x=7;x<w;x+=unit){const idx=Math.floor((x+t*40)/unit)%bits.length;ctx.fillText(bits[idx],x,mid-48);}}},
    neural:{info:'NEURAL SIGNAL — DEEP LEARNING — ATTENTION WEIGHTS — TRANSFORMER ARCHITECTURE',draw(t){const w=canvas.width,h=canvas.height,mid=h/2;for(let layer=0;layer<5;layer++){const alpha=0.2+layer*0.15;const freq=0.015+layer*0.008;const speed=0.8+layer*0.3;const amp=40-layer*4;ctx.strokeStyle=`rgba(168,85,247,${alpha})`;ctx.lineWidth=1.5-layer*0.2;ctx.beginPath();for(let x=0;x<w;x++){const y=mid+Math.sin(x*freq+t*speed)*amp+Math.sin(x*freq*2.3-t*speed*0.7)*(amp*0.4)+Math.sin(x*freq*0.4+t*speed*1.4)*(amp*0.3);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}for(let x=60;x<w;x+=100){const y=mid+Math.sin(x*0.02+t)*30;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle='rgba(168,85,247,0.8)';ctx.fill();ctx.strokeStyle='rgba(168,85,247,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='rgba(168,85,247,0.5)';ctx.font='10px Share Tech Mono';ctx.fillText('DEEP LEARNING — ATTENTION LAYER ACTIVE',10,20);}}
  };
  function resizeWave(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;}
  resizeWave();window.addEventListener('resize',resizeWave);
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(0,245,255,0.06)';ctx.lineWidth=0.5;
    for(let y=0;y<canvas.height;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    ctx.strokeStyle='rgba(0,245,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([4,8]);
    ctx.beginPath();ctx.moveTo(0,canvas.height/2);ctx.lineTo(canvas.width,canvas.height/2);ctx.stroke();ctx.setLineDash([]);
    modes[mode].draw(t);t+=0.04;requestAnimationFrame(loop);
  }
  loop();
  window.setWave=function(m){
    mode=m;
    document.getElementById('wave-info').textContent=modes[m].info;
    const map={optical:'OPTICAL',morse:'MORSE',radio:'RADIO',digital:'DIGITAL',neural:'NEURAL'};
    document.querySelectorAll('.wave-btn').forEach(b=>b.classList.toggle('active',b.textContent.includes(map[m])));
  };
})();



/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════ */
(function(){
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
  document.querySelectorAll('.reveal,.era-panel').forEach(el=>io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   CURSOR GLOW
   ═══════════════════════════════════════════════════ */
document.addEventListener('mousemove',e=>{
  const g=document.createElement('div');
  g.style.cssText=`position:fixed;left:${e.clientX-2}px;top:${e.clientY-2}px;width:4px;height:4px;border-radius:50%;background:rgba(0,245,255,0.7);pointer-events:none;z-index:9999;transition:opacity 0.8s;`;
  document.body.appendChild(g);
  setTimeout(()=>{g.style.opacity='0';},50);
  setTimeout(()=>g.remove(),850);
});
