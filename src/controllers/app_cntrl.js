
goog.module("controllers.app");
// mapsv
// AppCntrl is the root controller of mapsv
//
class AppCntrl extends Silica.Controllers.Base {
  // Constructor receives the element which specified this controller
  constructor(element) {
    super(element)
    this.name = "mapsv";
    this.version = "1.0.0";
  }
}

exports = AppCntrl;
