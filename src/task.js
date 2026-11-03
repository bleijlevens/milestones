import './task.css';
// import downloadData from './backend/downloadData.js';
import milestonesDataOrder1 from './backend/milestonesDataOrder1.js';
import milestonesDataOrder2 from './backend/milestonesDataOrder2.js';
// https://github.com/gajus/swing
import * as Swing from 'swing';

// ---------------------------------------------------------------------------------------------------------------------
// INITIALIZE ELEMENTS/OBJECTS
// ---------------------------------------------------------------------------------------------------------------------
const subjID =
  new URL(document.location.href).searchParams.get('ID') || 'testID';
let childName = sessionStorage.getItem('childName') || '';
const childGender =
  new URL(document.location.href).searchParams.get('g') || 'na';
const counter = document.getElementById('counter');
const buttonNo = document.getElementById('button-no');
const buttonYes = document.getElementById('button-yes');
const buttonBack = document.getElementById('button-back');

buttonNo.style.pointerEvents = 'none';
buttonYes.style.pointerEvents = 'none';
buttonBack.disabled = true;

// An instance of the Stack is used to attach event listeners.
const stack = Swing.Stack({
  throwOutConfidence: (xOffset, yOffset, element) => {
    const xConfidence = Math.min(Math.abs(xOffset) / 150, 1);
    return xConfidence;
  },
});

// get html element for UL for milestones
const cards = document.getElementById('stack');

// ---------------------------------------------------------------------------------------------------------------------
//  FIND OUT AT WHICH TRIAL TO START
// ---------------------------------------------------------------------------------------------------------------------
let item = 0;
let taskReady = false;

// function for adapted and gendered language
const adaptLanguage = (text) => {

  let adaptedText = text;

  if (childGender === 'f') {
    adaptedText = adaptedText
      .replaceAll('er/sie', 'sie')
      .replaceAll('ihm/ihr', 'ihr')
      .replaceAll('ihn/sie', 'sie')
      .replaceAll('sein/ihr', 'ihr')
      .replaceAll('seine/ihre', 'ihre')
      .replaceAll('seinem/ihrem', 'ihrem')
      .replaceAll('seinen/ihren', 'ihren')
      .replaceAll('seiner/ihrer', 'ihrer')
      .replaceAll('seines/ihres', 'ihres');
  }

  if (childGender === 'm') {
    adaptedText = adaptedText
      .replaceAll('er/sie', 'er')
      .replaceAll('ihm/ihr', 'ihm')
      .replaceAll('ihn/sie', 'ihn')
      .replaceAll('sein/ihr', 'sein')
      .replaceAll('seine/ihre', 'seine')
      .replaceAll('seinem/ihrem', 'seinem')
      .replaceAll('seinen/ihren', 'seinen')
      .replaceAll('seiner/ihrer', 'seiner')
      .replaceAll('seines/ihres', 'seines');
  }

  if (childGender === 'na') {
    adaptedText = adaptedText
      .replaceAll('er/sie', 'sie/er')
      .replaceAll('ihm/ihr', 'ihr/ihm')
      .replaceAll('ihn/sie', 'sie/ihn')
      .replaceAll('sein/ihr', 'ihr/sein')
      .replaceAll('seine/ihre', 'ihre/seine')
      .replaceAll('seinem/ihrem', 'ihrem/seinem')
      .replaceAll('seinen/ihren', 'ihren/seinen')
      .replaceAll('seiner/ihrer', 'ihrer/seiner')
      .replaceAll('seines/ihres', 'ihres/seines');
  }

  if (childName.trim().length > 0) {
    adaptedText = adaptedText
      .replaceAll('Ihr Kind', childName)
      .replaceAll('Ihrem Kind', childName)
      .replaceAll('Ihres Kindes', `von ${childName}`);
  }

  return adaptedText;
};

// read in milestone data
const itemOrder = sessionStorage.getItem('itemOrder');

const milestonesData =
  itemOrder === '2'
    ? milestonesDataOrder2
    : milestonesDataOrder1;

const data = JSON.parse(milestonesData());

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
  if (data[i].label.length > 200) {
    label.classList.add('milestone-text-long');
  }
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
    itemOrder: itemOrder,
  },
  data: [],
};

let saveQueue = Promise.resolve();

const saveDataToServer = () => {
  const dataToSave = JSON.stringify(responseLog);

  saveQueue = saveQueue.then(async () => {
    try {
      const response = await fetch('./data/save.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataToSave,
      });

      const result = await response.json();

      if (!result.success) {
        console.error('Saving failed:', result.error);
      }
    } catch (error) {
      console.error('Could not save data:', error);
    }
  });

  return saveQueue;
};

