/////////////////////////////////////
//
/* 

Library functions. Parameters in brackets are optional.

loadimage(image_file_name) -- must be executed BEFORE the initialize function
initialize(startup_function_name, run_function_name)

setbackground(image_file_name)
setboard(array_of_strings)
settileimage(letter, image_file_name)
settile(column, row, letter)
tile(column, row) -- returns a letter

ispressing(control) -- returns true or false
isholding(control) -- returns true or false

drawline(start_x, start_y, end_x, end_y, color)
drawcircle(center_x, center_y, radius, color)
drawtext(text, x, y, [color, size, font, alignment])

Creating objects:

var obj = Object([image_file_name])

Object variables. Set these as needed:

obj.x, obj.x -- position
obj.xvel, obj.yvel -- velocity
obj.width, obj.height -- size
obj.angle -- rotation in degrees
obj.isflipped -- reverses image (set to true/false)
obj.isdeleted -- if set to true, purgelist will remove it

Object functions:

obj.setimage(image_file_name)
obj.draw() -- draws object on screen
obj.pointat(x, y) -- changes angle to point at a spot
obj.velocityat(x, y, speed) -- sets velocity to move toward a spot
obj.setvelocity(angle, speed)
obj.move() -- moves position according to velocity
obj.distanceto(x, y) -- returns distance to a position
obj.iscolliding(another_object) -- returns true if touching another object
obj.ismouseover() -- returns true if touching mouse pointer
obj.ontile() -- returns board tile letter object is touching
obj.column() -- returns board column object is on
obj.row() -- returns board row object is on

Utility functions:

purgelist(list_name) -- removes all objects 
	where isdeleted is true from list_name
randint(low, high) -- return a random integer from low to high

Global objects:

set these values:
view.x, view.y -- to scroll the view
view.width, view.height -- to determine the view scale
board.tilewidth, board.tileheight -- to determine the size of environment tiles

these are set automatically:
mouse.x, mouse.y -- the mouse position
board.columns, board.rows -- the size of the board
screen.width, screen.height -- the size of the screen
tick -- the fraction of a second that has elapsed
	since the previous vrame

*/

///////////////////////////////
//
//  global settings
//

// control value constants
var CLICK = 1;
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, SPACE = 32;
var KEY_A = 65, KEY_B = 66, KEY_C = 67, KEY_D = 68, KEY_E = 69, KEY_F = 70;
var KEY_G = 71, KEY_H = 72, KEY_I = 73, KEY_J = 74, KEY_K = 75, KEY_L = 76;
var KEY_M = 77, KEY_N = 78, KEY_O = 79, KEY_P = 80, KEY_Q = 81, KEY_R = 82;
var KEY_S = 83, KEY_T = 84, KEY_U = 85, KEY_V = 86, KEY_W = 87, KEY_X = 88;
var KEY_Y = 89, KEY_Z = 90, KEY_0 = 48, KEY_1 = 49, KEY_2 = 50, KEY_3 = 51;
var KEY_4 = 52, KEY_5 = 53, KEY_6 = 54, KEY_7 = 55, KEY_8 = 56, KEY_9 = 57;

// global environment variables
var mousedevice = {x:0, y:0};
var mouse = {x:0, y:0};
var view = {x:0, y:0, width:800, height:600};
var screen = {width:800, height:600};
var board = {columns:0, rows:0, tilewidth:100, tileheight:100};
var tick = 0.01;

////////////////////////////////
//
// initialization functions
//

function loadimage(name)
{
	ASSET_MANAGER.queueDownload('gfx/' + name + '.png');
}

function initialize(startFunc, runFunc)
{
	game.startFunc = startFunc;
	game.runFunc = runFunc;
	ASSET_MANAGER.downloadAll(game.init);
}

//////////////////////////////////
//
// environment functions
//

function setbackground(name)
{
	if (game.backname_ == name)
		return;
	game.backname_ = name;	
}

