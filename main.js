/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
let assert = require("assert");
let Grid = require("Grid");
require("./GridAdvTexture")(Grid);
require("./GridAdvDrawing")(Grid);
let async = require("async");
let textureGalaxy = require("./textureGalaxy");
let textureNebulae = require("./textureNebulae");

let rnd = Math.random;

function stars(image, nb){
  let width = image.w;
  let height = image.h;
  let rndPos = function(){ return {x:~~(rnd()*width),y:~~(rnd()*height)}; };
  for(let i=0;i<nb;i++){
    let v = rnd();
    let p = rndPos();
    let c = image.get(p);
    let nc = {r:c.r+v,g:c.g+v,b:c.b+v};
    if(nc.r > 1) nc.r = 1;
    if(nc.g > 1) nc.g = 1;
    if(nc.b > 1) nc.b = 1;
    image.set(p,nc);
  }
}

function doOneImage(width,height,i,cb){
  console.log("start drawing image " + i);
  let rndPos = function(){ return {x:~~(rnd()*width),y:~~(rnd()*height)}; };
  let scale = Math.sqrt(width*height);
  let image = new Grid(width,height);
  let nbGalaxy = 5;
  image.fill({r:0,g:0,b:0});
  for(let j=0;j<nbGalaxy;j++){
    let galaxySize = (1+4*rnd());
    let distance = (4+10*Math.log(1+j))*(1+rnd());
    let viewSize = scale*galaxySize/distance;
    let intensity = Math.pow(1/distance,0.25);
    let color = {r:0.5+0.5*(rnd()*2-1),g:0.8+0.2*(rnd()*2-1),b:0.9+0.1*(rnd()*2-1)};
    let noiseScale = 8;
    let vA = 0.5+rnd();
    let corePower = 3+rnd()*2;
    let flatten = rnd()*4+1;
    let rotation = rnd()*Math.PI*2;
    console.log("add galaxy " + j + "/" + nbGalaxy);
    image.addTexture(rndPos(),viewSize, rotation, textureGalaxy(color,noiseScale,vA,0.1,corePower,flatten), intensity);
  }
  console.log("add stars");
  stars(image, ~~(0.01*width*height));
  console.log("add nebulae");
  image.addTexture({x:0,y:0}, 1, 0, textureNebulae(0.004),0.5);
  console.log("write image on disk");
  image.draw(1, "image", "image", i,function(err, name){
    console.log(err || ("image '"+name+"' wrote"));
    setTimeout(cb,0);
  });
}
let idx = [];
let size = +process.argv[2] || 128;
for(let i=0;i<(+process.argv[3]||1);i++) idx.push(i);
async.eachSeries(idx,doOneImage.bind(null,size,size),function(){ console.log("done"); });
