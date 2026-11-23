import './index.css';
import milestonesDataOrder1 from './backend/milestonesDataOrder1.js';
import milestonesDataOrder2 from './backend/milestonesDataOrder2.js';

const checkbox = document.getElementById('confirm-checkbox');
const button = document.getElementById('button-center-item');

const participantID =
  new URL(document.location.href).searchParams.get('ID');
const isReusableTestID =
  participantID === 'testID' ||
  participantID === 'test';
const trials = JSON.parse(milestonesDataOrder1()).length;

const chooseRandomOrder = () => {
  return Math.random() < 0.5 ? '1' : '2';
};

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

    // Returning participant: skip participant and instructions
    if (
      result.success &&
      result.exists &&
      result.data.length > 0
    ) {
      const childName = result.data[0].child_name || '';
      const childGender = result.data[0].child_gender || 'na';

      sessionStorage.setItem('childName', childName);

      const itemOrder = result.data[0].item_order;
      sessionStorage.setItem('itemOrder', itemOrder);
      

      if (result.data.length >= trials) {

        // Test IDs may start a completely new run after finishing
        if (isReusableTestID) {
          sessionStorage.removeItem('childName');

          const itemOrder = chooseRandomOrder();
          sessionStorage.setItem('itemOrder', itemOrder);

          sessionStorage.setItem('freshTestRun', 'true');

          window.location.href =
            `./participant.html?ID=${encodeURIComponent(participantID)}`;
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
  const itemOrder = chooseRandomOrder();
  sessionStorage.setItem('itemOrder', itemOrder);

  window.location.href =
    `./participant.html?ID=${encodeURIComponent(participantID)}`;
};

button.addEventListener('click', handleContinueClick);

handleConsent();