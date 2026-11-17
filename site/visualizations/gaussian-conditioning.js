import {gaussianModel,sampleGaussian,sampleCorrelation} from './gaussian-engine.js';

const $=id=>document.getElementById(id);
const defaults={rho:0.7,observed:1,sigmaX:1,sigmaY:1};
const controls={rho:$('rho'),observed:$('observed'),sigmaX:$('sigma-x'),sigmaY:$('sigma-y')};
let seed=620;
const svgNS='http://www.w3.org/2000/svg';
function element(name,attrs={},text){const el=document.createElementNS(svgNS,name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text!=null)el.textContent=text;return el;}
function fmt(n){return Math.abs(n)<0.0005?'0.000':n.toFixed(3);}
function drawPlot(svg,points,kind,model){
  svg.replaceChildren();
  const title=element('title',{},kind==='joint'?'Simulated Gaussian joint samples and conditional mean':'Simulated estimation error versus observation');
  svg.append(title);
  const W=520,H=320,l=58,r=18,t=20,b=48,plotW=W-l-r,plotH=H-t-b;
  const ySpan=Math.max(4*model.sigmaY,Math.abs(model.y)+0.8);
  const xSpan=kind==='joint'?4*model.sigmaX:Math.max(1.5,4*model.conditionalSD);
  const px=y=>l+(y+ySpan)/(2*ySpan)*plotW;
  const py=x=>t+(xSpan-x)/(2*xSpan)*plotH;
  const ink=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim()||'#aab';
  const line=getComputedStyle(document.documentElement).getPropertyValue('--line').trim()||'#444';
  const mint=getComputedStyle(document.documentElement).getPropertyValue('--mint').trim()||'#81dbcf';
  const warm=getComputedStyle(document.documentElement).getPropertyValue('--warm').trim()||'#f2c18c';
  for(let i=-2;i<=2;i++){
    const xx=l+plotW*(i+2)/4,yy=t+plotH*(i+2)/4;
    svg.append(element('line',{x1:xx,y1:t,x2:xx,y2:H-b,stroke:line,'stroke-width':1}));
    svg.append(element('line',{x1:l,y1:yy,x2:W-r,y2:yy,stroke:line,'stroke-width':1}));
  }
  svg.append(element('line',{x1:l,y1:H-b,x2:W-r,y2:H-b,stroke:ink,'stroke-width':1.2}));
  svg.append(element('line',{x1:l,y1:t,x2:l,y2:H-b,stroke:ink,'stroke-width':1.2}));
  for(let i=-2;i<=2;i++){
    const v=(i/2)*ySpan, x=px(v);
    svg.append(element('text',{x,y:H-b+19,'text-anchor':'middle',fill:ink,'font-size':12},v.toFixed(1)));
    const value=(i/2)*xSpan;
    svg.append(element('text',{x:l-9,y:py(value)+4,'text-anchor':'end',fill:ink,'font-size':12},value.toFixed(1)));
  }
  svg.append(element('text',{x:l+plotW/2,y:H-6,'text-anchor':'middle',fill:ink,'font-size':13},'Observation Y'));
  svg.append(element('text',{x:16,y:H/2,'text-anchor':'middle',fill:ink,'font-size':13,transform:`rotate(-90 16 ${H/2})`},kind==='joint'?'X':'Error e'));
  const group=element('g',{'aria-hidden':'true'});
  for(const p of points){const val=kind==='joint'?p.x:p.error;group.append(element('circle',{cx:px(p.y),cy:py(val),r:2.6,fill:kind==='joint'?mint:warm,opacity:.67}));}
  svg.append(group);
  if(kind==='joint'){
    const x1=-ySpan,x2=ySpan;
    svg.append(element('line',{x1:px(x1),y1:py(model.muX+model.slope*(x1-model.muY)),x2:px(x2),y2:py(model.muX+model.slope*(x2-model.muY)),stroke:warm,'stroke-width':3}));
    svg.append(element('line',{x1:px(model.y),y1:t,x2:px(model.y),y2:H-b,stroke:ink,'stroke-width':2,'stroke-dasharray':'5 5'}));
  } else svg.append(element('line',{x1:l,y1:py(0),x2:W-r,y2:py(0),stroke:mint,'stroke-width':2}));
}
function update(){
  const rho=Number(controls.rho.value),y=Number(controls.observed.value),sigmaX=Number(controls.sigmaX.value),sigmaY=Number(controls.sigmaY.value);
  const model=gaussianModel({rho,y,sigmaX,sigmaY});
  $('rho-value').textContent=rho.toFixed(2);$('observed-value').textContent=y.toFixed(2);
  $('sigma-x-value').textContent=sigmaX.toFixed(2);$('sigma-y-value').textContent=sigmaY.toFixed(2);
  $('estimate').textContent=fmt(model.conditionalMean);$('variance').textContent=fmt(model.conditionalVariance);
  $('determinant').textContent=fmt(model.determinant);
  const points=sampleGaussian(model,180,seed);
  const corr=sampleCorrelation(points,'y','error');
  $('residual-correlation').textContent=model.singular?'Undefined':(corr==null?'Undefined':fmt(corr));
  $('status').textContent=model.singular?'Perfect correlation: the conditional distribution is a point mass (zero estimation error). The joint covariance is singular, so there is no ordinary two-dimensional joint density.':`Conditional X given Y = ${y.toFixed(2)} is Gaussian with mean ${fmt(model.conditionalMean)} and standard deviation ${fmt(model.conditionalSD)}.`;
  drawPlot($('joint-plot'),points,'joint',model);
  drawPlot($('error-plot'),points,'error',model);
}
for(const input of Object.values(controls))input.addEventListener('input',update);
$('resample').addEventListener('click',()=>{seed=(seed+1)>>>0;update();});
$('reset').addEventListener('click',()=>{controls.rho.value=defaults.rho;controls.observed.value=defaults.observed;controls.sigmaX.value=defaults.sigmaX;controls.sigmaY.value=defaults.sigmaY;seed=620;update();});
$('theme-toggle').addEventListener('click',()=>requestAnimationFrame(update));
update();