function setboard(text)
{
	board.columns = 0;
	board.rows = 0;
	game.board_ = [];
	for (var i = 0; i < text.length; i++)
		game.board_.push(text[i]);
//	game.board_ = text;
	board.rows = game.board_.length;
	for (line in text)
		if (text[line].length > board.columns)
			board.columns = text[line].length;
}

function settile(col, row, character)
{
	if (game.board_ == null)
		game.board_ = [];
	while (game.board_.length < row + 1)
		game.board_.push('');
	while (game.board_[row].length < col + 1)
		game.board_[row] += ' ';
	game.board_[row] = game.board_[row].substr(0, col) 
		+ character + game.board_[row].substr(col + 1);
	if (board.rows <= row)
		board.rows = row + 1;
	if (board.columns <= col)
		board.columns = col + 1;
}

function tile(col, row)
{
	if (game.board_ == null) 
		return ' ';
	if ((row < 0) || (row >= game.board_.length))
		return ' ';
	if ((col < 0) || (col >= game.board_[row].length))
		return ' ';
	return game.board_[row][col];
}

function settileimage(character, name)
{
	game.tiletype_[character] = name;
	game.tileimg_[character] = null;
	game.tilesrc_[character] = ASSET_MANAGER.getAsset('gfx/' + name + '.png');
}


///////////////////////////////////
//
// input functions
//

function ispressing(k)
{
	return game.pressmap_[k] == true;
}

function isholding(k)
{
	return game.holdmap_[k] == true;
}

//////////////////////////////
//
// drawing primitives
//

function drawline(startx, starty, endx, endy, color, width)
{
	ctx.strokeStyle = color;
	ctx.lineWidth = width * game.scale_;
	ctx.beginPath();
	ctx.moveTo((startx - view.x) * game.scale_, (starty - view.y) * game.scale_);
	ctx.lineTo((endx - view.x) * game.scale_, (endy - view.y) * game.scale_);
	ctx.stroke();
}

function drawcircle(x, y, radius, color)
{
	ctx.strokeStyle = color;
	ctx.lineWidth = 3 * game.scale_;
	ctx.beginPath();
    ctx.arc((x - view.x) * game.scale_, (y - view.y) * game.scale_, radius * game.scale_, 0, Math.PI * 2, false);
	ctx.stroke();
}

function drawtext(text, x, y, color, size, font, align)
{
	if (font == null)
		font = 'sans-serif';
	if (size == null)
		size = 30;
	if (color == null)
		color = 'black';
	if (align == null)
		align = 'center';
	ctx.textAlign = align;
	ctx.textBaseline = (align == 'center') ? 'middle' : 'top';
	ctx.fillStyle = color;
	font = Math.floor(size * game.scale_) + 'px ' + font;
	ctx.font = font; 
	ctx.fillText(text, (x - view.x) * game.scale_, (y - view.y) * game.scale_);
}

////////////////////////////
//
// graphics Object definition
//

function Object(name) 
{
	// variables for use in programs
    this.x = view.width / 2;
    this.y = view.height / 2;
	this.isflipped = false;
    this.isdeleted = false;
	this.xvel = 0;
	this.yvel = 0;
	this.width = 100;
	this.height = 100;
	this.angle = 0;

	// variables for internal housekeeping
	// DO NOT MODIFY OR USE THESE
	this.img_ = null;
	this.img_src_ = null;
	this.img_angle_ = 0;
	this.img_width_ = 0;
	this.img_height_ = 0;
	this.img_radius_ = 0;
	this.scale_ = 0;
	this.setimage(name)
}

Object.prototype.setimage = function(name)
{
	if (this.img_name_ == name)
		return;
	this.img_name_ = name;
	this.img_ = null;
	if (name == null)
		return;
    this.img_src_ = ASSET_MANAGER.getAsset('gfx/' + name + '.png');
}

Object.prototype.move = function(factor)
{
	if (factor == null)
		factor = 1;
	this.x += this.xvel * tick * factor;
	this.y += this.yvel * tick * factor;
}

