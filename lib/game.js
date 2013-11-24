var Listener = require('asteroids-listener');
var Asteroid = require('asteroids-asteroid');

var Game = module.exports = function(options){
    Listener.call(this);
    this.options = options;
    this._asteroids = [];
};
Game.prototype = new Listener();
Game.prototype.tick = function(){
    this._asteroids.forEach(function(asteroid){
	asteroid.tick();
    });
};
Game.prototype.state = function(){
    return {
	fighters: [],
	asteroids: this.asteroids()
    };
};
Game.prototype.addAsteroid = function(){
    var asteroid = new Asteroid(this.options.asteroidInitializer);
    this._asteroids.push(asteroid);
    return asteroid;
};
Game.prototype.asteroids = function(){
    return this._asteroids.map(function(asteroid){
	return asteroid.state();
    });
}
