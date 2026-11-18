import test from 'node:test';
import assert from 'node:assert/strict';
import {gaussianModel,sampleGaussian,sampleCorrelation} from '../site/visualizations/gaussian-engine.js';

test('affine conditional mean and conditional covariance have independent expected values',()=>{
  const m=gaussianModel({muX:1,muY:-2,sigmaX:2,sigmaY:4,rho:0.5,y:2});
  assert.equal(m.covariance,4);
  assert.equal(m.slope,0.25);
  assert.equal(m.conditionalMean,2);
  assert.equal(m.conditionalVariance,3);
  assert.equal(m.determinant,48);
});

test('uncorrelated jointly Gaussian variables have unchanged conditional law',()=>{
  const m=gaussianModel({muX:3,muY:10,sigmaX:2,sigmaY:9,rho:0,y:-999});
  assert.equal(m.conditionalMean,3);
  assert.equal(m.conditionalVariance,4);
});

test('perfect correlation yields zero variance and singular covariance',()=>{
  for(const rho of [-1,1]){
    const m=gaussianModel({muX:0,muY:0,sigmaX:3,sigmaY:2,rho,y:4});
    assert.equal(m.conditionalMean,6*rho);
    assert.equal(m.conditionalVariance,0);
    assert.equal(m.determinant,0);
    assert.equal(m.singular,true);
    assert.ok(sampleGaussian(m,8,23).every(p=>Math.abs(p.error)<1e-12));
  }
});

test('invalid parameter domains are rejected',()=>{
  assert.throws(()=>gaussianModel({sigmaY:0}),RangeError);
  assert.throws(()=>gaussianModel({rho:1.01}),RangeError);
  assert.throws(()=>gaussianModel({muX:NaN}),RangeError);
  assert.throws(()=>sampleGaussian(gaussianModel(),1,1),RangeError);
});

test('sampling is seeded and estimation error is independent of observation in construction',()=>{
  const m=gaussianModel({muX:0,muY:0,sigmaX:2,sigmaY:3,rho:.7,y:1});
  const a=sampleGaussian(m,1000,1234),b=sampleGaussian(m,1000,1234);
  assert.deepEqual(a,b);
  assert.notDeepEqual(a,sampleGaussian(m,1000,1235));
  assert.ok(Math.abs(sampleCorrelation(a,'y','error'))<0.10);
  assert.ok(Math.abs(sampleCorrelation(a,'y','x')-.7)<.10);
});
