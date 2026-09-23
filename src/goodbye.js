import './index.css';

const deleteCheckbox = document.getElementById('delete-checkbox');
const deleteButton = document.getElementById('delete-button');

deleteCheckbox.addEventListener('change', () => {
  deleteButton.disabled = !deleteCheckbox.checked;
});