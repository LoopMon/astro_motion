class Star {
  x = Math.floor(Math.random() * window.innerWidth)
  y = Math.floor(Math.random() * window.innerHeight)
  scale = Math.floor(Math.random() * 2) + 2
  color = "#f5f5f5"
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

class Ufo {
  x = 0
  y = 0
  // Redução de 30x da imagem original
  width = 53 
  height = 36
  speed = 2

  constructor(img, cnv) {
    this.img = img
    this.cnv = cnv
    this.active = false
  }

  spawn = () => {
    this.x = -this.width
    this.y = Math.random() * (this.cnv.height - this.height)
    this.active = true
  }

  draw(ctx) {
    if (!this.active) return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  move = () => {
    if (!this.active) return

    this.x += this.speed

    if (this.x > this.cnv.width) {
      this.active = false
    }
  }
}


class Scene {
  cnv = document.querySelector("#cnv")
  ctx = this.cnv.getContext("2d")
  x = 0
  y = 0
  width = window.innerWidth
  height = window.innerHeight
  color = "#0a0a0a"
  stars = []

  ufoImage = null
  ufos = []
  nextUfoTime = 0
  minUfoInterval = 8000
  maxUfoInterval = 20000

  constructor() {
    this.cnv.width = this.width
    this.cnv.height = this.height
  }

  start = (numStars, img) => {
    this.ufoImage = img
    this.createStars(numStars)
    this.scheduleNextUfo()
    this.run()
  }

  createStars = (numStars) => {
    for (let i = 0; i < numStars; i++) {
      this.stars.push(new Star())
    }
  }

  run = () => {
    this.clear()
    this.draw()
    this.update()
    window.requestAnimationFrame(this.run)
  }

  draw = () => {
    this.stars.forEach((star) => {
      star.draw(this.ctx)
    })

    this.ufos.forEach((ufo) => {
      ufo.draw(this.ctx)
    })
  }

  update = () => {
    this.stars.forEach((star) => {
      star.move()
    })

    this.stars.forEach((star) => {
      star.checkCollisionOut(this.cnv)
    })

    this.updateUfos()
  }

  clear = () => {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  addStar = (star) => {
    this.stars.push(star)
  }

  scheduleNextUfo = () => {
    const interval =
      Math.random() *
        (this.maxUfoInterval - this.minUfoInterval) +
      this.minUfoInterval

    this.nextUfoTime = performance.now() + interval
  }

  updateUfos = () => {
    const now = performance.now()

    const activeUfo = this.ufos.find((ufo) => ufo.active)

    if (!activeUfo && now >= this.nextUfoTime) {
      const ufo = new Ufo(this.ufoImage, this.cnv)

      ufo.spawn()
      this.ufos.push(ufo)

      this.scheduleNextUfo()
    }

    this.ufos.forEach((ufo) => {
      ufo.move()
    })

    // Remove UFOs que já terminaram a travessia.
    this.ufos = this.ufos.filter((ufo) => ufo.active)
  }
}

const scene = new Scene()
const img = new Image()

img.src = "./img/ufo.png"

img.onload = () => {
  scene.start(400, img)
}
