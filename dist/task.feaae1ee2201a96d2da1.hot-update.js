"use strict";
self["webpackHotUpdateminimal_webpack_dev_server_babel_setup"]("task",{

/***/ "./src/task.js":
/*!*********************!*\
  !*** ./src/task.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _task_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./task.css */ "./src/task.css");
/* harmony import */ var _backend_downloadData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./backend/downloadData.js */ "./src/backend/downloadData.js");
/* harmony import */ var _backend_milestonesDataSelected_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./backend/milestonesDataSelected.js */ "./src/backend/milestonesDataSelected.js");
/* harmony import */ var swing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! swing */ "./node_modules/swing/dist/index.js");



// https://github.com/gajus/swing


// ---------------------------------------------------------------------------------------------------------------------
// INITIALIZE ELEMENTS/OBJECTS
// ---------------------------------------------------------------------------------------------------------------------
const subjID =
  new URL(document.location.href).searchParams.get('ID') || 'testID';
const childName = sessionStorage.getItem('childName') || '';
const childGender =
  new URL(document.location.href).searchParams.get('g') || 'na';
const counter = document.getElementById('counter');
const buttonNo = document.getElementById('button-no');
const buttonYes = document.getElementById('button-yes');
const buttonBack = document.getElementById('button-back');

// An instance of the Stack is used to attach event listeners.
const stack = swing__WEBPACK_IMPORTED_MODULE_3__.Stack({
  throwOutConfidence: (xOffset, yOffset, element) => {
    const xConfidence = Math.min(Math.abs(xOffset) / 190, 1);
    return xConfidence;
  },
});

// get html element for UL for milestones
const cards = document.getElementById('stack');

// ---------------------------------------------------------------------------------------------------------------------
//  FIND OUT AT WHICH TRIAL TO START
// ---------------------------------------------------------------------------------------------------------------------
let item = 0;

// function for adapted and gendered language
const adaptLanguage = (text) => {

  let adaptedText = text;

  if (childGender === 'f') {
    adaptedText = adaptedText
      .replaceAll('{he/she}', 'she')
      .replaceAll('{him/her}', 'her')
      .replaceAll('{his/her}', 'her')
      .replaceAll('{himself/herself}', 'herself');
  }

  if (childGender === 'm') {
    adaptedText = adaptedText
      .replaceAll('{he/she}', 'he')
      .replaceAll('{him/her}', 'him')
      .replaceAll('{his/her}', 'his')
      .replaceAll('{himself/herself}', 'himself');
  }

  if (childGender === 'na') {
    adaptedText = adaptedText
      .replaceAll('{he/she}', 'he/she')
      .replaceAll('{him/her}', 'him/her')
      .replaceAll('{his/her}', 'his/her')
      .replaceAll('{himself/herself}', 'himself/herself');
  }

  if (childName.trim().length > 0) {
    adaptedText = adaptedText
      .replaceAll('your child', childName)
      .replaceAll('Your child', childName);
  }

  return adaptedText;
};

