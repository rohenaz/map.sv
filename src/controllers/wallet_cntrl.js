goog.module("controllers.wallet")

const CurrentClass = goog.require('concerns.current')
const Current = new CurrentClass()

const DUST_LIMIT = 546

class WalletCntrl extends Silica.Controllers.Base {
  // Constructor receives the element which specified this controller
  constructor(element) {
    super(element)

    if (satchel.isLoggedIn()) {
      this.initSatchel()
    }

    this.initSub = Silica.sub('init-satchel', () => {
      this.initSatchel()
    })

    this.makeBmapTxSub = Silica.sub('make-bmap-tx', () => {
      this.makeBmapTx()
    })
  }

  showFundWallet () {
    return Current.walletInitialized && Current.balance < DUST_LIMIT
  }
  
  qrCodeSvg () {
    if (!satchel.isLoggedIn()) { return null }
    return satchel.generateQrCode(satchel.getAddressStr()).createSvgTag(8,2)
  }

  broadcastTx () {
    if (!Current.pendingTx) {
      console.warn('No pending tx to broadcast.')
      return 
    }

    // Uncomment this when you're ready to broadcast
    satchel.broadcastTx(Current.pendingTx, (resTx) => {
      Silica.pub('tx-broadcasted', resTx)
      setTimeout(() => {
        satchel.updateUtxos(satchel.updateBalance(() => {
          Silica.apply(() => {
            console.log('updated utxos and balance')
            Current.balance = satchel.getBalance() + satchel.getUnconfirmedBalance()
          }, this.el)
        }))
      }, 2000)
    }, (err) => {
      console.log('on error', err)
    }, {
      testing: false
    })
  }

  walletLoaded (login=null) {
    // Login check & prompt, otherwise continue
    if (!satchel.isLoggedIn()) {
      if (!login || !login.length) {
        login = prompt('Enter a 12 word mnemonic, or WIF')
      }
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
    Silica.apply(() => {
      // Update the UI with wallet info
      Current.address = satchel.getAddressStr()
      Current.balance = satchel.getBalance() + satchel.getUnconfirmedBalance()
      console.log('got balance', Current.balance, Current.address)
      Current.walletInitialized = true
    }, this.el)
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
    satchel.updateBalance(satchel.updateUtxos(() => {
      Silica.apply(() => {
        Current.balance = satchel.getBalance() + satchel.getUnconfirmedBalance()
      }, this.el)
    }))
  }

  loginPrompt() {
    console.log('prompt')
  }

  signup () {
    console.log('using bip39 to generate seed...')
    if (!Current.mnemonic) {
      let newAddress = satchel.generateAddress()
      let wif = satchel.importMnemonic(newAddress.mnemonic().phrase)
      console.log('signing in', wif)
      satchel.login(wif, () => {
        console.log('we\'re in the callback')
        this.onLogin()
      })
    }
  }

  makeBmapTx () {    
    if (!Current.walletInitialized) {
      this.initSatchel()
      return
    }

    if (Current.pendingTx) {
      let broadcast = confirm('Broadcast this transaction?')
      if (broadcast) {
        console.log('broadcasting...')
        this.broadcastTx()
      }
      return
    }

    // set the data 
    let data = Current.data
    
    let tx = new satchel.bsv.Transaction()
    tx.from(satchel.getUtxos())
    tx = satchel.addOpReturnData(tx, data)
    tx.feePerKb(satchel.feePerKb)
    tx.change(satchel.getAddress())
    tx = satchel.cleanTxDust(tx)
    tx = tx.sign(satchel.getPrivateKey())

    Current.pendingTx = tx
    Silica.defer(() => {
      Mapsv.loadPrism()
    })
    console.log('tx!', tx)
  }

  onDestroy () {
    Silica.unsub(this.makeBmapTxSub)
    Silica.ubsub(this.initSub)
  }
}

exports = WalletCntrl