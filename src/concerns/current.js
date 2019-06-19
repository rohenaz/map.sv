goog.module('concerns.current')

let instance = null

class Current {
  constructor() {
    if (!instance) {
      instance = this

    this.walletInitialized = false
    }

    return instance
  }


}

exports = Current