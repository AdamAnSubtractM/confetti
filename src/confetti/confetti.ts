// confetti.ts

/**
 * The default canvas styling. Import this to extend the canvas styles or override it all together.
 */
export const defaultCanvasStyles = {
  position: 'absolute',
  zIndex: -1,
  inset: 0,
  pointerEvents: 'none',
}

/**
 * The confetti particle config
 */
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
 * @param config - The required configuration to create a confetti particle.
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

/**
 * The confetti particles settings.
 */
type ConfettiParticlesSettings = Omit<ConfettiParticleConfig, 'color' | 'size' | 'velocity' | 'x' | 'y'> & {
  count: number
}

/**
 *
 * @param settings The confetti particles settings
 * @returns The an Array of confetti particle instances.
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

/**
 * The animate confetti particles settings.
 */
type AnimateConfettiParticlesSettings = Omit<ConfettiParticleConfig, 'color' | 'size' | 'velocity' | 'x' | 'y'> & {
  particles: ReturnType<typeof createConfettiParticle>[]
}

/**
 * Animates the confetti particles on the canvas.
 * @param settings The animation settings for the confetti.
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
 * Deletes the canvas that was used to generate the confetti.
 * @param canvas The canvas that has the confetti.
 */
const deleteCanvas = function (canvas: HTMLCanvasElement) {
  canvas.remove()
}

/**
 * The canvas options that can be passed to the setupCanvas function.
 */
type CanvasOptions = Omit<ThrowConfettiOptions, 'canvasId' | 'customStyles' | 'selectorToAppend'>

/**
 * Sets up the canvas by calling the createConfettiParticles and animateConfettiParticles functions.
 * If the secondsUntilDeletion option is passed, it automatically deletes the Canvas when completing
 * the timeout.
 * @param canvas The HTMLCanvasElement that was created initially by the throwConfetti function.
 * @param options
 */
function setupCanvas(canvas: HTMLCanvasElement, options?: CanvasOptions) {
  const ctx = canvas?.getContext('2d')
  if (!ctx) {
    throw new Error('Unable to get canvas context.')
  }

  const particles = createConfettiParticles({
    canvas,
    ctx,
    count: options?.particleCount || 100,
  })

  animateConfettiParticles({ canvas, ctx, particles })

  if (options?.secondsUntilDeletion && typeof options.secondsUntilDeletion === 'number') {
    setTimeout(() => deleteCanvas(canvas), options.secondsUntilDeletion * 1000)
  }
}

/**
 * The options that can be passed to the throwConfetti function.
 * This allows you to define a custom canvas id, custom styles for the canvas,
 * a custom particle count, the number of seconds until the canvas is deleted
 * from the DOM, and a custom selector to append the canvas to.
 */
type ThrowConfettiOptions = {
  canvasId?: string
  customStyles?: CSSStyleDeclaration
  particleCount?: number
  secondsUntilDeletion?: number
  selectorToAppend?: string
}

/**
 * Generates a canvas that has confetti in it.
 * @param options Optional settings object to configure how the confetti behaves.
 *
 * ```ts
 * import { throwConfetti } from '@adam/confetti'
 * 
 * throwConfetti()
 * ```
 *
 * ```ts
 * import { throwConfetti, defaultCanvasStyles } from '@adam/confetti'
 * 
 * throwConfetti({
    canvasId: 'custom-canvas-id',
    customStyles: {
      ...defaultCanvasStyles,
      width: '500px',
      height: '500px',
    },
    particleCount: 300,
    secondsUntilDeletion: 8,
    selectorToAppend: 'main',
  })
 * ```
 */
export const throwConfetti = function (options?: ThrowConfettiOptions) {
  const canvasId = options?.canvasId || 'confetti-canvas'
  let canvas: HTMLCanvasElement | null = document.querySelector(`#${canvasId}`)

  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = canvasId
    document.querySelector(options?.selectorToAppend || 'body')?.appendChild(canvas)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    Object.assign(canvas.style, options?.customStyles || defaultCanvasStyles)

    setupCanvas(canvas, options)
  } else {
    setupCanvas(canvas, options)
  }
}
