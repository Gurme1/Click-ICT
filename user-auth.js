// User Authentication System
class UserAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('clickict_users') || '[]');
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
        this.init();
        this.addDefaultUser();
    }

    init() {
        // Setup registration form
        const registerForm = document.getElementById('user-register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Setup login form
        const loginForm = document.getElementById('user-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Setup logout functionality
        const logoutBtn = document.getElementById('user-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    addDefaultUser() {
        // Add the specified email as a default registered user
        const defaultEmail = 'gurmessa89@gmail.com';
        const existingUser = this.users.find(user => user.email === defaultEmail);
        
        if (!existingUser) {
            const defaultUser = {
                id: Date.now(),
                fullname: 'Gurmessa',
                email: defaultEmail,
                username: 'gurmessa89',
                registrationDate: new Date().toISOString(),
                isActive: true
            };
            
            this.users.push(defaultUser);
            this.saveUsers();
            console.log('Default user added:', defaultEmail);
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            username: formData.get('username')
        };

        // Check if user already exists
        const existingUser = this.users.find(user => 
            user.email === userData.email || user.username === userData.username
        );

        if (existingUser) {
            this.showMessage('Email ykn username duraan fayyadameera!', 'error');
            return;
        }

        // Create new user (no password needed)
        const newUser = {
            id: Date.now(),
            fullname: userData.fullname,
            email: userData.email,
            username: userData.username,
            registrationDate: new Date().toISOString(),
            isActive: true
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Send email notification to admin
        this.sendRegistrationEmail(userData);
        
        this.showMessage('Galma\'inaan galmaa\'ameera! Admin email ergameera.', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            window.location.href = 'user-login.html';
        }, 3000);
    }

    async sendRegistrationEmail(userData) {
        try {
            // Try EmailJS first (if configured)
            if (window.emailService) {
                const result = await window.emailService.sendRegistrationNotification(userData);
                if (result.success) {
                    console.log('Registration email sent successfully');
                    return;
                }
            }

            // Fallback to mailto link
            this.openRegistrationMailto(userData);
        } catch (error) {
            console.error('Email sending failed:', error);
            // Still open mailto as fallback
            this.openRegistrationMailto(userData);
        }
    }

    openRegistrationMailto(userData) {
        const adminEmail = 'gurmessa89@gmail.com';
        const subject = encodeURIComponent('New User Registration - ClickICT');
        const body = encodeURIComponent(`
New user has registered on ClickICT:

Full Name: ${userData.fullname}
Email: ${userData.email}
Username: ${userData.username}
Registration Date: ${new Date().toLocaleString()}

Please review and welcome the new user.

Best regards,
ClickICT Registration System
        `);

        const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
        
        // Open mailto link in a new window/tab
        setTimeout(() => {
            window.open(mailtoLink, '_blank');
        }, 1000);
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            username: formData.get('username')
        };

        // Find user by username or email (no password check)
        const user = this.users.find(u => 
            (u.username === loginData.username || u.email === loginData.username) && 
            u.isActive
        );

        if (user) {
            // Set current user session
            this.currentUser = {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                username: user.username,
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Redirect to main website
            window.location.href = 'index.html';
        } else {
            const errorDiv = document.getElementById('login-error');
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    saveUsers() {
        localStorage.setItem('clickict_users', JSON.stringify(this.users));
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('register-message');
        if (messageDiv) {
            messageDiv.className = type === 'success' ? 'message message-success' : 'error-message';
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize user auth system
document.addEventListener('DOMContentLoaded', () => {
    window.userAuth = new UserAuth();
});