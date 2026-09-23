"use strict";
self["webpackHotUpdateminimal_webpack_dev_server_babel_setup"]("goodbye",{

/***/ "./src/goodbye.js":
/*!************************!*\
  !*** ./src/goodbye.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./src/index.css");


const deleteCheckbox = document.getElementById('delete-checkbox');
const deleteButton = document.getElementById('delete-button');

deleteCheckbox.addEventListener('change', () => {
  deleteButton.disabled = !deleteCheckbox.checked;
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("12db7f516f99f87e144b")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=goodbye.6332d5d86e7077eded47.hot-update.js.map