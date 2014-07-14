var phys = new Physics(renderer)

phys.on('position', function() {})
phys.on('stop', function() {})

//normal spring
phys.spring({ tension: 50, springyness: 10 })
  .from(x, y).to(x, y)
  .start()

//normal spring
  var spring = phys.spring({ tension: 50, springyness: 10 })

  //sets a new attachment point for the spring, resumes the simulation 
  //if it has stopped
phys.to(x, y)

phys.interact()

//updating the position without resuming will cause the,
//
phys.position()
phys.resume()

phys.stop() //stops all simulation, rejects all outstanding promises
phys.start() //starts all simulations

//get or set the simulations position, alias of from

// get or set the simulations destination, destination is 
// the springs attachement point, or it's where the object is moving towards

//simulate deceleration
var decel = phys.decelerate(x, y, opts)

//linear damping
phys.linear(x, y, opts)
  .to(x, y)

phys.accelerate(x, y, { accelerationX, acceleration, accelerationY })
  .to(height)
