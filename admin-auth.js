// Admin Authentication System
class AdminAuth {
    constructor() {
        this.adminCredentials = {
            username: 'admin',
            password: 'clickict2024'
        };
        this.init();
    }

    init() {
        // Check if already logged in
        if (this.isLoggedIn() && window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-dashboard.html';
            return;
        }

        // Check if not logged in and trying to access dashboard
        if (!this.isLoggedIn() && window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'admin-login.html';
            return;
        }

        // Setup login form if on login page
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Setup logout functionality if on dashboard
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        // Get stored password or use default
        const storedPassword = localStorage.getItem('admin_password') || this.adminCredentials.password;

        if (username === this.adminCredentials.username && 
            password === storedPassword) {
            
            // Set login session
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            sessionStorage.setItem('loginTime', new Date().getTime());
            
            // Redirect to dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }

    isLoggedIn() {
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');
        
        if (!loggedIn || !loginTime) return false;
        
        // Check if session expired (24 hours)
        const now = new Date().getTime();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - parseInt(loginTime) > sessionDuration) {
            this.logout();
            return false;
        }
        
        return true;
    }

    logout() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        sessionStorage.removeItem('loginTime');
        window.location.href = 'admin-login.html';
    }

    getUsername() {
        return sessionStorage.getItem('adminUsername') || 'Admin';
    }
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    new AdminAuth();
});
