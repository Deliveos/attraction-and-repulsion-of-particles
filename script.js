(()=> {
  const properties = {
    particlesMinRadius: 5,
    particlesMaxRadius: 20,
    particlesMassFactor: 0.002,
    particlesDefaultColor: "rgba(250, 10, 30, 0.9)",
    smooth: 0.75,
    repulsionRadius: 400,
    cursorRadius: 45,
    mouseSize: 160  
  }

  
  //get canvas and canvas context
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  document.querySelector("body").appendChild(canvas)

  const TWO_PI = Math.PI*2
  let w, h, mouse;
  let particles = []

  class Particle {
    constructor(radius) {
      this.position = {x: mouse.x, y: mouse.y}
      this.velosity = {x: 0, y: 0}
      this.radius = radius || random(properties.particlesMinRadius, properties.particlesMaxRadius)
      this.mass = this.radius * properties.particlesMassFactor
      this.color = properties.particlesDefaultColor
    }

    draw(x, y) {
      this.position.x = x || this.position.x + this.velosity.x
      this.position.y = y || this.position.y + this.velosity.y
      if (x && y) {
        createCircle(this.position.x, this.position.y, this.radius, true, "#00000000")
      createCircle(this.position.x, this.position.y, this.radius, false, "#00000000")
      } else {
        createCircle(this.position.x, this.position.y, this.radius, true, this.color)
      createCircle(this.position.x, this.position.y, this.radius, false, properties.particlesDefaultColor)
      }
    }
  }

  function updateParticles() {
    for(let i = 1; i < particles.length; i++) {
      let acc = {x: 0, y: 0}

      for(let j = 0; j < particles.length; j++) {
        if(i === j) continue;
          let [a, b] = [particles[i], particles[j]]

          let delta = {
            x: b.position.x - a.position.x,
            y: b.position.y - a.position.y
          }
          let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1
          let force = (distance - properties.repulsionRadius) / distance * b.mass

        if (j == 0) {
          let alpha = properties.mouseSize / distance;
          a.color   = `rgba(250, 10, 30, ${alpha})`;

          distance < properties.mouseSize ? force = (distance - properties.mouseSize) * b.mass : force = a.mass;
        }
        acc.x += delta.x * force
        acc.y += delta.y * force
      }
      particles[i].velosity.x = particles[i].velosity.x * properties.smooth + acc.x * particles[i].mass
      particles[i].velosity.y = particles[i].velosity.y * properties.smooth + acc.y * particles[i].mass
    }
    particles.map(el => el === particles[0] ? el.draw(mouse.x, mouse.y) : el.draw())
  }

  function createCircle(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min
  }

  function init() {
    w = canvas.width = innerWidth
    h = canvas.height = innerHeight
    mouse = {
      x: w / 2,
      y: h / 2,
      keyDown: false
    }
    particles = []
    particles.push(new Particle(properties.cursorRadius))
    particles[0].color = "#00000000"
  }

  function loop() {
    ctx.clearRect(0, 0, w, h)

    if (mouse.keyDown) { 
      particles.push(new Particle())
    }
    updateParticles()
    window.requestAnimationFrame(loop)
  }

  init()
  loop()

  function setMousePosition({clientX, clientY}) {
    [mouse.x, mouse.y] = [clientX, clientY]
  }

  function mouseKeyIsDown() {
    mouse.keyDown = !mouse.keyDown
  }

  canvas.addEventListener("mousemove", setMousePosition)
  window.addEventListener("mousedown", mouseKeyIsDown)
  window.addEventListener("mouseup", mouseKeyIsDown)

  canvas.addEventListener("touchmove", setMousePosition)
  window.addEventListener("touchstart", mouseKeyIsDown)
  window.addEventListener("touchend", mouseKeyIsDown)
})()