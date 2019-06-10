
goog.module("controllers.creator")

class CreatorCntrl extends Silica.Controllers.Base {

  constructor(element) {
    super(element)
    this.name = 'mapsv'
    this.version = '1.0.0'
    this.keys = [{
      key: '',
      value: ''
    }]
  }

  addKey () {
    console.log('adding key')
    this.keys.push({
      key: '',
      value: ''
    })
  }
}

exports = CreatorCntrl