Object.prototype.draw = function() 
{
	if (this.img_src_ == null)
		return;
		
	if ( (this.img_ == null) || (this.angle != this.img_angle_) ||
		 (this.scale_ != game.scale_) ||
		 (this.width != this.img_width_) ||
		 (this.height != this.img_height_) ||
		 (this.isflipped != this.isflipped_) ) {
		 
		this.img_ = document.createElement('canvas');
		var size = Math.max(this.width, this.height) * 1.4;
		var width = this.width * game.scale_;
		var height = this.height * game.scale_;
		this.img_.width = size * game.scale_;
		this.img_.height = size * game.scale_;
		
		var tempctx = this.img_.getContext('2d');
		tempctx.save();
		tempctx.translate(this.img_.width / 2, this.img_.height / 2);
		tempctx.rotate(-this.angle * Math.PI * 2 / 360);
		tempctx.translate(0, 0);
		tempctx.scale(this.isflipped ? -1 : 1, 1);
		tempctx.drawImage(this.img_src_, -width / 2, -height / 2, width, height);
		tempctx.restore();
		
		this.img_angle_ = this.angle;
		this.img_width_ = this.width;
		this.img_height_ = this.height;
		this.img_radius_ = (this.height + this.width) / 3;
		this.isflipped_ = this.isflipped;
		this.scale_ = game.scale_;
	}
    ctx.drawImage(this.img_, (this.x - view.x) * game.scale_ - this.img_.width / 2 , (this.y - view.y) * game.scale_ - this.img_.height / 2);
}

Object.prototype.distanceto = function(x, y)
{
	var difx = x - this.x;
	var dify = y - this.y;
	return Math.sqrt(difx * difx + dify * dify)
}

Object.prototype.ismouseover = function()
{
	if (this.img_ == null)
		return;
	return this.distanceto(mouse.x, mouse.y) < this.img_radius_;
}

Object.prototype.iscolliding = function(other)
{
	if ((this.img_ == null) || (other.img_ == null))
		return false;
	return this.distanceto(other.x, other.y) < this.img_radius_ + other.img_radius_;
}

Object.prototype.column = function()
{
	if (board.tilewidth == 0)
		return 0;
	return parseInt(this.x / board.tilewidth - (this.x < 0 ? 1 : 0))
}

Object.prototype.row = function()
{
	if (board.tileheight == 0)
		return 0;
	return parseInt(this.y / board.tileheight - (this.y < 0 ? 1 : 0))
}

Object.prototype.ontile = function()
{
	return game.tile(this.column(), this.row());
}

Object.prototype.pointat = function(x, y)
{
    this.angle = Math.atan2(this.y - y, x - this.x) * 180 / Math.PI;
}

Object.prototype.velocityat = function(x, y, speed)
{
	var difx = x - this.x;
	var dify = y - this.y;
	var hypotenuse = Math.sqrt(difx * difx + dify * dify);
	if (hypotenuse == 0) {
		this.xvel = 0
		this.yvel = 0
	}
	else {
		this.xvel = difx * speed / hypotenuse;
		this.yvel = dify * speed / hypotenuse;
	}
}

Object.prototype.setvelocity = function(angle, speed)
{
	this.xvel = Math.cos(-angle * Math.PI / 180) * speed;
	this.yvel = Math.sin(-angle * Math.PI / 180) * speed;
}

Object.prototype.isonscreen = function()
{
	if (this.x < view.x - this.width / 2)
		return false;
	if (this.y < view.y - this.height / 2)
		return false;
	if (this.x > view.x + screen.width + this.width / 2)
		return false;
	if (this.y > view.y + screen.height + this.height / 2)
		return false;
	return true;
}

///////////////////////////////
//
// utility functions
//

function purgelist(list)
{    
    for (var i = list.length - 1; i >= 0; --i)
        if (list[i].isdeleted)
            list.splice(i, 1);
}

function randint(low, high)
{
	return low + Math.floor(Math.random() * (high - low + 1));
}

/////////////////////////////////////////////////////////////////////
//
// *** WARNING ***: variables and functions below this line 
// should NOT be modified or used outside of this source file
//
//

/////////////////////////////////
//
// browser window housekeeping
//

var canvas_ = document.getElementById('gamescreen');
var ctx = canvas_.getContext('2d');

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

