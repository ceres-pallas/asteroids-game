var Listener = require('asteroids-listener');
var Asteroid = require('asteroids-asteroid');
var Bullet = require('asteroids-bullet');

var defaultOptions = {
    width: 10, height: 10,
    bullet : { radius: 1 }
};

var Game = module.exports = function(options){
    Listener.call(this);
    this.options = options || {};
    for (key in defaultOptions) {
        if (!this.options[key]) {
            this.options[key] = defaultOptions[key];
        }
    }
    this._asteroids = [];
    this._fighters = [];
    this._bullets = [];
};
Game.prototype = new Listener();
Game.prototype.tick = function(){
    this._fighters.forEach(function(fighter){
        fighter.tick();
    });
    this._asteroids.forEach(function(asteroid){
        asteroid.tick();
    });
    this._bullets.forEach(function(bullet){
        bullet.tick();
    });
    this.normalizeAll();
};
Game.prototype.normalizeAll = function(){
    this._fighters.forEach(this.normalize.bind(this));
    this._asteroids.forEach(this.normalize.bind(this));
    this._bullets.forEach(this.normalize.bind(this));
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
        asteroids: this.asteroids(),
        bullets: this.bullets()
    };
};
Game.prototype.addAsteroid = function(){
    var asteroid = new Asteroid(this.options.asteroidInitializer);
    this._asteroids.push(asteroid);
    return asteroid;
};
Game.prototype.addFighter = function(fighter){
    fighter.addListener('fire', function(){
        var bullet = new Bullet();
        var r = fighter.radius() + this.options.bullet.radius;
        var x = fighter.x() + r * Math.cos(fighter.orientation());
        var y = fighter.y() + r * Math.sin(fighter.orientation());
        bullet.position({ x: x, y: y })
		bullet.radius(this.options.bullet.radius);
        bullet.orientation(fighter.orientation());
        bullet.heading(fighter.orientation());
        bullet.speed(this.options.bullet.speed);
        this.addBullet(bullet);
    }.bind(this));
    this._fighters.push(fighter);
};
Game.prototype.addBullet = function(bullet){
    this._bullets.push(bullet);
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
Game.prototype.bullets = function(){
    return this._bullets.map(function(bullet){
        return bullet.state();
    });
}
