var Listener = require('asteroids-listener');
var Asteroid = require('asteroids-asteroid');

var Game = module.exports = function(options){
    Listener.call(this);
    this.options = options;
    this._asteroids = [];
    this._fighters = [];
};
Game.prototype = new Listener();
Game.prototype.tick = function(){
    this._fighters.forEach(function(fighter){
	fighter.tick();
    });
    this._asteroids.forEach(function(asteroid){
	asteroid.tick();
    });
};
Game.prototype.state = function(){
    return {
	fighters: this.fighters(),
	asteroids: this.asteroids()
    };
};
Game.prototype.addAsteroid = function(){
    var asteroid = new Asteroid(this.options.asteroidInitializer);
    this._asteroids.push(asteroid);
    return asteroid;
};
Game.prototype.addFighter = function(fighter){
    this._fighters.push(fighter);
};
Game.prototype.asteroids = function(){
    return this._asteroids.map(function(asteroid){
	return asteroid.state();
    });
}
Game.prototype.fighters = function(){
    return this._fighters.map(function(fighter){
	return fighter.state();
    });
}