function preventEvent(e)
{
	e.preventDefault();
}

document.onkeydown = preventEvent;
document.onclick = preventEvent;
document.onmousedown = preventEvent;
document.onmouseup = preventEvent;
document.ondlbclick = preventEvent;
document.onmousemove = preventEvent;
document.onmouseover = preventEvent;
document.onmouseout = preventEvent;

function pageWidth() {return document.body != null ? document.body.clientWidth : window.innerWidth != null ? window.innerWidth : null;}
function pageHeight() {return window.innerHeight != null ? window.innerHeight : document.body != null ? document.body.clientHeight : null;} 
function checksize() 
{
	if (canvas_ == null)
		return;
	canvas_.width = pageWidth() - 20;
	canvas_.height = pageHeight() - 25;
	game.scale_ = 0; // force recalculation
}

////////////////////////////////
//
// asset manager for loading graphics
//

function AssetManager() 
{
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function(path) 
{
    this.downloadQueue.push(path);
}

AssetManager.prototype.downloadAll = function(downloadCallback) 
{
    if (this.downloadQueue.length === 0)
        downloadCallback();
    
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function() {
            console.log(this.src + ' is loaded');
            that.successCount += 1;
            if (that.isDone()) {
                downloadCallback();
            }
        }, false);
        img.addEventListener("error", function() {
            console.log(this.src + ' load error');
            that.errorCount += 1;
            if (that.isDone()) {
                downloadCallback();
            }
        }, false);
        img.src = path;
        this.cache[path] = img;
    }
}

AssetManager.prototype.getAsset = function(path) 
{
	if (this.cache[path] == null)
		alert(path + ' is not loaded.');
    return this.cache[path];
}

AssetManager.prototype.isDone = function() 
{
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}

var ASSET_MANAGER = new AssetManager();

////////////////////////////////////////
//
//  timer to handle fractional frame movement
//

