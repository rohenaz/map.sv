
goog.module("mapsv");

const AppCntrl = goog.require("controllers.app")
const CreatorCntrl = goog.require("controllers.creator")

window["Mapsv"] = {
  AppCntrl: AppCntrl,
  CreatorCntrl: CreatorCntrl
}

Silica.setContext("Mapsv");
Silica.compile(document);
Silica.apply(() => {});
