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

// Check the participant ID, name, and gender whenever something is entered
const handleInput = () => {

  const gender =
    document.querySelector('input[name="gender"]:checked');

  const childNameProvided = childNameInput.value.trim().length > 0;
  const childNameNotProvided = childNameNA.checked;

  const childNameValid =
    childNameProvided || childNameNotProvided;

  button.disabled =
    !participantID ||
    !gender ||
    !childNameValid;
};

document
  .querySelectorAll('input[name="gender"]')
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

  const gender =
    document.querySelector('input[name="gender"]:checked')?.value;
  
  const childName = childNameNA.checked
    ? ''
    : childNameInput.value.trim();
  
  sessionStorage.setItem('childName', childName);

  window.location.href =
    `./instructionsA.html?ID=${encodeURIComponent(participantID)}&g=${encodeURIComponent(gender)}`;
};

button.addEventListener('click', handleContinueClick);
handleInput();



/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d0ba0196a32f0ad8292c")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=index.5e281ba8ffaec553b2bb.hot-update.js.map