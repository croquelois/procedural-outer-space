/* jshint esversion:6, node:true, loopfunc:true, undef: true, unused: true, sub:true */
"use strict";
var Buffer = require('buffer').Buffer;
let lwip = require('lwip');

module.exports = function(Grid){

function pad0(n){ return ("0000"+n).slice(-4); }

Grid.prototype.draw = function(zoom,dir,file,n,cb){
  let w = this.w;
  let h = this.h;
  let offset = w*h*zoom*zoom;
  let pixels = new Buffer(offset*3);
  let data = this.data;

  if(typeof data[0] == "number"){
    let off = 0;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        let c = (data[off++] || 0);
        for(let zy=0;zy<zoom;zy++){
          for(let zx=0;zx<zoom;zx++){
            let i = (y*zoom+zy)*w*zoom + (x*zoom+zx);
            pixels[i         ] = ~~(c*255);
            pixels[i+1*offset] = ~~(c*255);
            pixels[i+2*offset] = ~~(c*255);
          }
        }
      }
    }
  }else{
    let off = 0;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        let c = (data[off++] || 0);
        for(let zy=0;zy<zoom;zy++){
          for(let zx=0;zx<zoom;zx++){
            let i = (y*zoom+zy)*w*zoom + (x*zoom+zx);
            pixels[i         ] = ~~(c.r*255);
            pixels[i+1*offset] = ~~(c.g*255);
            pixels[i+2*offset] = ~~(c.b*255);
          }
        }
      }
    }
  }
  lwip.open(pixels, {width:w*zoom,height:h*zoom}, function(err,image){
    if(err) return cb(err);
    let filename = dir + '/'+file+'-'+pad0(n)+'.png';
    image.writeFile(filename,err => cb(err,filename));
  });
};

};
