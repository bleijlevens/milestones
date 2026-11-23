import './index.css';

const button = document.getElementById('button-center-item');

const subjID =
  new URL(document.location.href).searchParams.get('ID') || 'testID';

const childGender =
  new URL(document.location.href).searchParams.get('g') || 'na';


// define what happens on button click
const handleContinueClick = (event) => {
  event.preventDefault();

  window.location.href =
    `./instructionsB.html?ID=${encodeURIComponent(subjID)}&g=${encodeURIComponent(childGender)}`;
};

button.addEventListener('click', handleContinueClick, { capture: false });
