goog.module('concerns.current')

let instance = null

class Current {
  constructor() {
    if (!instance) {
      instance = this

    this.walletInitialized = satchel && satchel.isLoggedIn()
    this.pendingTx = null
    }

    return instance
  }


}

exports = Current