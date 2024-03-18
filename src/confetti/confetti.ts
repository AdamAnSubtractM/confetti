// confetti.ts
export const defaultCanvasStyles = {
  position: 'absolute',
  zIndex: -1,
  inset: 0,
  pointerEvents: 'none',
}

type ConfettiParticleConfig = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  color: string
  size: number
  velocity: { x: number; y: number }
  x: number
  y: number
}

/**
 * Creates a confetti particle
 * @param config
 * @returns A confetti particle
 */
const createConfettiParticle = function ({ canvas, ctx, color, size, velocity, x, y }: ConfettiParticleConfig) {
  return {
    x,
    y,
    color,
    size,
    velocity,
    update() {
      this.x += this.velocity.x
      this.y += this.velocity.y
      this.velocity.y += 0.1
      if (this.y > canvas.height) {
        this.y = 0
        this.x = Math.random() * canvas.width
        this.velocity.y = Math.random() * 2
      }
    },
    draw() {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.size, this.size)
    },
  }
}

type ConfettiParticlesSettings = Omit<ConfettiParticleConfig, 'color' | 'size' | 'velocity' | 'x' | 'y'> & {
  count: number
}

/**
 *
 * @param settings The confetti particles settings
 * @returns The confetti particles config
 */
const createConfettiParticles = function ({ canvas, ctx, count }: ConfettiParticlesSettings) {
  const particles = []
  for (let i = 0; i < count; i++) {
    const particleSettings = {
      canvas,
      ctx,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 5,
      velocity: { x: (Math.random() - 0.5) * 2, y: Math.random() * 2 },
    }
    particles.push(createConfettiParticle(particleSettings))
  }
  return particles
}

type AnimateConfettiParticlesSettings = Omit<ConfettiParticleConfig, 'color' | 'size' | 'velocity' | 'x' | 'y'> & {
  particles: ReturnType<typeof createConfettiParticle>[]
}

/**
 * Animates the confetti particles on the canvas
 * @param settings The animation settings for the confetti
 */
const animateConfettiParticles = function ({ canvas, ctx, particles }: AnimateConfettiParticlesSettings) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  particles.forEach((particle) => {
    particle.update()
    particle.draw()
  })
  requestAnimationFrame(() => animateConfettiParticles({ canvas, ctx, particles }))
}

/**
 * Deletes the canvas that was used to generate the confetti
 * @param canvas The canvas that has the confetti
 */
const deleteCanvas = function (canvas: HTMLCanvasElement) {
  canvas.remove()
}

type ThrowConfettiSettings = {
  canvasId?: string
  customStyles?: CSSStyleDeclaration
  particleCount?: number
  secondsUntilDeletion?: number
  selectorToAppend?: string
}

/**
 * Generates a canvas that has confetti in it
 * @param settings Optional settings object to configure how the confetti behaves
 */
export const throwConfetti = function (settings?: ThrowConfettiSettings) {
  const canvasId = settings?.canvasId || 'confetti-canvas'
  let canvas: HTMLCanvasElement | null = document.querySelector(`#${canvasId}`)
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = canvasId
    document.querySelector(settings?.selectorToAppend || 'body')?.appendChild(canvas)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    Object.assign(canvas.style, settings?.customStyles || defaultCanvasStyles)
  }
  const ctx = canvas.getContext('2d')

  if (canvas && ctx) {
    const particles = createConfettiParticles({
      canvas,
      ctx,
      count: settings?.particleCount || 100,
    })
    animateConfettiParticles({ canvas, ctx, particles })
    if (settings?.secondsUntilDeletion && typeof settings.secondsUntilDeletion === 'number') {
      setTimeout(() => deleteCanvas(canvas), settings.secondsUntilDeletion * 1000)
    }
  } else {
    throw new Error(`Unable to throw confetti. The canvas ctx was not found.`)
  }
}
