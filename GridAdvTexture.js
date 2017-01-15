/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
var Perlin = require("PerlinSimplex");

let cos = Math.cos;
let sin = Math.sin;
let max = Math.max;
let min = Math.min;

module.exports = function(Grid){

Grid.newFromTexture = function(w,h,texture){
  return (new Grid(w, h)).each(p => texture({x:2*p.x/w-1,y:2*p.y/h-1}));
};

Grid.prototype.opTexture = function(center, scale, rotation, texture, fct){
  let sx = scale;
  let sy = scale;
  if(typeof scale != "number"){
    sx = scale.x;
    sy = scale.y;
  }
  let c = center;
  this.each(function(p,v){
    p = {x:(p.x-c.x)/sx,y:(p.y-c.y)/sy};
    let p2 = {x:p.x,y:p.y};
    if(rotation){
      p2.x = p.x*cos(rotation)-p.y*sin(rotation);
      p2.y = p.x*sin(rotation)+p.y*cos(rotation);
    }
    let nv = texture(p2);
    return fct(v, nv);
  });
  return this;
};

Grid.prototype.addTexture = function(center, scale, rotation, texture, alpha){
  if(alpha === undefined) alpha = 1;
  function clump(v){ return max(0,min(1,v)); }
  return this.opTexture(center, scale, rotation, texture, function(v, nv){
    return {r:clump(alpha*nv.r+v.r),g:clump(alpha*nv.g+v.g),b:clump(alpha*nv.b+v.b)};
  });
};

Grid.prototype.applyTexture = function(center, scale, rotation, texture){
  return this.opTexture(center, scale, rotation, texture, (v, nv) => nv);
};

Grid.prototype.mergeTexture = function(center, scale, rotation, texture, alpha){
  if(alpha === undefined) alpha = 0.5;
  if(alpha > 1) return this.applyTexture(center, scale, rotation, texture);
  if(alpha < 0) return this;
  let a = alpha;
  return this.opTexture(center, scale, rotation, texture, function(v, nv){
    return {r:v.r*(1-a)+nv.r*a,g:v.g*(1-a)+nv.g*a,b:v.b*(1-a)+nv.b*a};
  });
};

Grid.newFromPerlin = function(width,height,nbOctave,disturbFactor,fScl,z,prng){
  var P = new Perlin();
  if(prng) P.setRng(prng);
  P.noiseDetail(nbOctave,disturbFactor);
  var grid = new Grid(width, height);
  grid.each(function(p){
    return P.noise(fScl*p.x/width,fScl*p.y/height,z);
  });
  return grid;
};

};
