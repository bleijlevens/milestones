"use strict";
self["webpackHotUpdateminimal_webpack_dev_server_babel_setup"]("instructionsB",{

/***/ "./src/instructionsB.js":
/*!******************************!*\
  !*** ./src/instructionsB.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./src/index.css");


const button = document.getElementById('button-center-item');

const subjID =
  new URL(document.location.href).searchParams.get('ID') || 'testID';
const childGender =
  new URL(document.location.href).searchParams.get('g') || 'na';

// define what happens on button click
const handleContinueClick = (event) => {
  event.preventDefault();

  window.location.href = `./task.html?ID=${subjID}&g=${childGender}`;
};

button.addEventListener('click', handleContinueClick, { capture: false });


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("6c18fa515d5f7be63cfb")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=instructionsB.98b7e02f6dc0c6aed559.hot-update.js.map