const loadDataFromServer = async () => {
  try {
    const response = await fetch(
      `./data/load.php?ID=${encodeURIComponent(subjID)}`,
      {
        cache: 'no-store',
      },
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Could not load data:', error);
    return null;
  }
};

const resumeFromSavedData = async () => {
  const freshTestRun =
    sessionStorage.getItem('freshTestRun') === 'true';

  if (freshTestRun) {
    sessionStorage.removeItem('freshTestRun');

    buttonNo.style.pointerEvents = 'auto';
    buttonYes.style.pointerEvents = 'auto';
    buttonBack.disabled = true;
    taskReady = true;

    return;
  }
  
  const result = await loadDataFromServer();

  if (!result || !result.success || !result.exists) {
    buttonNo.style.pointerEvents = 'auto';
    buttonYes.style.pointerEvents = 'auto';
    buttonBack.disabled = true;
    taskReady = true;
    return;
  }

  childName = result.data[0].child_name || '';
  sessionStorage.setItem('childName', childName);
  responseLog.meta.childName = childName;

  document.querySelectorAll('#stack li').forEach((card) => {
    const milestone = data.find(
      (entry) => entry.item_id === card.dataset.itemId,
    );

    if (milestone) {
      card.querySelector('.milestone-text').textContent =
        adaptLanguage(milestone.label);
    }
  });

  responseLog.data = result.data.map((trial) => ({
    item_id: trial.item_id,
    label: trial.label,
    score: Number(trial.score),
    domain: trial.domain,
    timestamp: trial.timestamp,
    trial: Number(trial.trial),
  }));

  item = responseLog.data.length;

  for (let i = 0; i < item; i++) {
    cards.lastElementChild.remove();
  }

  if (item < trials) {
    counter.textContent = `${item + 1} von ${trials} Meilensteinen`;
  }

  buttonNo.style.pointerEvents = 'auto';
  buttonYes.style.pointerEvents = 'auto';
  buttonBack.disabled = item === 0;
  taskReady = true;
};

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR LOGGING RESPONSES
// ---------------------------------------------------------------------------------------------------------------------
function logResponse() {
  responseLog.data[item] = {
    // get item id and milestone
    item_id: cards.lastElementChild.dataset.itemId,
    label: cards.lastElementChild.querySelector('.milestone-text').innerText.trim(),
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
  if (!taskReady) return;

  if (item === 0) return;

  item--;

  buttonBack.disabled = true;

  const previousItem = data[data.length - 1 - item];

  const newLI = document.createElement('li');
  newLI.classList.add(`${previousItem.domain}`);
  newLI.dataset.itemId = previousItem.item_id;

  const label = document.createElement('div');
  label.classList.add('milestone-text');
  if (previousItem.label.length > 200) {
    label.classList.add('milestone-text-long');
  }
  label.textContent = adaptLanguage(previousItem.label);
  newLI.appendChild(label);

  const image = document.createElement('img');
  image.src = `./images/item_images/${previousItem.item_id}.png`;
  image.onerror = () => {
    image.src = './images/item_images/placeholder.png';
  };
  image.alt = '';
  newLI.appendChild(image);

  cards.appendChild(newLI);

  stack.createCard(newLI);
  newLI.classList.add('in-deck');

  responseLog.data.pop();

  saveDataToServer();

  counter.textContent = `${item + 1} von ${trials} Meilensteinen`;

  if (item === 0) {
    buttonBack.disabled = true;
  }
}

// Add event listener for when a card is thrown out of the stack.
stack.on('throwout', async (e) => {
  if (!taskReady) return;
  logResponse();
  responseLog.data[item - 1].score =
    e.throwDirection.description === 'LEFT' ? 0 : 1;

  const savePromise = saveDataToServer();

  // if all milestones were shown, wait until saving is finished
  if (document.querySelectorAll('#stack li').length === 0) {
    await savePromise;
    window.location.href =
      `./goodbye.html?ID=${encodeURIComponent(subjID)}`;
  }
});

const handleNoClick = async (e) => {
  if (!taskReady) return;

  logResponse();
  responseLog.data[item - 1].score = 0;

  const savePromise = saveDataToServer();

  // if all milestones were shown, wait until saving is finished
  if (document.querySelectorAll('#stack li').length === 0) {
    await savePromise;
    window.location.href =
      `./goodbye.html?ID=${encodeURIComponent(subjID)}`;
  }
};

const handleYesClick = async (e) => {
  if (!taskReady) return;

  logResponse();
  responseLog.data[item - 1].score = 1;

  const savePromise = saveDataToServer();

  // if all milestones were shown, wait until saving is finished
  if (document.querySelectorAll('#stack li').length === 0) {
    await savePromise;
    window.location.href =
      `./goodbye.html?ID=${encodeURIComponent(subjID)}`;
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

resumeFromSavedData();