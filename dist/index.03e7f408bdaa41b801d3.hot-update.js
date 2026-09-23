"use strict";
self["webpackHotUpdateminimal_webpack_dev_server_babel_setup"]("index",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./src/index.css");


const participantID =
  new URL(document.location.href).searchParams.get('ID');
const button = document.getElementById('button-center-item');
const childNameInput = document.getElementById('child-name-input');
const childNameNA = document.getElementById('child-name-na');

// Check child name and gender whenever something is entered
const handleInput = () => {

  const childGender =
    document.querySelector('input[name="gender"]:checked');

  const childNameProvided = childNameInput.value.trim().length > 0;
  const childNameNotProvided = childNameNA.checked;

  const childNameValid =
    childNameProvided || childNameNotProvided;

  button.disabled =
    !participantID ||
    !childGender ||
    !childNameValid;
};

document
  .querySelectorAll('input[name="childGender"]')
  .forEach((radio) => {
    radio.addEventListener('change', handleInput);
  });


childNameInput.addEventListener('input', () => {
  if (childNameInput.value.trim().length > 0) {
    childNameNA.checked = false;
  }

  handleInput();
});

childNameNA.addEventListener('change', () => {
  if (childNameNA.checked) {
    childNameInput.value = '';
  }

  handleInput();
});

// Continue to the instructions
const handleContinueClick = (event) => {
  event.preventDefault();

  const childGender =
    document.querySelector('input[name="childGender"]:checked')?.value;
  
  const childName = childNameNA.checked
    ? ''
    : childNameInput.value.trim();
  
  sessionStorage.setItem('childName', childName);

  window.location.href =
    `./instructionsA.html?ID=${encodeURIComponent(participantID)}&g=${encodeURIComponent(childGender)}`;
};

button.addEventListener('click', handleContinueClick);
handleInput();



/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("3d71aad4f4314801757e")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.03e7f408bdaa41b801d3.hot-update.js.map