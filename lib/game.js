var Listener = require('asteroids-listener');

var Game = module.exports = function(){
    Listener.call(this);
};
Game.prototype = new Listener();
Game.prototype.tick = function(){};
Game.prototype.state = function(){
    return {
	fighters: [],
	asteroids: []
    };
};