function Timer() 
{
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() 
{
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;
    
    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

//////////////////////////
//
// global game object
//

var game;

function GameEngine() 
{
	self = this;
    self.ctx = null;
    self.timer = new Timer();

	self.screen = {width:0, height:0};
	self.view_width_ = 0;
	self.view_height_ = 0;
	self.scale_ = 0;
	
	self.holdmap_ = {}
	self.pressmap_ = {}
	
	self.backimg_ = null;
	self.backname_ = null;
	
	self.tiletype_ = {};
	self.tileimg_ = {};
	self.tilesrc_ = {};
	self.tilewidth_ = 0;
	self.tileheight_ = 0;
}

GameEngine.prototype.init = function() 
{
    self.ctx = ctx;
    self.startInput();
    
    console.log('game initialized');
	
	self.startFunc();
	self.start();
}

GameEngine.prototype.start = function() 
{
    console.log("starting game");
    (function gameLoop() {
        game.loop();
        requestAnimFrame(gameLoop, game.ctx.canvas);
    })();
}

function moveEvent(e)
{
	if (game.scale_ == 0)
		return;
	mousedevice = {x: (e.clientX - game.ctx.canvas.getBoundingClientRect().left) / game.scale_, 
				   y: (e.clientY - game.ctx.canvas.getBoundingClientRect().top) / game.scale_};

}

function mousedownEvent(e) 
{
	game.holdmap_[CLICK] = true;
	game.pressmap_[CLICK] = true;
}

function mouseupEvent(e)
{
	game.holdmap_[CLICK] = false;
}

function keydownEvent(e)
{
	game.holdmap_[e.keyCode] = true;
	game.pressmap_[e.keyCode] = true;
}

function keyupEvent(e)
{
	game.holdmap_[e.keyCode] = false;
}

GameEngine.prototype.startInput = function() 
{
    ctx.canvas.addEventListener("mousemove", moveEvent, false);

    ctx.canvas.addEventListener("mousedown", mousedownEvent, false);
    ctx.canvas.addEventListener("mouseup", mouseupEvent, false);

	window.addEventListener('keydown', keydownEvent, false);
	window.addEventListener('keyup', keyupEvent, false);
}

GameEngine.prototype.drawTile = function(row, col)
{
	if ((row < 0) || (row >= self.board_.length) ||
			(col < 0) || (col >= self.board_.width))
		return;

	var tilechar = self.board_[row][col];
	var tileimg = self.tileimg_[tilechar];
	if (tileimg == null) {
		var tilesrc = self.tilesrc_[tilechar];
		if (tilesrc == null)
			return;
		// transform the source and save it in the tileimg cache
		tileimg = document.createElement('canvas');
		tileimg.width = self.tilewidth_ * game.scale_ + 2; // allow some overlap
		tileimg.height = self.tileheight_ * game.scale_ + 2; // allow some overlap
		tileimg.getContext('2d').drawImage(tilesrc, 0, 0, tileimg.width, tileimg.height);
		self.tileimg_[tilechar] = tileimg;
	}
	ctx.drawImage(tileimg, (col * self.tilewidth_ - view.x) * game.scale_, 
		(row * self.tileheight_ - view.y) * game.scale_);
}

GameEngine.prototype.tile = function(col, row)
{
	if (self.board_ == null)
		return;
	if ((row < 0) || (row >= self.board_.length))
		return ' ';
		
	if (self.board_[row] == null) {
		return ' ';
	}
		
	if ((col < 0) || (col >= self.board_[row].length))
		return ' ';
	return self.board_[row][col];
}

GameEngine.prototype.loop = function() 
{
    tick = self.timer.tick();

	mouse = {x: mousedevice.x + view.x, 
			 y: mousedevice.y + view.y};

	if ((self.scale_ == 0) || (self.view_width_ != view.width) || (self.view_height_ != view.height)) {
		self.screen.width_ = canvas_.width;
		self.screen.height_ = canvas_.height;
		self.view_width_ = view.width;
		self.view_height_ = view.height;
		var scalex = self.screen.width_ / view.width;
		var scaley = self.screen.height_ / view.height;
		self.scale_ = Math.min(scalex, scaley);
		screen.width = canvas_.width / self.scale_;
		screen.height = canvas_.height / self.scale_;
		// all images will need rescaling
		self.backimg_ = null;
		self.tileimg_ = {};
	}

    ctx.clearRect(0, 0, canvas_.width, canvas_.height);

	if ((self.backimg_ == null) && (self.backname_ != null)) {
		var tempimg = ASSET_MANAGER.getAsset('gfx/' + self.backname_ + '.png');
		var backscale = Math.max(game.screen.width_ / tempimg.width, game.screen.height_ / tempimg.height);
		self.backimg_ = document.createElement('canvas');
		self.backimg_.width = tempimg.width * backscale;
		self.backimg_.height = tempimg.height * backscale;
		var tempctx = game.backimg_.getContext('2d');
		tempctx.drawImage(tempimg, 0, 0, self.backimg_.width, self.backimg_.height);
	}
	if (self.backimg_ != null)
		ctx.drawImage(self.backimg_, 0, 0);
	
	if (self.board_ != null) {
		if ((self.tilewidth_ != board.tilewidth) || (self.tileheight_ != board.tileheight_)) {
			self.tileimg_ = {};
			self.tilewidth_ = board.tilewidth;
			self.tileheight_ = board.tileheight;
		}
		var starty = parseInt(view.y / self.tileheight_);
		var endy = parseInt(starty + (screen.height / self.tileheight_) + 2);
		var startx = parseInt(view.x / self.tilewidth_);
		var endx = parseInt(startx + (screen.width / self.tilewidth_) + 2);
		var row, col;
		for (row = starty; row < endy; row++)
			for (col = startx; col < endx; col++)
				self.drawTile(row, col);
	}

    ctx.save();
    self.runFunc();
    ctx.restore();

	self.pressmap_ = {};
}

/////////////////////////////////
//
// engine initialization
//

document.body.style.background = "#000000";
window.onresize = checksize;
game = new GameEngine();
checksize();
drawtext('Loading. Please wait...', canvas_.width / 2, canvas_.height / 2, 'white', 50);
