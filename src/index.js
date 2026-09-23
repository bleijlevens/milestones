import './index.css';

const participantID =
  new URL(document.location.href).searchParams.get('ID');
const button = document.getElementById('button-center-item');
const childNameInput = document.getElementById('child-name-input');
const childNameNA = document.getElementById('child-name-na');

// Check child name and gender whenever something is entered
const handleInput = () => {

  const childGender =
    document.querySelector('input[name="childGender"]:checked');

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

