# confetti

A package that allows you to throw confetti on the page.

## Throwing confetti on the page

You can throw confetting on the page by writing the following:

```ts
import { throwConfetti } from '@adam/confetti'

const button = document.querySelector('#confetti-button')

button.addEventListenter('click', throwConfetti)
```

## Passing optional options

The throwConfetti function can also take an optional options object to control the behavior of the confetti and canvas.

- canvasId?: string
  - Queries for a custom canvasId if passed. If not found, it uses this id to generate a canvas.
- customStyles?: CSSStyleDeclaration
  - Allows an object of custom styles to be applied to the canvas.
- particleCount?: number
  - Allows for a custom number of particles to be generated on the canvas.
- secondsUntilDeletion?: number
  - Allows for the canvas to be auto deleted after the number of seconds defined here has passed.
- selectorToAppend?: string
  - Allows a custom selector to be defined for where the canvas is appended.

```ts
import { throwConfetti } from '@adam/confetti'

const button = document.querySelector('#confetti-button')

button.addEventListenter('click', () => {
  throwConfetti({
    canvasId: 'custom-canvas-id',
    customStyles: { width: '500px', height: '500px' },
    particleCount: 300,
    secondsUntilDeletion: 8,
    selectorToAppend: 'main',
  })
})
```
