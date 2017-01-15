/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
let Perlin = require("PerlinSimplex");

let pow = Math.pow;

module.exports = function(param){
  let octave = param.octave || 5;
  let perturbation = param.perturbation || 0.25;
  let fallout = param.fallout || 1;
  let shift = param.shift || 0;
  let force = param.force || 0;

  let P = new Perlin();
  P.noiseDetail(octave,perturbation);
  let noise = p => P.noise(p.x,p.y);
  if(!force){
    if(fallout === 1){
      if(shift === 0) return noise;
      return p => noise(p)+shift;
    }
    if(shift === 0) return p => pow(noise(p),fallout);
    return p => pow(noise(p)+shift,fallout);
  }

  let octavePos = param.octavePos || 5;
  let perturbationPos = param.perturbationPos || 0.25;
  let falloutPos = param.falloutPos || 1;
  let shiftPos = param.shiftPos || 0;
  function f(n){ return force*pow(n+shiftPos,falloutPos); }

  let noiseX, noiseY;
  let P2 = new Perlin();
  P2.noiseDetail(octavePos,perturbationPos);
  noiseX = P2.noise.bind(P2);
  P2 = new Perlin();
  P2.noiseDetail(octavePos,perturbationPos);
  noiseY = P2.noise.bind(P2);
  function noisePos2d(p){
    return {x: p.x+f(noiseX(p.x,p.y)), y: p.y+f(noiseY(p.x,p.y))};
  }

  return function(p){
    return pow(noise(noisePos2d(p))+shift,fallout);
  };
};
