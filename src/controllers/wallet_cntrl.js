goog.module("controllers.wallet")

const CurrentClass = goog.require('concerns.current')
const Current = new CurrentClass()

class WalletCntrl extends Silica.Controllers.Base {
  // Constructor receives the element which specified this controller
  constructor(element) {
    super(element)

    this.address = ''
    this.balance = 0

    if (satchel.isLoggedIn()) {
      this.initSatchel()
    }

    Silica.sub('init-satchel', () => {
      this.initSatchel()
    })
  }

  walletLoaded () {
    // Login check & prompt, otherwise continue
    if (!satchel.isLoggedIn()) {
      let login = prompt('Enter a 12 word mnemonic, or WIF')
      let wif = null
      if (login.split(" ").length === 12) {
        wif = satchel.importMnemonic(login)
      } else {
        wif = satchel.importWif(login)
      }

      if (wif) {
        satchel.login(wif, () => {
          this.onLogin()
        })
      }
      return
    }
    this.onLogin()
  }

  onLogin () {
    satchel.updateBalance(() => {
      Silica.apply(() => {
        // Update the UI with wallet info
        this.address = satchel.getAddressStr()
        this.balance = satchel.getBalance()
        Current.walletInitialized = true
      })
    })
  }

  loggedIn () {
    return satchel && satchel.isLoggedIn()
  }

  initSatchel () {
    /* INIT SATCHEL */
    // make a random address to use as an api key
    // you can just use your own api key here :)
    let privateKey = satchel.bsv.PrivateKey.fromRandom()
    let publicKey = satchel.bsv.PublicKey.fromPrivateKey(privateKey)
    let apiKey = satchel.bsv.Address.fromPublicKey(publicKey)
    satchel.init({
      'planariaApiKey': apiKey,
      'feePerKb': 1000,
      'bitsocketCallback': (data) => { this.socketCallback(data) }
    }, (data) => { this.walletLoaded(data) })
  }

  socketCallback (data) {
    // Here you can react to wallet messages in your UI
    console.log('wallet socket callback', data)
  }

  loginPrompt() {
    console.log('prompt')
  }

}

exports = WalletCntrl