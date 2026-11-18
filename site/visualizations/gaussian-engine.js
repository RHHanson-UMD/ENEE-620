/** Pure educational model for scalar components of a jointly Gaussian pair.
 *  Conventions: X,Y real-valued, standard deviations strictly positive,
 *  Pearson correlation rho in [-1,1]; all expectations are population values.
 */
export function gaussianModel({muX=0,muY=0,sigmaX=1,sigmaY=1,rho=0,y=0}={}) {
  const a={muX,muY,sigmaX,sigmaY,rho,y};
  if(Object.values(a).some(v=>typeof v!=='number'||!Number.isFinite(v))) throw new RangeError('All model inputs must be finite numbers.');
  if(sigmaX<=0||sigmaY<=0||rho < -1||rho > 1) throw new RangeError('Require positive standard deviations and -1 <= rho <= 1.');
  const covariance=rho*sigmaX*sigmaY;
  const slope=covariance/(sigmaY*sigmaY);
  const conditionalMean=muX+slope*(y-muY);
  const conditionalVariance=Math.max(0,sigmaX*sigmaX*(1-rho*rho));
  const determinant=(sigmaX*sigmaX)*(sigmaY*sigmaY)*(1-rho*rho);
  return {muX,muY,sigmaX,sigmaY,rho,y,covariance,slope,
    conditionalMean,conditionalVariance,conditionalSD:Math.sqrt(conditionalVariance),
    mmse:conditionalVariance,determinant,singular:Math.abs(rho)===1};
}

/** Stable pseudo-random samples: deterministic and independent of Math.random.
 *  Generate Y from Z1; generate X from rho*Z1+sqrt(1-rho^2)*Z2.
 *  For |rho|=1 the Gaussian pair has a singular covariance, but sampling works.
 */
export function sampleGaussian(model,count=180,seed=620) {
  if(!Number.isInteger(count)||count<2||count>2000) throw new RangeError('Sample count must be 2..2000.');
  if(!Number.isInteger(seed)||seed<0||seed>4294967295) throw new RangeError('Seed must be a uint32.');
  let state=seed>>>0;
  function rand(){state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
  function normal(){return Math.sqrt(-2*Math.log(Math.max(rand(),1e-12)))*Math.cos(2*Math.PI*rand());}
  const independentScale=Math.sqrt(Math.max(0,1-model.rho*model.rho));
  const points=[];
  for(let i=0;i<count;i++){
    const z1=normal(),z2=normal();
    const y=model.muY+model.sigmaY*z1;
    const x=model.muX+model.sigmaX*(model.rho*z1+independentScale*z2);
    const estimate=model.muX+model.slope*(y-model.muY);
    points.push({x,y,estimate,error:x-estimate});
  }
  return points;
}

export function sampleCorrelation(points,keyA,keyB) {
  const n=points.length;
  if(n<2) return null;
  const meanA=points.reduce((s,p)=>s+p[keyA],0)/n;
  const meanB=points.reduce((s,p)=>s+p[keyB],0)/n;
  let numerator=0,denomA=0,denomB=0;
  for(const p of points){const a=p[keyA]-meanA,b=p[keyB]-meanB;numerator+=a*b;denomA+=a*a;denomB+=b*b;}
  return denomA<=1e-22||denomB<=1e-22?null:numerator/Math.sqrt(denomA*denomB);
}
