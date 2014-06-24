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
    this.normalizeAll();
};
Game.prototype.normalizeAll = function(){
    this._fighters.forEach(this.normalize.bind(this));
    this._asteroids.forEach(this.normalize.bind(this));
};
Game.prototype.normalize = function(velocity){
    if (velocity.x() > this.options.width) {
		var x = velocity.x();
		while (x > this.options.width) {
			x -= this.options.width;
		}
		velocity.x(x);
    }
    if (velocity.x() < 0) {
		var x = velocity.x();
		while (x < 0) {
			x += this.options.width;
		}
		velocity.x(x);
    }

    if (velocity.y() > this.options.height) {
		var y = velocity.y();
		while (y > this.options.height) {
			y -= this.options.height;
		}
		velocity.y(y);
    }
    if (velocity.y() < 0) {
		var y = velocity.y();
		while (y < 0) {
			y += this.options.height;
		}
		velocity.y(y);
    }
}
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
