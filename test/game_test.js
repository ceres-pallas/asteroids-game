var expect = require('chai').expect;

var Game = require('../lib/game');

describe('Game', function(){
    it('should exist', function(){
	expect(Game).to.exist;
    });

    it('should be a constructor', function(){
	expect(Game).to.be.a('function');
    });

    it('should be an instance of Listener', function(){
	expect(new Game()).to.be.an.instanceof(require('asteroids-listener'));
    });

    describe('object', function(){
	var options = {
	    width: 640,
	    height: 480
	};
	var game;

	beforeEach(function(){
	    game = new Game(options);
	});

	['tick', 'state', 'addAsteroid', 'addFighter'].forEach(function(methodName){
	    it('should respond to ' + methodName, function(){
		expect(game).to.respondTo(methodName);
	    });
	});

	describe('#state', function(){
	    var state;

	    beforeEach(function(){
		state = game.state();
	    });

	    ['fighters', 'asteroids'].forEach(function(key){
		it('should have a key ' + key, function(){
		    expect(state).to.contain.keys(key);
		});
	    });
	})
    });

    describe('interactions', function(){
	var options = {
	    width: 640,
	    height: 480,
	    asteroidInitializer: function(asteroid){
		asteroid.position({ x: 0, y: 0});
		asteroid.velocity({ speed: 1, heading: 0});
	    }
	};
	var game;

	beforeEach(function(){
	    game = new Game(options);
	});

	describe('#addAsteroid', function(){
	    it('should add asteroids', function(){
		var asteroid = game.addAsteroid();

		expect(asteroid).to.exist;
	    });

	    it('should change state when adding asteroid', function(){
		var asteroid = game.addAsteroid();

		var state = game.state();

		expect(state.asteroids.length).to.equal(1);
	    });
	});

	describe('#addFighter', function(){
	    it('should change state when adding asteroid', function(){
		var asteroid = game.addAsteroid();
		game.addFighter(asteroid);

		var state = game.state();

		expect(state.fighters.length).to.equal(1);
	    });
	});

	describe('#tick', function(){
	    it('should update the asteroids', function(done){
		var asteroid = game.addAsteroid();
		asteroid.addListener('position', done);

		game.tick();
	    });

	    it('should update the fighters', function(done){
		var asteroid = game.addAsteroid();
		game.addFighter(asteroid);
		var count = 0;
		asteroid.addListener('position', function(){
		    count++;
		    if (count >= 2) {
			done();
		    }
		});

		game.tick();
	    });
	});
    });
});
