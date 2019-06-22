goog.module('concerns.current')

let instance = null

class Current {
  constructor() {
    if (!instance) {
      instance = this

    this.walletInitialized = satchel && satchel.isLoggedIn()
    this.pendingTx = null
    this.balance = 0
    this.address = this.walletInitialized ? satchel.getAddressStr() : ''

    }

    return instance
  }
}

exports = Current