import './index.css';

const deleteCheckbox = document.getElementById('delete-checkbox');
const deleteButton = document.getElementById('delete-button');

const participantID =
  new URL(document.location.href).searchParams.get('ID');

deleteCheckbox.addEventListener('change', () => {
  deleteButton.disabled = !deleteCheckbox.checked;
});

deleteButton.addEventListener('click', async () => {
  if (!deleteCheckbox.checked || !participantID) {
    return;
  }

  deleteButton.disabled = true;

  try {
    const response = await fetch('./data/delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subjID: participantID,
      }),
    });

    const result = await response.json();

    if (result.success) {
      deleteButton.textContent = 'Daten gelöscht';
      deleteCheckbox.disabled = true;
    } else {
      console.error('Deletion failed:', result.error);
      deleteButton.disabled = false;
    }
  } catch (error) {
    console.error('Could not delete data:', error);
    deleteButton.disabled = false;
  }
});