/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
let Perlin = require("PerlinSimplex");

let max = Math.max;
let min = Math.min;
let cos = Math.cos;
let sin = Math.sin;
let atan2 = Math.atan2;
let sqrt = Math.sqrt;
let pow = Math.pow;
let exp = Math.exp;

function clump(v){ return max(0,min(1,v)); }

/**
color: Color of the galaxy
noiseScale: scale of the perlin noise used in the galaxy (8 is good)
angularVelocity: control the rotation of the galaxy
radiusMin: control the rotation of the galaxy
a += angularVelocity/(radius + radiusMin)
corePower: intensity of the core of the galaxy
flatten: to flatten the galaxy (1 => circle, start to flatten above 1)
*/
module.exports = function(color, noiseScale, angularVelocity, radiusMin, corePower, flatten, perlins){
  let c = color;
  let s = noiseScale;
  let vA = angularVelocity;
  if(corePower === undefined) corePower = 4;
  if(flatten === undefined) flatten = 1;
  let P, P2;
  if(perlins){
    P = perlins[0];
    P2 = perlins[1];
  }else{
    P = new Perlin();
    P.noiseDetail(5,0.25);
    P2 = new Perlin();
    P2.noiseDetail(5,0.25);
  }
  return function(p){
    p.y *= flatten;
    let r = sqrt(p.x*p.x+p.y*p.y);
    let p2 = p;
    if(r){
      if(r > 1) return {r:0,g:0,b:0};
      let a = atan2(p.y,p.x) + vA/(r+radiusMin);
      p2 = {x:r*cos(a),y:r*sin(a)};
    }
    let v = P2.noise(s*p2.x,s*p2.y,0);
    v = v*pow(clump((10-r*10)/(10-4)),4);
    v *= clump((0.25*(pow(1.5*P.noise(s*p.x,s*p.y,0),2)-1))+1);
    v = clump(v);
    let v2 = clump((10-r*10)/(10-4))*exp(-corePower*r);
    return {r:clump(v*c.r+v2),g:clump(v*c.g+v2),b:clump(v*c.b+v2)};
  };
};
