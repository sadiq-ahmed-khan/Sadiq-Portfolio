export function createContactForm(options = {}) {
    const { onSubmit = async () => ({ success: true }) } = options;

    const form = document.createElement('form');
    form.setAttribute('novalidate', '');

    const fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Your name',
            validate: (value) => {
                if (!value.trim()) return 'Name is required.';
                if (value.trim().length < 2) return 'Name should be at least 2 characters.';
                return '';
            }
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'you@example.com',
            validate: (value) => {
                if (!value.trim()) return 'Email is required.';
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
                return '';
            }
        },
        {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            placeholder: 'Tell me about your project',
            validate: (value) => {
                if (!value.trim()) return 'Message is required.';
                if (value.trim().length < 10) return 'Message should be at least 10 characters.';
                if (value.trim().length > 500) return 'Message should be at most 500 characters.';
                return '';
            }
        }
    ];

    const state = {
        submitting: false,
        touched: {}
    };

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Send message';
    submitButton.disabled = true;

    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const elements = {};

    fields.forEach((field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'field';

        const label = document.createElement('label');
        label.setAttribute('for', field.name);
        label.textContent = field.label;

        const input = field.type === 'textarea'
            ? document.createElement('textarea')
            : document.createElement('input');
        input.id = field.name;
        input.name = field.name;
        if (field.type !== 'textarea') {
            input.type = field.type;
        }
        input.placeholder = field.placeholder;
        input.setAttribute('required', '');
        input.setAttribute('autocomplete', field.name === 'email' ? 'email' : 'off');
        if (field.name === 'message') {
            input.setAttribute('maxlength', '500');
        }

        const error = document.createElement('div');
        error.className = 'error-text';
        error.id = `${field.name}Error`;

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(error);
        form.appendChild(wrapper);

        elements[field.name] = { input, error, wrapper };
    });

    form.appendChild(submitButton);
    form.appendChild(status);

    function updateSubmitState() {
        const values = Object.values(elements).map(({ input }) => input.value);
        const hasErrors = Object.values(elements).some(({ input, error }) => {
            const message = validateField(input.name);
            return message !== '';
        });

        const isEmpty = values.every((value) => !value.trim());
        submitButton.disabled = state.submitting || hasErrors || isEmpty;
    }

    function setFieldError(name, message) {
        const field = elements[name];
        if (!field) return;

        field.error.textContent = message;
        field.wrapper.classList.toggle('invalid', Boolean(message));
        field.input.setAttribute('aria-invalid', String(Boolean(message)));
        field.input.setAttribute('aria-describedby', message ? `${name}Error` : '');
    }

    function validateField(name) {
        const field = elements[name];
        if (!field) return '';
        const message = field.input.name === 'name'
            ? (() => {
                const value = field.input.value;
                if (!value.trim()) return 'Name is required.';
                if (value.trim().length < 2) return 'Name should be at least 2 characters.';
                return '';
            })()
            : field.input.name === 'email'
                ? (() => {
                    const value = field.input.value;
                    if (!value.trim()) return 'Email is required.';
                    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
                    return '';
                })()
                : (() => {
                    const value = field.input.value;
                    if (!value.trim()) return 'Message is required.';
                    if (value.trim().length < 10) return 'Message should be at least 10 characters.';
                    if (value.trim().length > 500) return 'Message should be at most 500 characters.';
                    return '';
                })();

        setFieldError(name, message);
        return message;
    }

    Object.entries(elements).forEach(([name, field]) => {
        field.input.addEventListener('blur', () => {
            state.touched[name] = true;
            validateField(name);
            updateSubmitState();
        });

        field.input.addEventListener('input', () => {
            if (state.touched[name]) {
                validateField(name);
            }
            updateSubmitState();
        });

        field.input.addEventListener('focus', () => {
            status.textContent = '';
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        Object.keys(elements).forEach((name) => {
            state.touched[name] = true;
            validateField(name);
        });

        const hasErrors = Object.keys(elements).some((name) => validateField(name));
        if (hasErrors) {
            status.textContent = 'Please fix the highlighted fields before sending your message.';
            updateSubmitState();
            return;
        }

        state.submitting = true;
        updateSubmitState();
        status.textContent = 'Sending...';

        try {
            await onSubmit({
                name: elements.name.input.value.trim(),
                email: elements.email.input.value.trim(),
                message: elements.message.input.value.trim()
            });
            status.textContent = 'Thanks! Your message has been sent.';
            form.reset();
            Object.keys(elements).forEach((name) => {
                state.touched[name] = false;
                setFieldError(name, '');
            });
        } finally {
            state.submitting = false;
            updateSubmitState();
        }
    });

    updateSubmitState();
    return form;
}
