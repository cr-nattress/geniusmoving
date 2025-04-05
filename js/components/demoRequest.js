/**
 * Demo Request Component
 */
import { showNotification, setButtonLoading } from '../utils/ui.js';

/**
 * Initializes the demo request button functionality
 * @param {string} buttonSelector - The CSS selector for the demo request button
 */
export default function initDemoRequest(buttonSelector = '.request-demo-btn') {
  const requestDemoBtn = document.querySelector(buttonSelector);

  if (requestDemoBtn) {
    requestDemoBtn.setAttribute('aria-haspopup', 'dialog');
    requestDemoBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setButtonLoading(requestDemoBtn, true);
      showDemoRequestModal(requestDemoBtn);
    });
  }

  document.addEventListener('demo:request', (event) => {
    showNotification(event.detail.message, 'info');
  });
}

/**
 * Creates and shows a modal dialog for demo requests
 * @param {HTMLElement} triggerButton - The button that triggered the modal
 */
function showDemoRequestModal(triggerButton) {
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', 'true');
  modalContainer.setAttribute('aria-labelledby', 'demo-modal-title');

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';

  const modalTitle = document.createElement('h2');
  modalTitle.id = 'demo-modal-title';
  modalTitle.textContent = 'Request a Demo';

  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close-btn';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close dialog');

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  const modalForm = document.createElement('form');
  modalForm.id = 'demo-request-form';

  const nameGroup = createFormGroup('name', 'Name', 'text', true);
  modalForm.appendChild(nameGroup);

  const emailGroup = createFormGroup('demo-email', 'Email Address', 'email', true);
  modalForm.appendChild(emailGroup);

  const companyGroup = createFormGroup('company', 'Company', 'text', true);
  modalForm.appendChild(companyGroup);

  const phoneGroup = createFormGroup('phone', 'Phone Number', 'tel', false);
  modalForm.appendChild(phoneGroup);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'primary-button';
  submitButton.textContent = 'Submit Request';
  modalForm.appendChild(submitButton);

  modalBody.appendChild(modalForm);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContainer.appendChild(modalContent);

  document.body.appendChild(modalContainer);

  closeButton.addEventListener('click', () => {
    closeModal(modalContainer, triggerButton);
  });

  modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      closeModal(modalContainer, triggerButton);
    }
  });

  modalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setButtonLoading(submitButton, true);
    setTimeout(() => {
      const demoEvent = new CustomEvent('demo:request', {
        detail: { message: 'Thank you! Your demo request has been submitted.' },
      });
      document.dispatchEvent(demoEvent);
      closeModal(modalContainer, triggerButton);
    }, 1000);
  });

  setTimeout(() => {
    modalContainer.classList.add('show');
    const firstInput = modalForm.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }
    setButtonLoading(triggerButton, false);
  }, 10);

  modalContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(modalContainer, triggerButton);
    }
  });
}

/**
 * Closes the modal dialog
 * @param {HTMLElement} modal - The modal element to close
 * @param {HTMLElement} triggerButton - The button that triggered the modal
 */
function closeModal(modal, triggerButton) {
  modal.classList.remove('show');
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    if (triggerButton) {
      triggerButton.focus();
    }
  }, 300);
}

/**
 * Creates a form group with label and input
 * @param {string} id - The ID for the input
 * @param {string} label - The label text
 * @param {string} type - The input type
 * @param {boolean} required - Whether the field is required
 * @returns {HTMLElement} - The form group element
 */
function createFormGroup(id, label, type, required) {
  const group = document.createElement('div');
  group.className = 'input-group';

  const labelElement = document.createElement('label');
  labelElement.setAttribute('for', id);
  labelElement.textContent = label;

  if (required) {
    const requiredIndicator = document.createElement('span');
    requiredIndicator.className = 'required-indicator';
    requiredIndicator.textContent = ' *';
    requiredIndicator.setAttribute('aria-hidden', 'true');
    labelElement.appendChild(requiredIndicator);
  }

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.name = id;
  if (required) {
    input.setAttribute('required', 'required');
    input.setAttribute('aria-required', 'true');
  }

  const errorDiv = document.createElement('div');
  errorDiv.id = `${id}-error`;
  errorDiv.className = 'error-message';
  errorDiv.setAttribute('aria-live', 'polite');

  group.appendChild(labelElement);
  group.appendChild(input);
  group.appendChild(errorDiv);

  return group;
}
