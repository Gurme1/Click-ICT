// Comment System
class CommentSystem {
    constructor() {
        this.comments = JSON.parse(localStorage.getItem('clickict_comments') || '[]');
        this.init();
    }

    init() {
        this.loadComments();
        this.setupCommentForm();
    }

    setupCommentForm() {
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }
    }

    handleCommentSubmit(e) {
        e.preventDefault();
        
        // Check if user is logged in
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
        if (!currentUser) {
            alert('Yaada kennuuf duraan seenuu qabda!');
            window.location.href = 'user-login.html';
            return;
        }

        const formData = new FormData(e.target);
        const commentData = {
            id: Date.now(),
            postId: formData.get('postId') || 'homepage',
            userId: currentUser.id,
            username: currentUser.username,
            fullname: currentUser.fullname,
            email: currentUser.email,
            comment: formData.get('comment'),
            date: new Date().toISOString(),
            isApproved: false // Comments need admin approval
        };

        this.comments.unshift(commentData);
        this.saveComments();
        
        // Send email notification to admin
        this.sendCommentEmail(commentData);
        
        // Show success message
        this.showMessage('Yaadni keessan ergameera! Admin mirkaneessuu booda mul\'ata.', 'success');
        
        // Reset form
        e.target.reset();
        
        // Reload comments
        this.loadComments();
    }

    async sendCommentEmail(commentData) {
        try {
            // Try EmailJS first (if configured)
            if (window.emailService) {
                const result = await window.emailService.sendCommentNotification(commentData);
                if (result.success) {
                    console.log('Comment notification email sent successfully');
                    return;
                }
            }

            // Fallback to mailto link
            this.openCommentMailto(commentData);
        } catch (error) {
            console.error('Comment email sending failed:', error);
            // Still open mailto as fallback
            this.openCommentMailto(commentData);
        }
    }

    openCommentMailto(commentData) {
        const adminEmail = 'gurmessa89@gmail.com';
        const subject = encodeURIComponent('New Comment - ClickICT');
        const body = encodeURIComponent(`
New comment posted on ClickICT:

User: ${commentData.fullname} (@${commentData.username})
Email: ${commentData.email}
Page: ${commentData.postId}
Date: ${new Date(commentData.date).toLocaleString()}

Comment:
"${commentData.comment}"

Please review and approve if appropriate.

Best regards,
ClickICT Comment System
        `);

        const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
        
        // Open mailto link in a new window/tab
        setTimeout(() => {
            window.open(mailtoLink, '_blank');
        }, 1000);
    }

    loadComments() {
        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer) return;

        // Get approved comments for current page
        const pageComments = this.comments.filter(comment => 
            comment.isApproved && 
            (comment.postId === this.getCurrentPageId())
        );

        if (pageComments.length === 0) {
            commentsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #64748b;">
                    <p>Yaadni hin jiru. Jalqaba ta'ii yaada kennaa!</p>
                </div>
            `;
            return;
        }

        commentsContainer.innerHTML = pageComments.map(comment => `
            <div class="comment-item" style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <strong style="color: #1e293b;">${comment.fullname}</strong>
                        <span style="color: #64748b; font-size: 0.9rem;">(@${comment.username})</span>
                    </div>
                    <span style="color: #94a3b8; font-size: 0.8rem;">${new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <div class="comment-content" style="color: #374151; line-height: 1.6;">
                    ${comment.comment}
                </div>
            </div>
        `).join('');
    }

    getCurrentPageId() {
        // Determine current page for comment association
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/') return 'homepage';
        if (path.includes('kompitara.html')) return 'kompitara';
        if (path.includes('bilbila.html')) return 'bilbila';
        if (path.includes('teeknoloojii.html')) return 'teeknoloojii';
        if (path.includes('seenaa.html')) return 'seenaa';
        if (path.includes('user-register.html')) return 'registration';
        if (path.includes('user-login.html')) return 'login';
        return 'homepage';
    }

    saveComments() {
        localStorage.setItem('clickict_comments', JSON.stringify(this.comments));
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            ${type === 'success' ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : 'background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Admin methods for comment management
    getAllComments() {
        return this.comments;
    }

    approveComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.isApproved = true;
            this.saveComments();
            return true;
        }
        return false;
    }

    deleteComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.saveComments();
        return true;
    }
}

// Initialize comment system
document.addEventListener('DOMContentLoaded', () => {
    window.commentSystem = new CommentSystem();
});