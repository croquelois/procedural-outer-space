/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
let noise = require("./noise");

let max = Math.max;
let min = Math.min;
let cos = Math.cos;
let sin = Math.sin;
let atan2 = Math.atan2;
let sqrt = Math.sqrt;
let pow = Math.pow;
let exp = Math.exp;

function mix(c1,c2,a){
  if(a > 1) return c2;
  if(a < 0) return c1;
  return {r:c1.r*(1-a)+c2.r*a,g:c1.g*(1-a)+c2.g*a,b:c1.b*(1-a)+c2.b*a};
}

module.exports = function(scale, rnd){
  let step = [];
  if(!rnd) rnd = Math.random;
  let rndColor = function(){
    let v = rnd();
    return {r:v*rnd()*0.5,g:v*rnd(),b:v*rnd()};
  };
  let n = Math.round(rnd()*3+2);
  for(let i=0;i<n;i++){
    //let paramNoise = {octave:6,perturbation:0.75,shift:0.5+0.3*rnd(),fallout:16*(0.7+0.5*rnd()),force:0.1,octavePos:4,perturbationPos:0.75};
    let paramNoise = {
      octave:5,
      perturbation:0.25,
      shift:0.25,
      fallout:8*(0.5+0.5*rnd()),
      force:0.5,
      octavePos:4,
      perturbationPos:0.75
    };
    step.push({
      noise: noise(paramNoise),
      color: rndColor()
    });
  }

  return function(p){
    let c = {r:0,g:0,b:0};
    for(let i=0;i<n;i++){
      c = mix(c, step[i].color, step[i].noise({x:scale*p.x,y:scale*p.y}));
    }
    return c;
  };
};
