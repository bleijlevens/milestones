import './index.css';
import milestonesData from './backend/milestonesDataSelected.js';

const checkbox = document.getElementById('confirm-checkbox');
const button = document.getElementById('button-center-item');

const participantID =
  new URL(document.location.href).searchParams.get('ID');
const isReusableTestID =
  participantID === 'testID' ||
  participantID === 'test';
const trials = JSON.parse(milestonesData()).length;

const handleConsent = () => {
  button.disabled =
    !checkbox.checked ||
    !participantID;
};

checkbox.addEventListener('change', handleConsent);

const handleContinueClick = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(
      `./data/load.php?ID=${encodeURIComponent(participantID)}`,
      {
        cache: 'no-store',
      },
    );

    const result = await response.json();

    // Returning participant: skip setup and instructions
    if (
      result.success &&
      result.exists &&
      result.data.length > 0
    ) {
      const childName = result.data[0].child_name || '';
      const childGender = result.data[0].child_gender || 'na';

      sessionStorage.setItem('childName', childName);

      if (result.data.length >= trials) {

        // Test IDs may start a completely new run after finishing
        if (isReusableTestID) {
          sessionStorage.removeItem('childName');
          sessionStorage.setItem('freshTestRun', 'true');

          window.location.href =
            `./index.html?ID=${encodeURIComponent(participantID)}`;
          return;
        }

        // Real participants cannot participate twice
        window.location.href =
          `./goodbye.html?ID=${encodeURIComponent(participantID)}`;
        return;
      }

      window.location.href =
        `./task.html?ID=${encodeURIComponent(participantID)}&g=${encodeURIComponent(childGender)}`;

      return;
    }
  } catch (error) {
    console.error('Could not check existing participant data:', error);
  }

  // New participant: continue with normal setup
  window.location.href =
    `./index.html?ID=${encodeURIComponent(participantID)}`;
};

button.addEventListener('click', handleContinueClick);

handleConsent();