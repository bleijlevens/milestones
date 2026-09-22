import './index.css';

const button = document.getElementById('button-center-item');
const textField = document.querySelector('.mdc-text-field__input');
const childNameInput = document.getElementById('child-name-input');
const childNameNA = document.getElementById('child-name-na');

// Check the participant ID, name, and gender whenever something is entered
const handleInput = () => {
  const participantID = textField.value;

  document.querySelector(
    '.mdc-text-field-character-counter',
  ).textContent = `${participantID.length} / 10`;

  const gender =
    document.querySelector('input[name="gender"]:checked');

  const childNameProvided = childNameInput.value.trim().length > 0;
  const childNameNotProvided = childNameNA.checked;

  const childNameValid =
    childNameProvided || childNameNotProvided;

  button.disabled =
    participantID.length === 0 ||
    !gender ||
    !childNameValid;
};

document
  .querySelectorAll('input[name="gender"]')
  .forEach((radio) => {
    radio.addEventListener('change', handleInput);
  });

textField.addEventListener('keyup', handleInput);

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

  const participantID = textField.value;

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
