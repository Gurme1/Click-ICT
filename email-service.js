// Email Service for ClickICT
class EmailService {
    constructor() {
        // Initialize EmailJS
        this.init();
    }

    init() {
        // EmailJS service configuration
        // Replace these placeholder values with your actual EmailJS credentials to enable email notifications.
        // Until configured, the system will silently fall back to mailto links.
        this.publicKey  = 'YOUR_PUBLIC_KEY';
        this.serviceID  = 'YOUR_SERVICE_ID';
        this.templateID = 'YOUR_TEMPLATE_ID';
        this.adminEmail = 'gurmessa89@gmail.com';

        // Only initialise EmailJS when real credentials are provided
        this.isConfigured = (
            this.publicKey  !== 'YOUR_PUBLIC_KEY' &&
            this.serviceID  !== 'YOUR_SERVICE_ID' &&
            this.templateID !== 'YOUR_TEMPLATE_ID'
        );

        if (this.isConfigured && typeof emailjs !== 'undefined') {
            try {
                emailjs.init(this.publicKey);
            } catch (e) {
                console.warn('EmailJS init failed:', e);
                this.isConfigured = false;
            }
        }
    }

    async sendRegistrationNotification(userData) {
        if (!this.isConfigured || typeof emailjs === 'undefined') {
            return { success: false, error: 'EmailJS not configured' };
        }
        try {
            const templateParams = {
                to_email: this.adminEmail,
                from_name: 'ClickICT Registration System',
                subject: 'New User Registration - ClickICT',
                user_fullname: userData.fullname,
                user_email: userData.email,
                user_username: userData.username,
                registration_date: new Date().toLocaleString(),
                message: `
                    New user has registered on ClickICT:
                    
                    Full Name: ${userData.fullname}
                    Email: ${userData.email}
                    Username: ${userData.username}
                    Registration Date: ${new Date().toLocaleString()}
                    
                    Please review and welcome the new user.
                    
                    Best regards,
                    ClickICT System
                `
            };

            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                templateParams
            );

            console.log('Registration email sent successfully:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Failed to send registration email:', error);
            return { success: false, error };
        }
    }

    async sendCommentNotification(commentData) {
        if (!this.isConfigured || typeof emailjs === 'undefined') {
            return { success: false, error: 'EmailJS not configured' };
        }
        try {
            const templateParams = {
                to_email: this.adminEmail,
                from_name: 'ClickICT Comment System',
                subject: 'New Comment - ClickICT',
                user_fullname: commentData.fullname,
                user_email: commentData.email,
                user_username: commentData.username,
                comment_page: commentData.postId,
                comment_date: new Date(commentData.date).toLocaleString(),
                comment_text: commentData.comment,
                message: `
                    New comment posted on ClickICT:
                    
                    User: ${commentData.fullname} (@${commentData.username})
                    Email: ${commentData.email}
                    Page: ${commentData.postId}
                    Date: ${new Date(commentData.date).toLocaleString()}
                    
                    Comment:
                    "${commentData.comment}"
                    
                    Please review and approve if appropriate.
                    
                    Best regards,
                    ClickICT System
                `
            };

            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                templateParams
            );

            console.log('Comment notification email sent successfully:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Failed to send comment notification email:', error);
            return { success: false, error };
        }
    }

    // Alternative method using Formspree (optional)
    // To enable: replace YOUR_FORM_ID with your real Formspree form ID from formspree.io
    async sendEmailViaFormspree(userData) {
        const formId = 'YOUR_FORM_ID';

        // Never make a network request with a placeholder ID
        if (formId === 'YOUR_FORM_ID') {
            console.log('Formspree not configured — skipping network request');
            return { success: false, error: 'Formspree not configured' };
        }

        try {
            const response = await fetch(`https://formspree.io/f/${formId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.adminEmail,
                    subject: 'New User Registration - ClickICT',
                    message: `New user registration:\n\nName: ${userData.fullname}\nEmail: ${userData.email}\nUsername: ${userData.username}\nDate: ${new Date().toLocaleString()}`
                })
            });

            if (response.ok) {
                console.log('Registration email sent via Formspree');
                return { success: true };
            } else {
                throw new Error('Formspree request failed');
            }
        } catch (error) {
            console.error('Formspree email failed:', error);
            return { success: false, error };
        }
    }

    // Simple mailto fallback
    openMailtoLink(userData) {
        const subject = encodeURIComponent('New User Registration - ClickICT');
        const body = encodeURIComponent(`
New user has registered on ClickICT:

Full Name: ${userData.fullname}
Email: ${userData.email}
Username: ${userData.username}
Registration Date: ${new Date().toLocaleString()}

Please review and welcome the new user.

Best regards,
ClickICT System
        `);

        const mailtoLink = `mailto:${this.adminEmail}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    }
}

// Initialize email service
window.emailService = new EmailService();