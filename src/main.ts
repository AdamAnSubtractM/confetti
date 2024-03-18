import './style.css'
import { throwConfetti } from './confetti/confetti.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Throw Confetti</h1>
    <div class="card">
      <button id="throwConfetti" type="button">Throw Confetti</button>
    </div>
  </div>
`

const init = function () {
  const confettiButton = document.querySelector(`#throwConfetti`)
  confettiButton?.addEventListener('click', function () {
    throwConfetti({ secondsUntilDeletion: 6 })
  })
}

init()
