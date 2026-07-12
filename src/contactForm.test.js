import { describe, it, expect, beforeEach } from 'vitest';
import { createContactForm } from './contactForm.js';

describe('contact form', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('blocks empty submit', async () => {
        const form = createContactForm();
        container.appendChild(form);

        const submitButton = form.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await Promise.resolve();

        expect(form.querySelector('[role="status"]').textContent).toContain('Please fix');
    });

    it('rejects invalid email', async () => {
        const form = createContactForm();
        container.appendChild(form);

        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        const submitButton = form.querySelector('button[type="submit"]');

        name.value = 'Sadiq';
        email.value = 'bad-email';
        message.value = 'This is a valid message for testing.';

        email.dispatchEvent(new Event('blur', { bubbles: true }));
        await Promise.resolve();

        expect(email.getAttribute('aria-invalid')).toBe('true');
        expect(form.querySelector('#emailError').textContent).toContain('valid email');
        expect(submitButton.disabled).toBe(true);
    });

    it('succeeds for a valid submit', async () => {
        const onSubmit = vi.fn().mockResolvedValue({ success: true });
        const form = createContactForm({ onSubmit });
        container.appendChild(form);

        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');

        name.value = 'Sadiq';
        email.value = 'sadiq@example.com';
        message.value = 'This is a valid message for testing.';

        name.dispatchEvent(new Event('input', { bubbles: true }));
        email.dispatchEvent(new Event('input', { bubbles: true }));
        message.dispatchEvent(new Event('input', { bubbles: true }));

        await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

        expect(onSubmit).toHaveBeenCalledWith({
            name: 'Sadiq',
            email: 'sadiq@example.com',
            message: 'This is a valid message for testing.'
        });
        expect(form.querySelector('[role="status"]').textContent).toContain('Thanks');
    });

    it('shows and clears error messages correctly', async () => {
        const form = createContactForm();
        container.appendChild(form);

        const name = form.querySelector('#name');
        const nameError = form.querySelector('#nameError');

        name.value = 'A';
        name.dispatchEvent(new Event('blur', { bubbles: true }));
        await Promise.resolve();

        expect(nameError.textContent).toContain('at least 2');
        expect(name.getAttribute('aria-invalid')).toBe('true');

        name.value = 'Sadiq';
        name.dispatchEvent(new Event('input', { bubbles: true }));
        await Promise.resolve();

        expect(nameError.textContent).toBe('');
        expect(name.getAttribute('aria-invalid')).toBe('false');
    });
});
