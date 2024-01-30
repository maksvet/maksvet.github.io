const rhinoContext = {
  publicPath: "contexts/game_ru_wasm_v3_0_0.rhn",
  customWritePath: "game_ru_wasm_v3_0_0.rhn",
};

(function () {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = rhinoContext;
})();