import './index.css';

const button = document.getElementById('button-center-item');

const subjID =
  new URL(document.location.href).searchParams.get('ID') || 'testID';

const handleContinueClick = (event) => {
  event.preventDefault();

  window.location.href =
    `./welcome.html?ID=${encodeURIComponent(subjID)}`;
};

button.addEventListener('click', handleContinueClick, { capture: false });