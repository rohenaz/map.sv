
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
  document.addEventListener('DOMContentLoaded', () => {
    Prism.highlightAll(false)
  })
})
