class Star {
  x = Math.floor(Math.random() * window.innerWidth)
  y = Math.floor(Math.random() * window.innerHeight)
  scale = Math.floor(Math.random() * 2) + 2
  color = "#fff"
  speed = Math.floor(Math.random() * 5) + 1

  draw = (ctx) => {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.scale, this.scale)
  }

  move = () => {
    this.x += this.speed
  }

  checkCollisionOut = (cnv) => {
    if (this.x + this.scale > cnv.width) {
      this.x = 0 - this.scale
      this.y = Math.floor(Math.random() * window.innerHeight)
      this.speed = Math.floor(Math.random() * 5) + 1
    }
  }
}

class Scene {
  x = 0
  y = 0
  width = window.innerWidth
  height = window.innerHeight
  color = "#000"
  objects = []
  cnv = document.querySelector("#cnv")
  ctx = this.cnv.getContext("2d")

  constructor() {
    this.cnv.width = this.width
    this.cnv.height = this.height
  }

  init = (numStars) => {
    for (let i = 0; i < numStars; i++) {
      this.objects.push(new Star())
    }
  }

  run = () => {
    this.clear()
    this.draw()
    this.update()
    window.requestAnimationFrame(this.run)
  }

  draw = () => {
    this.objects.forEach((star) => {
      star.draw(this.ctx)
    })
  }

  update = () => {
    this.objects.forEach((star) => {
      star.move()
    })
    this.objects.forEach((star) => {
      star.checkCollisionOut(this.cnv)
    })
  }

  clear = () => {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  addStar = (star) => {
    this.objects.push(star)
  }
}

const scene = new Scene()

scene.init(400)
scene.run()
