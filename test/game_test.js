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

	['tick', 'state'].forEach(function(methodName){
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
});