// read in milestone data
const data = JSON.parse((0,_backend_milestonesDataSelected_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
const trials = data.length;

counter.textContent = `${item + 1} von ${trials} Meilensteinen`;

data.splice(data.length - item, item);

for (let i = 0; i < data.length; i++) {
  const newLI = document.createElement('li');
  newLI.classList.add(`${data[i].domain}`);
  newLI.dataset.itemId = data[i].item_id;

  // milestone text
  const label = document.createElement('div');
  label.classList.add('milestone-text');
  label.textContent = adaptLanguage(data[i].label);
  newLI.appendChild(label);

  // milestone image
  const image = document.createElement('img');
  image.src = `./images/item_images/${data[i].item_id}.png`;
  image.onerror = () => {
    image.src = './images/item_images/placeholder.png';
  };
  image.alt = '';
  newLI.appendChild(image);

  cards.appendChild(newLI);
}

// prepare the cards in the stack for iteration
[].forEach.call(
  document.querySelectorAll('#stack li'),
  function (targetElement) {
    // add card element to the stack
    stack.createCard(targetElement);

    targetElement.classList.add('in-deck');
  },
);

let responseLog = {
  // get ID out of URL parameter
  meta: {
    subjID: subjID,
    childGender: childGender,
    childName: childName,
  },
  data: [],
};

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR LOGGING RESPONSES
// ---------------------------------------------------------------------------------------------------------------------
function logResponse() {
  responseLog.data[item] = {
    // get item id and milestone
    item_id: cards.lastElementChild.dataset.itemId,
    label: cards.lastElementChild.innerText,

    // throwDirection returns e.g. Symbol(RIGHT)
    // to get direction as string, get the description of the symbol
    // score 0 if child doesn't pass milestone; score 1 if child passes milestone
    // score: e.throwDirection.description === 'LEFT' ? 0 : 1,
    score: '',
    domain: cards.lastElementChild.classList[0],
    timestamp: new Date().toISOString(),
    trial: item + 1,
  };

  // increase counter
  item++;
  buttonBack.disabled = false;

  if (item < trials) {
    counter.textContent = `${item + 1} von ${trials} Meilensteinen`;
  };

  // Remove card from stack and hide
  cards.lastElementChild.classList.remove('in-deck');
  cards.lastElementChild.remove();
}

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR GOING BACK ONE ITEM
// ---------------------------------------------------------------------------------------------------------------------

function goBackOneItem() {
  if (item === 0) return;

  item--;

  const previousItem = data[data.length - 1 - item];

  const newLI = document.createElement('li');
  newLI.classList.add(`${previousItem.domain}`);
  newLI.dataset.itemId = previousItem.item_id;

  const label = document.createElement('div');
  label.classList.add('milestone-text');
  label.textContent = adaptLanguage(previousItem.label);
  newLI.appendChild(label);

  const image = document.createElement('img');
  image.src = `./images/item_images/${previousItem.item_id}.png`;
  image.onerror = () => {
    image.style.display = 'none';
  };
  image.alt = '';
  newLI.appendChild(image);

  cards.appendChild(newLI);

  stack.createCard(newLI);
  newLI.classList.add('in-deck');

  responseLog.data.pop();

  counter.textContent = `${item + 1} von ${trials} Meilensteinen`;

  if (item === 0) {
    buttonBack.disabled = true;
  }
}

// Add event listener for when a card is thrown out of the stack.
stack.on('throwout', (e) => {
  logResponse();
  responseLog.data[item - 1].score =
    e.throwDirection.description === 'LEFT' ? 0 : 1;

  // if all milestones were shown, save responses
  if (document.querySelectorAll('#stack li').length === 0) {
    (0,_backend_downloadData_js__WEBPACK_IMPORTED_MODULE_1__["default"])(responseLog, responseLog.meta.subjID);
    setTimeout(() => (window.location.href = `./goodbye.html`), 1000);
  }
});

const handleNoClick = (e) => {
  logResponse();
  responseLog.data[item - 1].score = 0;

  // if all milestones were shown, save responses
  if (document.querySelectorAll('#stack li').length === 0) {
    (0,_backend_downloadData_js__WEBPACK_IMPORTED_MODULE_1__["default"])(responseLog, responseLog.meta.subjID);
    setTimeout(() => (window.location.href = `./goodbye.html`), 1000);
  }
};

const handleYesClick = (e) => {
  logResponse();
  responseLog.data[item - 1].score = 1;

  // if all milestones were shown, save responses
  if (document.querySelectorAll('#stack li').length === 0) {
    (0,_backend_downloadData_js__WEBPACK_IMPORTED_MODULE_1__["default"])(responseLog, responseLog.meta.subjID);
    setTimeout(() => (window.location.href = `./goodbye.html`), 1000);
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// EVENTLISTENER
// ---------------------------------------------------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  e = e || window.event;
  if (e.key === 'ArrowLeft') {
    handleNoClick();
  } else if (e.key === 'ArrowRight') {
    handleYesClick();
  }
});

buttonNo.addEventListener('click', handleNoClick, { capture: true });
buttonYes.addEventListener('click', handleYesClick, { capture: true });
buttonBack.addEventListener('click', goBackOneItem);

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("60a43a9aa1ca091eaf84")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=task.feaae1ee2201a96d2da1.hot-update.js.map