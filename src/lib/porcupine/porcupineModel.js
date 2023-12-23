const porcupineModel = {
  publicPath: "models/porcupine_params_es.pv",  
  customWritePath: "3.0.0_porcupine_params_es.pv",
};

(function () {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = porcupineModel;
})();