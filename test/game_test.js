var expect = require('chai').expect;

var Game = require('../lib/game');
var Fighter = require('asteroids-fighter');
var Bullet = require('asteroids-bullet');

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

        ['tick', 'state', 'addAsteroid', 'addFighter', 'addBullet'].forEach(function(methodName){
            it('should respond to ' + methodName, function(){
                expect(game).to.respondTo(methodName);
            });
        });

        it('should have default options', function(){
            game = new Game();

            expect(game.options).to.exist;
            expect(game.options.width).to.exist;
            expect(game.options.height).to.exist;
        });

        it('should provide default height', function(){
            game = new Game({ width: 100 });

            expect(game.options).to.exist;
            expect(game.options.height).to.exist;
        });

        it('should provide default width', function(){
            game = new Game({ height: 100 });

            expect(game.options).to.exist;
            expect(game.options.width).to.exist;
        });

        describe('#state', function(){
            var state;

            beforeEach(function(){
                state = game.state();
            });

            ['fighters', 'asteroids', 'bullets'].forEach(function(key){
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
                var fighter = new Fighter();
                game.addFighter(fighter);

                var state = game.state();

                expect(state.fighters.length).to.equal(1);
            });
        });

        describe('#addBullet', function(){
            it('should change state when adding bullet', function(){
                var bullet = new Bullet();
                game.addBullet(bullet);

                var state = game.state();

                expect(state.bullets.length).to.equal(1);
            });
        });

        describe('#tick', function(){
            it('should update the asteroids', function(done){
                var asteroid = game.addAsteroid();
                asteroid.addListener('position', done);

                game.tick();
            });

            it('should update the fighters', function(done){
                var fighter = new Fighter(function(fighter){
                    fighter.speed(1);
                });
                game.addFighter(fighter);
                fighter.addListener('position', done);

                game.tick();
            });

            it('should update the bullets', function(done){
                var bullet = new Bullet(function(bullet){
                    bullet.speed(1);
                });
                game.addBullet(bullet);
                bullet.addListener('position', done);

                game.tick();
            });


            it('should remove bullets when time to live is 0', function(){
                var bullet = new Bullet(function(bullet){
                    bullet.ttl(1);
                });
                game.addBullet(bullet);

                game.tick();

                expect(game.state().bullets.length).to.equal(0);
            });
        });

        describe('#normalisation', function(){
            describe('should normalize asteroids', function(){
                var options;

                beforeEach(function(){
                    options = {
                        width: 10,
                        height: 5
                    }
                })
                it('for to large values in x direction', function(){
                    options.asteroidInitializer = function(asteroid){
                        asteroid.position({ x: 10, y: 0 });
                        asteroid.velocity({ speed: 1, heading: 0 });
                    };
                    game = new Game(options);
                    var asteroid = game.addAsteroid();

                    game.tick();

                    expect(asteroid.x()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    options.asteroidInitializer = function(asteroid){
                        asteroid.position({ x: 0, y: 0 });
                        asteroid.velocity({ speed: 1, heading: Math.PI });
                    };
                    game = new Game(options);
                    var asteroid = game.addAsteroid();

                    game.tick();

                    expect(asteroid.x()).to.equal(9);
                });

                it('for to large values in y direction', function(){
                    options.asteroidInitializer = function(asteroid){
                        asteroid.position({ x: 0, y: 5 });
                        asteroid.velocity({ speed: 1, heading: Math.PI/2 });
                    };
                    game = new Game(options);
                    var asteroid = game.addAsteroid();

                    game.tick();

                    expect(asteroid.y()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    options.asteroidInitializer = function(asteroid){
                        asteroid.position({ x: 0, y: 0 });
                        asteroid.velocity({ speed: 1, heading: -Math.PI/2 });
                    };
                    game = new Game(options);
                    var asteroid = game.addAsteroid();

                    game.tick();

                    expect(asteroid.y()).to.equal(4);
                });
            });

            describe('should normalize fighters', function(){
                var options;

                beforeEach(function(){
                    options = {
                        width: 10,
                        height: 5
                    }
                })
                it('for to large values in x direction', function(){
                    game = new Game(options);
                    var fighter = new Fighter(function(fighter){
                        fighter.position({ x: 10, y: 0 });
                        fighter.velocity({ speed: 1, heading: 0 });
                    });
                    game.addFighter(fighter);

                    game.tick();

                    expect(fighter.x()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    game = new Game(options);
                    var fighter = new Fighter(function(fighter){
                        fighter.position({ x: 0, y: 0 });
                        fighter.velocity({ speed: 1, heading: Math.PI });
                    });
                    game.addFighter(fighter);

                    game.tick();

                    expect(fighter.x()).to.equal(9);
                });

                it('for to large values in y direction', function(){
                    game = new Game(options);
                    var fighter = new Fighter(function(fighter){
                        fighter.position({ x: 0, y: 5 });
                        fighter.velocity({ speed: 1, heading: Math.PI/2 });
                    });
                    game.addFighter(fighter);

                    game.tick();

                    expect(fighter.y()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    game = new Game(options);
                    var fighter = new Fighter(function(fighter){
                        fighter.position({ x: 0, y: 0 });
                        fighter.velocity({ speed: 1, heading: -Math.PI/2 });
                    });
                    game.addFighter(fighter);

                    game.tick();

                    expect(fighter.y()).to.equal(4);
                });
            });

            describe('should normalize bullets', function(){
                var options;

                beforeEach(function(){
                    options = {
                        width: 10,
                        height: 5
                    }
                })

                it('for to large values in x direction', function(){
                    game = new Game(options);
                    var bullet = new Bullet(function(bullet){
                        bullet.position({ x: 10, y: 0 });
                        bullet.velocity({ speed: 1, heading: 0 });
                    });
                    game.addBullet(bullet);

                    game.tick();

                    expect(bullet.x()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    game = new Game(options);
                    var bullet = new Bullet(function(bullet){
                        bullet.position({ x: 0, y: 0 });
                        bullet.velocity({ speed: 1, heading: Math.PI });
                    });
                    game.addBullet(bullet);

                    game.tick();

                    expect(bullet.x()).to.equal(9);
                });

                it('for to large values in y direction', function(){
                    game = new Game(options);
                    var bullet = new Bullet(function(bullet){
                        bullet.position({ x: 0, y: 5 });
                        bullet.velocity({ speed: 1, heading: Math.PI/2 });
                    });
                    game.addBullet(bullet);

                    game.tick();

                    expect(bullet.y()).to.equal(1);
                });

                it('for to negative values in x direction', function(){
                    game = new Game(options);
                    var bullet = new Bullet(function(bullet){
                        bullet.position({ x: 0, y: 0 });
                        bullet.velocity({ speed: 1, heading: -Math.PI/2 });
                    });
                    game.addBullet(bullet);

                    game.tick();

                    expect(bullet.y()).to.equal(4);
                });
            });
        });

		describe('#collisionDetection', function(){
			it('should detect collision between bullets and asteroids', function(){
                options.asteroidInitializer = function(asteroid){
                    asteroid.position({ x: 0, y: 0 });
                    asteroid.velocity({ speed: 0, heading: 0 });
					asteroid.radius(10);
                };
				game = new Game(options);
				game.addAsteroid();
				var bullet = new Bullet(function(bullet){
					bullet.position({ x: 12, y: 0 });
					bullet.radius(2);
				});
				game.addBullet(bullet);

				game.tick();

				expect(game.state().asteroids.length).to.equal(0);
				expect(game.state().bullets.length).to.equal(0);
			});

			it('should detect collision between asteroids', function(){
				var count = 0;
                options.asteroidInitializer = function(asteroid){
                    asteroid.position({ x: 20 * (count++), y: 0 });
                    asteroid.velocity({ speed: 0, heading: 0 });
					asteroid.radius(10);
                };
				game = new Game(options);
				game.addAsteroid();
				game.addAsteroid();

				game.tick();

				expect(game.state().asteroids.length).to.equal(0);
			});
		});
    });

    describe('fighter firing', function(){
        var options = {
            width: 640,
            height: 480,
            bullet: {
                radius : 1,
                speed: 10,
				ttl: 60
            }
        };
        var game;

        beforeEach(function(){
            game = new Game(options);
        });

        it('should add a bullet', function(){
            var fighter = new Fighter();
            game.addFighter(fighter);

            fighter.fire();

            var state = game.state();
            expect(state.bullets.length).to.equal(1);
        });

        describe('bullet', function(){
            it('should have position on bounding circle', function(){
                var fighter = new Fighter(function(fighter){
                    fighter.position({ x: 0, y: 0 });
                    fighter.radius(10);
                    fighter.orientation(Math.PI/12);
                    fighter.velocity({ speed: 1, heading: 0 });
                });
                game.addFighter(fighter);

                fighter.fire();

                var state = game.state();
                expect(state.bullets[0].x).to.equal((fighter.radius() + options.bullet.radius) * Math.cos(fighter.orientation()));
                expect(state.bullets[0].y).to.equal((fighter.radius() + options.bullet.radius) * Math.sin(fighter.orientation()));
                expect(state.bullets[0].orientation).to.equal(fighter.orientation());
                expect(state.bullets[0].heading).to.equal(fighter.orientation());
                expect(state.bullets[0].speed).to.equal(options.bullet.speed);
            });
        });
    })
});
