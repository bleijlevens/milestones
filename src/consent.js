import './index.css';

const checkbox = document.getElementById('confirm-checkbox');
const button = document.getElementById('button-center-item');

const participantID =
  new URL(document.location.href).searchParams.get('ID');

const handleConsent = () => {
  button.disabled =
    !checkbox.checked ||
    !participantID;
};

checkbox.addEventListener('change', handleConsent);

const handleContinueClick = (event) => {
  event.preventDefault();

  window.location.href =
    `./index.html?ID=${encodeURIComponent(participantID)}`;
};

button.addEventListener('click', handleContinueClick);

handleConsent();