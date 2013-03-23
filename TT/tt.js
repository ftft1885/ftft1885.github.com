var TT = {};

(function(exports){

"use strict";
var ctx = null;
var width = null;
var height = null;
var sprites = [];

exports.Stage = function(_opt){
	var opt = {
		height: 600,
		width: 800
	}
	if(typeof _opt === 'object'){
		for(var key in _opt){
			opt[key] = _opt[key];
		}
	}
	var canvas = document.createElement('canvas');
	canvas.height = opt.height;
	canvas.width = opt.width;
	height = canvas.height;
	width = canvas.width;
	canvas.style.cssText = "margin: 0 auto;background:#000";
	ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height);
	document.body.appendChild(canvas);
	return new Stage({height:canvas.width,width:canvas.height});
}

function Stage(opt){
	this.width = opt.width;
	this.height = opt.height;
	return this;
}

Stage.prototype.add = function(el){
	//drawImg(el.img,el.pos);
	sprites.push(el);
}

function action(){
	setInterval(function(){
		ctx.clearRect(0,0,width,height);
		drawAll();		
	},60);
}

function drawAll(){
	sprites.forEach(function(el){
		var args = [];
		if(el.spos && el.spos.length === 4){
			el.spos.forEach(function(s){
				args.push(s);
			});
			el.pos.forEach(function(s){
				args.push(s);
			});
			args.push(el.spos[2]);
			args.push(el.spos[3]);
			
			if(el.angle !== 0){
				var _y = el.pos[1]+el.spos[3]/2;
				var _x = el.pos[0]+el.spos[2]/2;
				var _angle = Math.atan( _y / _x ) - el.angle;
				var _length = Math.sqrt(_x*_x+_y*_y);
				var _pos = [_length * Math.cos(_angle) - el.spos[2]/2,_length * Math.sin(_angle) - el.spos[3]/2];
				args[4] = _pos[0];
				args[5] = _pos[1];
				ctx.save();
				ctx.rotate(el.angle);
			}
			
			
			drawImg(el.img,args);
			if(el.angle !== 0){
				ctx.restore();
			}
			
		}
		else{
			drawImg(el.img,el.pos);
		}
		
		
		el.update();
	});
}

exports.Load = function(assets,callback){
	var my = {};
	var count = 0;
	var all = 0;
	for(var key in assets){
		all++;
		my[key] = new Image();
		my[key].src = assets[key];
		my[key].onload = function(){
			count++;
			if(count === all){
				action();
				callback(my);
			}
		}
	}
}

exports.Sprite = function(opt){
	return new Sprite(opt);
}

function Sprite(opt){
	this.frames = opt.frames || [];
	this.cframe = 0;
	this.angle = opt.angle || 0;
	this.img = opt.img;
	this.pos = opt.pos || [0,0];
	this.spos = opt.spos || [0,0];
	if(this.frames[0] && this.frames[0].length !== 0){
		this.spos = this.frames[0];
	}
	return this;
}

Sprite.prototype.update = function(opt){		
	this.spos = this.frames[this.cframe] || this.frames[0];
	if(this.cframe >= this.frames.length-1){
		this.cframe = -1;
	}	
	this.cframe ++;
}

Sprite.prototype.addFrame = function(frames){
	var self = this;
	frames.forEach(function(frame){
		self.frames.push(frame);
	});
}


function drawImg(img,arr){
	switch(arr.length){
		case 2: ctx.drawImage(img,arr[0],arr[1]);break;
		case 4: ctx.drawImage(img,arr[0],arr[1],arr[2],arr[3]);break;
		case 8: ctx.drawImage(img,arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7]);
	}
}

exports.Frame = function(img,opt){
	var frames = [];
	var width = img.width;
	var height = img.height;
	if(opt && opt.w){		
		for(var i = 0; i < opt.w; i++){
			frames.push([width/opt.w*i,0,width/opt.w,height]);
		}
	}
	
	return frames;
	/*
	var width = el.img.width;
	var height = el.img.height;
	if(opt.w){		
		for(var i = 0; i < opt.w; i++){
			//[panda.img.width/11*2,0,panda.img.width/11,panda.img.height]
			frames.push([width/opt.w*i,0,width/opt.w,height]);
		}
	}	
	return frames;
	*/
}

	
	
})(TT);

if(typeof module !== "undefined" && module.exports){
	module.exports = TT;
}else{
	window.TT = TT;
}