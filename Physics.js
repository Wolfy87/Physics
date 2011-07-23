/**
 * @preserve Physics MooTools plugin v1.0.0
 * 
 * Oliver Caldwell 2011 (olivercaldwell.co.uk)
 */
var Physics = {
	World: new Class({
		Implements: [Events, Options],
		options: {
			fps: 12,
			width: 500,
			height: 500
		},
		particles: [],
		positions: [],
		interval: false,
		initialize: function(options) {
			// Initialise variables
			var x = null,
				y = null;
			
			// Set the options
			this.setOptions(options);
			
			for(x = 0; x < options.width; x += 1) {
				for(y = 0; y < options.height; y += 1) {
					this.positions[x] = [];
					this.positions[x][y] = false;
				}
			}
			
			// Start the loop
			this.start();
		},
		start: function() {
			if(this.interval === false) {
				this.interval = setInterval(this.step, 1000 / this.options.fps);
				
				// Fire the start event
				this.fireEvent('start');
			}
			else {
				// Fire the alreadyRunning event
				this.fireEvent('alreadyRunning');
			}
		},
		stop: function() {
			clearInterval(this.interval);
			this.interval = false;
			
			// Fire the stop event
			this.fireEvent('stop');
		},
		step: function() {
			// Loop over the particles
			this.particles.each(function(particle) {
				// Initialise variables
				var movement = null,
					check = {};
				
				// Apply weight to velocity on the y axis
				particle.options.velocity.y += particle.options.weight;
				
				// Work out from and to
				movement = {
					from: {
						x: particle.options.position.x,
						y: particle.options.position.y
					},
					to: {
						x: Math.floor(particle.options.position.x + particle.options.velocity.x),
						y: Math.floor(particle.options.position.y + particle.options.velocity.y)
					}
				};
				
				// Set up current
				movement.current = movement.from;
				
				// Work out the difference
				movement.difference = {
					x: movement.to.x - movement.from.x,
					y: movement.to.y - movement.from.y
				};
				
				// Work out which axis is larger and vice versa
				if(movement.difference.x >= movement.difference.y) {
					// X is larger or the same
					movement.larger = 'x';
					movement.smaller = 'y';
				}
				else {
					// Y is larger
					movement.larger = 'y';
					movement.smaller = 'x';
				}
				
				// Work out step
				movement.step = {
					smaller: movement.difference[movement.smaller] / movement.difference[movement.larger]
				};
				
				if(movement.from[movement.larger] > movement.to[movement.larger]) {
					movement.step.larger = -1;
				}
				else {
					movement.step.larger = 1;
				}
				
				// Keep looping til the larger matches
				while(movement.current[movement.larger] !== movement.to[movement.larger]) {
					// Set up check
					check[movement.larger] = movement.current[movement.larger] + movement.step.larger;
					check[movement.smaller] = Math.floor(movement.current[movement.smaller] + movement.step.smaller);
					
					// Check if there is anything at this position
					if(this.particles[check.x]) {
						if(this.particles[check.x][check.y]) {
							// There is, so set the position to the current
							// And fire a collision with the two particles
							particle.options.position = movement.current;
							this.fireEvent('collision', particle, this.particles[check.x][check.y]);
						}
					}
				}
			}.bind(this));
		},
		addParticle: function(particle) {
			// Add the particle to the particles array
			this.particles.push(particle);
			
			// Add it into the positions index
			this.positions[particle.options.position.x][particle.options.position.y] = particle;
			
			// Fire the addParticle event
			this.fireEvent('addParticle');
		},
		removeParticle: function(paticle) {
			// Get the index of the paticle in the particles array
			var index = this.particles.indexOf(particle);
			
			// If it is not -1 then splice it out
			if(index !== -1) {
				this.particles.splice(index, 1);
				
				// Fire the removeParticle event
				this.fireEvent('addParticle');
			}
			else {
				// Fire the noParticle event
				this.fireEvent('noParticle');
			}
		}
	}),
	Particle: new Class({
		Implements: [Options],
		options: {
			position: {
				x: 0,
				y: 0
			},
			velocity: {
				x: 0,
				y: 0
			},
			weight: 4
		},
		initialize: function(options) {
			// Set the options
			this.setOptions(options);
		}
	})
};