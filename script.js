const form = document.getElementById('contactForm');
const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message')
};

const errors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  message: document.getElementById('messageError')
};

const successMessage = document.getElementById('formSuccess');

function validateField(name, value) {
  if (name === 'name') {
    if (!value.trim()) return 'Please enter your name.';
    if (value.trim().length < 2) return 'Name should be at least 2 characters.';
  }

  if (name === 'email') {
    if (!value.trim()) return 'Please enter your email address.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return 'Please enter a valid email address.';
  }

  if (name === 'message') {
    if (!value.trim()) return 'Please enter a message.';
    if (value.trim().length < 10) return 'Message should be at least 10 characters.';
  }

  return '';
}

function showError(fieldName, message) {
  fields[fieldName].classList.toggle('invalid', Boolean(message));
  errors[fieldName].textContent = message;
}

function validateForm() {
  let isValid = true;
  Object.entries(fields).forEach(([fieldName, field]) => {
    const message = validateField(fieldName, field.value);
    showError(fieldName, message);
    if (message) isValid = false;
  });
  return isValid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.textContent = '';

  if (!validateForm()) {
    return;
  }

  successMessage.textContent = 'Thanks! Your message has been sent.';
  form.reset();
  Object.values(fields).forEach((field) => field.classList.remove('invalid'));
  Object.values(errors).forEach((error) => {
    error.textContent = '';
  });
});

Object.values(fields).forEach((field) => {
  field.addEventListener('input', () => {
    const fieldName = field.name;
    const message = validateField(fieldName, field.value);
    showError(fieldName, message);
    if (!message) {
      successMessage.textContent = '';
    }
  });
});
