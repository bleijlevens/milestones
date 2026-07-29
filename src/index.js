import './index.css';

const button = document.getElementById('button-center-item');
const textField = document.querySelector('.mdc-text-field__input');

// Check the participant ID whenever something is entered
const handleInput = () => {
  const participantID = textField.value;

  document.querySelector(
    '.mdc-text-field-character-counter',
  ).textContent = `${participantID.length} / 10`;

  // Enable the button once an ID has been entered
  button.disabled = participantID.length === 0;
};

textField.addEventListener('keyup', handleInput);

// Continue to the instructions
const handleContinueClick = (event) => {
  event.preventDefault();

  const participantID = textField.value;

  window.location.href =
    `./instructionsA.html?ID=${encodeURIComponent(participantID)}&v=o`;
};

button.addEventListener('click', handleContinueClick);