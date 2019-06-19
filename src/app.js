goog.module("mapsv")

const AppCntrl = goog.require("controllers.app")
const CreatorCntrl = goog.require("controllers.creator")
const WalletCntrl = goog.require("controllers.wallet")

window['Mapsv'] = {
  AppCntrl: AppCntrl,
  CreatorCntrl: CreatorCntrl,
  WalletCntrl: WalletCntrl
}

Silica.setContext('Mapsv')
Silica.compile(document)
Silica.apply(() => {

})

window.addEventListener('DOMContentLoaded', () => {
  
  // al pre tags on the page
  const pres = document.getElementsByClassName('copyme')
  //
  // reformat html of pre tags
  let len = pres.length
  if (len > 0) {
    for (let i = 0; i < len; i++) {
      console.log('inject copy?', isPrismClass(pres[i]), i, pres[i])
      // check if its a pre tag with a prism class
      if (isPrismClass(pres[i])) {

        // insert code and copy element
        pres[i].innerHTML = `<div class="copy">copy</div><code>${pres[i].innerHTML}</code>`      
      }
    }
  }

  //
  // create clipboard for every copy element
  const clipboard = new ClipboardJS('.copy', {
    target: (trigger) => {
      return trigger.nextElementSibling
    }
  })

  //
  // do stuff when copy is clicked
  clipboard.on('success', (event) => {
    event.trigger.textContent = 'copied!'
    setTimeout(() => {
      event.clearSelection()
      event.trigger.textContent = 'copy'
    }, 2000)
  })

  //
  // helper function
  function isPrismClass(preTag) { 
    return Array.from(preTag.classList).some((className) => {
      return className.substring(0, 8) === 'language'
    })
  }

  Silica.apply(() => {
    Prism.highlightAll(false)
  })

})
