// Admin Dashboard Management System
class AdminDashboard {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('clickict_posts') || '[]');
        this.pages = JSON.parse(localStorage.getItem('clickict_pages') || '[]');
        this.settings = JSON.parse(localStorage.getItem('clickict_settings') || '{}');
        this.navigation = JSON.parse(localStorage.getItem('clickict_navigation') || '[]');
        this.currentEditId = null;
        this.init();
    }

    init() {
        // Set admin username
        const adminUsername = sessionStorage.getItem('adminUsername') || 'Admin';
        document.getElementById('admin-username').textContent = adminUsername;

        // Setup tab navigation
        this.setupTabs();
        
        // Setup forms
        this.setupForms();
        
        // Load existing content
        this.loadPosts();
        this.loadComments();
        this.loadSettings();
        this.loadNavigation();
        
        // Setup media upload
        this.setupMediaUpload();
        
        // Setup Videos, Gallery, Social Media forms
        this.setupVideoForm();
        this.setupGalleryForm();
        this.setupSocialForm();
        
        // Load Videos, Gallery, Social Media lists
        this.loadVideos();
        this.loadGallery();
        this.loadSocialPosts();
        
        // Sync published posts to website content
        this.syncWebsiteContent();
    }

    syncWebsiteContent() {
        // Get all published posts and sync to website content
        const publishedPosts = this.posts.filter(post => post.status === 'published');
        const websiteContent = {
            posts: publishedPosts
        };
        localStorage.setItem('website_content', JSON.stringify(websiteContent));
        console.log('Synced published posts to website:', publishedPosts.length);
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    setupForms() {
        // Post form
        const postForm = document.getElementById('post-form');
        postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        
        // Page form
        const pageForm = document.getElementById('page-form');
        pageForm.addEventListener('submit', (e) => this.handlePageSubmit(e));
        
        // Settings form
        const settingsForm = document.getElementById('settings-form');
        settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        
        // Draft and preview buttons
        document.getElementById('save-draft').addEventListener('click', () => this.saveDraft());
        document.getElementById('preview-post').addEventListener('click', () => this.previewPost());
        document.getElementById('preview-page').addEventListener('click', () => this.previewPage());
        
        // Image upload preview
        const imageInput = document.getElementById('post-image');
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    handlePostSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        
        // Handle image upload
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.savePost(formData, event.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.savePost(formData, this.currentImageData || '');
        }
    }

    savePost(formData, imageData) {
        const postData = {
            id: this.currentEditId || Date.now(),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            content: formData.get('content'),
            category: formData.get('category'),
            image: imageData,
            video: formData.get('video'),
            link: formData.get('link'),
            status: 'published',
            date: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing post
            const index = this.posts.findIndex(p => p.id === this.currentEditId);
            this.posts[index] = postData;
            this.showMessage('Barreeffamni milkaa\'inaan haaromfameera!', 'success');
        } else {
            // Add new post
            this.posts.unshift(postData);
            this.showMessage('Barreeffamni milkaa\'inaan dabalameeera!', 'success');
        }

        this.savePosts();
        this.loadPosts();
        this.resetPostForm();
        this.updateWebsiteContent(postData);
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('image-preview');
        
        if (file) {
            // Create canvas to resize image to YouTube banner size (2560x1440)
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Set YouTube banner dimensions (16:9 aspect ratio)
                const targetWidth = 2560;
                const targetHeight = 1440;
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                
                // Calculate scaling to maintain aspect ratio
                const imgAspect = img.width / img.height;
                const targetAspect = targetWidth / targetHeight;
                
                let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
                
                if (imgAspect > targetAspect) {
                    // Image is wider - fit to height
                    drawHeight = targetHeight;
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (targetWidth - drawWidth) / 2;
                } else {
                    // Image is taller - fit to width
                    drawWidth = targetWidth;
                    drawHeight = drawWidth / imgAspect;
                    offsetY = (targetHeight - drawHeight) / 2;
                }
                
                // Fill background with white
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                
                // Draw resized image
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                
                // Convert to base64 with good quality
                this.currentImageData = canvas.toDataURL('image/jpeg', 0.85);
                
                // Show preview (smaller version for UI)
                preview.innerHTML = `
                    <img src="${this.currentImageData}" alt="Preview" 
                         style="max-width: 300px; max-height: 169px; border-radius: 8px; border: 2px solid #e5e7eb;">
                    <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                        Resized to YouTube banner size (2560x1440)
                    </p>
                `;
            };
            
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
            this.currentImageData = '';
        }
    }

    handlePageSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const pageData = {
            id: Date.now(),
            title: formData.get('title'),
            slug: formData.get('slug'),
            content: formData.get('content'),
            date: new Date().toISOString()
        };

        this.pages.push(pageData);
        this.savePages();
        this.showMessage('Fuulli milkaa\'inaan uumameera!', 'success');
        e.target.reset();
    }

    handleSettingsSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        this.settings = {
            siteTitle: formData.get('siteTitle'),
            siteDescription: formData.get('siteDescription')
        };

        this.saveSettings();
        this.showMessage('Settings milkaa\'inaan haaromfamaniiru!', 'success');
    }

    saveDraft() {
        const formData = new FormData(document.getElementById('post-form'));
        const imageFile = formData.get('image');
        
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.saveDraftData(formData, event.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.saveDraftData(formData, this.currentImageData || '');
        }
    }

    saveDraftData(formData, imageData) {
        const draftData = {
            id: Date.now(),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            content: formData.get('content'),
            category: formData.get('category'),
            image: imageData,
            video: formData.get('video'),
            link: formData.get('link'),
            status: 'draft',
            date: new Date().toISOString()
        };

        this.posts.unshift(draftData);
        this.savePosts();
        this.loadPosts();
        this.resetPostForm();
        this.showMessage('Draft milkaa\'inaan olkaa\'ameera!', 'success');
    }

    previewPost() {
        const formData = new FormData(document.getElementById('post-form'));
        const previewData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            content: formData.get('content'),
            category: formData.get('category'),
            image: formData.get('image'),
            video: formData.get('video'),
            link: formData.get('link')
        };

        // Store preview data and open preview window
        sessionStorage.setItem('previewPost', JSON.stringify(previewData));
        window.open('preview.html', '_blank');
    }

    previewPage() {
        const formData = new FormData(document.getElementById('page-form'));
        const previewData = {
            title: formData.get('title'),
            content: formData.get('content')
        };

        sessionStorage.setItem('previewPage', JSON.stringify(previewData));
        window.open('preview.html', '_blank');
    }

    loadPosts() {
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';

        this.posts.forEach(post => {
            const row = document.createElement('tr');
            
            // Create image preview for table
            const imagePreview = post.image ? 
                `<img src="${post.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 8px;">` : 
                '<span style="color: #94a3b8;">No image</span>';
            
            // Pin icon
            const pinIcon = post.pinned ? '📌' : '';
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        ${imagePreview}
                        <span>${pinIcon} ${post.title}</span>
                    </div>
                </td>
                <td>${post.category}</td>
                <td><span class="status-badge status-${post.status}">${post.status}</span></td>
                <td>${new Date(post.date).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-small ${post.pinned ? 'btn-warning' : 'btn-info'}" onclick="adminDashboard.togglePin(${post.id})" title="${post.pinned ? 'Unpin from home' : 'Pin to home'}">
                        ${post.pinned ? '📌 Unpin' : '📌 Pin'}
                    </button>
                    <button class="btn btn-small btn-warning" onclick="adminDashboard.editPost(${post.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="adminDashboard.deletePost(${post.id})">Delete</button>
                    ${post.status === 'draft' ? `<button class="btn btn-small btn-success" onclick="adminDashboard.publishPost(${post.id})">Publish</button>` : ''}
                </td>
            `;
            postsList.appendChild(row);
        });
    }

    togglePin(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        post.pinned = !post.pinned;
        this.savePosts();
        this.loadPosts();
        this.showMessage(post.pinned ? 'Post pinned to home page!' : 'Post unpinned from home page!', 'success');
    }

    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        this.currentEditId = id;
        this.currentImageData = post.image || '';
        
        // Fill form with post data
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-subtitle').value = post.subtitle || '';
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-video').value = post.video || '';
        document.getElementById('post-link').value = post.link || '';

        // Show image preview if exists
        const preview = document.getElementById('image-preview');
        if (post.image) {
            preview.innerHTML = `
                <img src="${post.image}" alt="Preview" 
                     style="max-width: 300px; max-height: 169px; border-radius: 8px; border: 2px solid #e5e7eb;">
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                    YouTube banner size (2560x1440)
                </p>
            `;
        } else {
            preview.innerHTML = '';
        }

        // Switch to posts tab
        document.querySelector('[data-tab="posts"]').click();
        
        // Scroll to form
        document.getElementById('post-form').scrollIntoView({ behavior: 'smooth' });
    }

    deletePost(id) {
        if (confirm('Barreeffama kana dhugumaan haquu barbaaddaa?')) {
            this.posts = this.posts.filter(p => p.id !== id);
            this.savePosts();
            this.loadPosts();
            
            // Also remove from website content
            const websiteContent = JSON.parse(localStorage.getItem('website_content') || '{}');
            if (websiteContent.posts) {
                websiteContent.posts = websiteContent.posts.filter(p => p.id !== id);
                localStorage.setItem('website_content', JSON.stringify(websiteContent));
            }
            
            // Trigger refresh
            window.dispatchEvent(new CustomEvent('contentUpdated'));
            
            this.showMessage('Barreeffamni haqameera!', 'success');
        }
    }

    publishPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (post) {
            post.status = 'published';
            post.lastModified = new Date().toISOString();
            this.savePosts();
            this.loadPosts();
            this.updateWebsiteContent(post);
            this.showMessage('Barreeffamni publish godhameeera!', 'success');
        }
    }

    updateWebsiteContent(post) {
        // Update both admin storage and website content
        const websiteContent = JSON.parse(localStorage.getItem('website_content') || '{}');
        if (!websiteContent.posts) websiteContent.posts = [];
        
        const existingIndex = websiteContent.posts.findIndex(p => p.id === post.id);
        if (existingIndex >= 0) {
            websiteContent.posts[existingIndex] = post;
        } else {
            websiteContent.posts.unshift(post);
        }
        
        // Only include published posts in website content
        websiteContent.posts = websiteContent.posts.filter(p => p.status === 'published');
        
        localStorage.setItem('website_content', JSON.stringify(websiteContent));
        
        // Trigger a custom event to refresh the main website if it's open
        window.dispatchEvent(new CustomEvent('contentUpdated', { detail: post }));
        
        console.log('Website content updated:', websiteContent);
    }

    setupMediaUpload() {
        const mediaUpload = document.getElementById('media-upload');
        const mediaPreview = document.getElementById('media-preview');

        mediaUpload.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            mediaPreview.innerHTML = '';

            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    // Resize image to YouTube banner dimensions
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    
                    img.onload = () => {
                        // Set YouTube banner dimensions (16:9 aspect ratio)
                        const targetWidth = 2560;
                        const targetHeight = 1440;
                        
                        canvas.width = targetWidth;
                        canvas.height = targetHeight;
                        
                        // Calculate scaling to maintain aspect ratio
                        const imgAspect = img.width / img.height;
                        const targetAspect = targetWidth / targetHeight;
                        
                        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
                        
                        if (imgAspect > targetAspect) {
                            // Image is wider - fit to height
                            drawHeight = targetHeight;
                            drawWidth = drawHeight * imgAspect;
                            offsetX = (targetWidth - drawWidth) / 2;
                        } else {
                            // Image is taller - fit to width
                            drawWidth = targetWidth;
                            drawHeight = drawWidth / imgAspect;
                            offsetY = (targetHeight - drawHeight) / 2;
                        }
                        
                        // Fill background with white
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, targetWidth, targetHeight);
                        
                        // Draw resized image
                        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                        
                        // Convert to base64 with good quality
                        const resizedImageData = canvas.toDataURL('image/jpeg', 0.85);
                        
                        const preview = document.createElement('div');
                        preview.style.margin = '10px';
                        preview.style.display = 'inline-block';
                        preview.style.textAlign = 'center';

                        preview.innerHTML = `
                            <img src="${resizedImageData}" style="max-width: 300px; max-height: 169px; border-radius: 8px; border: 2px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" alt="Preview">
                            <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">
                                ${file.name}<br>
                                Resized to YouTube banner (2560x1440)
                            </p>
                            <button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; padding: 4px 8px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Remove</button>
                        `;

                        mediaPreview.appendChild(preview);
                    };
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                    
                } else if (file.type.startsWith('video/')) {
                    // Handle video files (no resizing needed)
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const preview = document.createElement('div');
                        preview.style.margin = '10px';
                        preview.style.display = 'inline-block';
                        preview.style.textAlign = 'center';

                        preview.innerHTML = `
                            <video width="300" height="169" controls style="border-radius: 8px; border: 2px solid #e5e7eb;">
                                <source src="${e.target.result}" type="${file.type}">
                            </video>
                            <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                                ${file.name}<br>
                                Video file (16:9 aspect ratio)
                            </p>
                            <button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; padding: 4px 8px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Remove</button>
                        `;

                        mediaPreview.appendChild(preview);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    loadSettings() {
        if (this.settings.siteTitle) {
            document.getElementById('site-title').value = this.settings.siteTitle;
        }
        if (this.settings.siteDescription) {
            document.getElementById('site-description').value = this.settings.siteDescription;
        }
    }

    resetPostForm() {
        document.getElementById('post-form').reset();
        document.getElementById('image-preview').innerHTML = '';
        this.currentEditId = null;
        this.currentImageData = '';
    }

    savePosts() {
        localStorage.setItem('clickict_posts', JSON.stringify(this.posts));
    }

    savePages() {
        localStorage.setItem('clickict_pages', JSON.stringify(this.pages));
    }

    saveSettings() {
        localStorage.setItem('clickict_settings', JSON.stringify(this.settings));
    }

    showMessage(message, type) {
        const container = document.getElementById('message-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        container.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Comment Management Methods
    loadComments() {
        const comments = JSON.parse(localStorage.getItem('clickict_comments') || '[]');
        this.allComments = comments; // Store all comments for filtering
        this.displayComments(comments);
    }

    filterComments() {
        const filter = document.getElementById('comment-filter').value;
        let filteredComments = this.allComments;
        
        if (filter !== 'all') {
            filteredComments = this.allComments.filter(comment => comment.postId === filter);
        }
        
        this.displayComments(filteredComments);
    }

    displayComments(comments) {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        commentsList.innerHTML = '';

        if (comments.length === 0) {
            commentsList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #64748b;">Yaadni hin jiru</td></tr>';
            return;
        }

        comments.forEach(comment => {
            const pageNames = {
                'homepage': 'Homepage',
                'registration': 'Registration',
                'kompitara': 'Kompitara',
                'bilbila': 'Bilbila',
                'teeknoloojii': 'Teeknoloojii',
                'seenaa': 'Seenaa'
            };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div>
                        <strong>${comment.fullname}</strong><br>
                        <small style="color: #64748b;">@${comment.username} (${comment.email})</small>
                    </div>
                </td>
                <td style="max-width: 250px;">
                    <div style="overflow: hidden; text-overflow: ellipsis;">
                        ${comment.comment.length > 80 ? comment.comment.substring(0, 80) + '...' : comment.comment}
                    </div>
                </td>
                <td>
                    <span style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 12px; font-size: 0.8rem;">
                        ${pageNames[comment.postId] || comment.postId}
                    </span>
                </td>
                <td>${new Date(comment.date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${comment.isApproved ? 'status-published' : 'status-draft'}">
                        ${comment.isApproved ? 'Approved' : 'Pending'}
                    </span>
                </td>
                <td class="action-buttons">
                    ${!comment.isApproved ? `<button class="btn btn-small btn-success" onclick="adminDashboard.approveComment(${comment.id})">Approve</button>` : ''}
                    <button class="btn btn-small btn-danger" onclick="adminDashboard.deleteComment(${comment.id})">Delete</button>
                </td>
            `;
            commentsList.appendChild(row);
        });
    }

    approveComment(commentId) {
        const comments = JSON.parse(localStorage.getItem('clickict_comments') || '[]');
        const comment = comments.find(c => c.id === commentId);
        
        if (comment) {
            comment.isApproved = true;
            localStorage.setItem('clickict_comments', JSON.stringify(comments));
            this.loadComments();
            this.showMessage('Yaadni approve godhameeera!', 'success');
            
            // Refresh comments on main website
            window.dispatchEvent(new CustomEvent('commentsUpdated'));
        }
    }

    deleteComment(commentId) {
        if (confirm('Yaada kana dhugumaan haquu barbaaddaa?')) {
            let comments = JSON.parse(localStorage.getItem('clickict_comments') || '[]');
            comments = comments.filter(c => c.id !== commentId);
            localStorage.setItem('clickict_comments', JSON.stringify(comments));
            this.loadComments();
            this.showMessage('Yaadni haqameera!', 'success');
            
            // Refresh comments on main website
            window.dispatchEvent(new CustomEvent('commentsUpdated'));
        }
    }

    // Navigation Management Methods
    loadNavigation() {
        console.log('Navigation loaded:', this.navigation.length, 'items');
    }

    // ═══════════════════════════════════════════════════════
    // VIDEOS MANAGEMENT
    // ═══════════════════════════════════════════════════════
    setupVideoForm() {
        const form = document.getElementById('video-form');
        if (!form) return;

        // Thumbnail preview
        const thumbInput = document.getElementById('video-thumbnail');
        if (thumbInput) {
            thumbInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                this.resizeImageToYoutubeBanner(file, (data) => {
                    const preview = document.getElementById('video-thumb-preview');
                    if (preview) preview.innerHTML = '<img src="' + data + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
                    this._videoThumbData = data;
                });
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id:        this._editingVideoId || Date.now(),
                title:     document.getElementById('video-title').value.trim(),
                category:  document.getElementById('video-category').value,
                subtitle:  document.getElementById('video-subtitle').value.trim(),
                content:   document.getElementById('video-content').value.trim(),
                thumbnail: this._videoThumbData || (this._editingVideoId ? (this._getVideo(this._editingVideoId)||{}).thumbnail : '') || '',
                videoUrl:  document.getElementById('video-url').value.trim(),
                link:      document.getElementById('video-link').value.trim(),
                status:    'published',
                date:      new Date().toISOString()
            };

            let videos = JSON.parse(localStorage.getItem('clickict_videos') || '[]');
            if (this._editingVideoId) {
                const idx = videos.findIndex(v => v.id === this._editingVideoId);
                if (idx !== -1) videos[idx] = data;
                this.showMessage('Video haaromfameera!', 'success');
            } else {
                videos.unshift(data);
                this.showMessage('Video dabalameera!', 'success');
            }
            localStorage.setItem('clickict_videos', JSON.stringify(videos));
            this._editingVideoId = null;
            this._videoThumbData = '';
            form.reset();
            document.getElementById('video-thumb-preview').innerHTML = '';
            document.getElementById('video-form-title').textContent = '📹 Video Haaraa Dabaluu';
            document.getElementById('video-cancel-edit').style.display = 'none';
            this.loadVideos();
        });
    }

    loadVideos() {
        const tbody = document.getElementById('videos-list');
        if (!tbody) return;
        const videos = JSON.parse(localStorage.getItem('clickict_videos') || '[]');
        tbody.innerHTML = '';
        if (videos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:2rem;">Video hin jiru. Video haaraa dabalaa!</td></tr>';
            return;
        }
        videos.forEach(v => {
            const tr = document.createElement('tr');
            const thumb = v.thumbnail
                ? '<img src="' + v.thumbnail + '" style="width:60px;height:34px;object-fit:cover;border-radius:4px;">'
                : '<div style="width:60px;height:34px;background:#e0e7ff;border-radius:4px;display:flex;align-items:center;justify-content:center;">📹</div>';
            const videoLink = v.videoUrl
                ? '<a href="' + v.videoUrl + '" target="_blank" style="color:#2563eb;font-size:0.8rem;">▶ Watch</a>'
                : '<span style="color:#94a3b8;font-size:0.8rem;">No URL</span>';
            tr.innerHTML = '<td>' + thumb + '</td>'
                + '<td><strong>' + v.title + '</strong><br><small style="color:#64748b;">' + (v.subtitle||'') + '</small></td>'
                + '<td><span style="background:#e0e7ff;color:#3730a3;padding:2px 8px;border-radius:12px;font-size:0.78rem;">' + v.category + '</span></td>'
                + '<td>' + videoLink + '</td>'
                + '<td>' + new Date(v.date).toLocaleDateString() + '</td>'
                + '<td class="action-buttons">'
                + '<button class="btn btn-small btn-warning" onclick="adminDashboard.editVideo(' + v.id + ')">✏️ Edit</button>'
                + '<button class="btn btn-small btn-danger" onclick="adminDashboard.deleteVideo(' + v.id + ')">🗑️ Delete</button>'
                + '</td>';
            tbody.appendChild(tr);
        });
    }

    editVideo(id) {
        const videos = JSON.parse(localStorage.getItem('clickict_videos') || '[]');
        const v = videos.find(x => x.id === id);
        if (!v) return;
        this._editingVideoId = id;
        this._videoThumbData = v.thumbnail || '';
        document.getElementById('video-title').value    = v.title;
        document.getElementById('video-category').value = v.category;
        document.getElementById('video-subtitle').value = v.subtitle || '';
        document.getElementById('video-content').value  = v.content;
        document.getElementById('video-url').value      = v.videoUrl || '';
        document.getElementById('video-link').value     = v.link || '';
        if (v.thumbnail) {
            document.getElementById('video-thumb-preview').innerHTML =
                '<img src="' + v.thumbnail + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
        }
        document.getElementById('video-form-title').textContent = '✏️ Video Gulaali';
        document.getElementById('video-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-tab="videos"]').click();
        document.getElementById('video-form').scrollIntoView({ behavior:'smooth' });
    }

    cancelVideoEdit() {
        this._editingVideoId = null;
        this._videoThumbData = '';
        document.getElementById('video-form').reset();
        document.getElementById('video-thumb-preview').innerHTML = '';
        document.getElementById('video-form-title').textContent = '📹 Video Haaraa Dabaluu';
        document.getElementById('video-cancel-edit').style.display = 'none';
    }

    deleteVideo(id) {
        if (!confirm('Video kana dhugumaan haquu barbaaddaa?')) return;
        let videos = JSON.parse(localStorage.getItem('clickict_videos') || '[]');
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('clickict_videos', JSON.stringify(videos));
        this.loadVideos();
        this.showMessage('Video haqameera!', 'success');
    }

    _getVideo(id) {
        return JSON.parse(localStorage.getItem('clickict_videos') || '[]').find(v => v.id === id);
    }

    // ═══════════════════════════════════════════════════════
    // GALLERY MANAGEMENT
    // ═══════════════════════════════════════════════════════
    setupGalleryForm() {
        const form = document.getElementById('gallery-form');
        if (!form) return;

        const imgInput = document.getElementById('gallery-image');
        if (imgInput) {
            imgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                this.resizeImageToYoutubeBanner(file, (data) => {
                    const preview = document.getElementById('gallery-image-preview');
                    if (preview) preview.innerHTML = '<img src="' + data + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
                    this._galleryImgData = data;
                });
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const imgData = this._galleryImgData || (this._editingGalleryId ? (this._getGalleryItem(this._editingGalleryId)||{}).image : '') || '';
            if (!imgData && !this._editingGalleryId) {
                this.showMessage('Suuraa upload godhuu qabda!', 'error');
                return;
            }
            const data = {
                id:       this._editingGalleryId || Date.now(),
                title:    document.getElementById('gallery-title').value.trim(),
                category: document.getElementById('gallery-category').value,
                subtitle: document.getElementById('gallery-subtitle').value.trim(),
                content:  document.getElementById('gallery-content').value.trim(),
                image:    imgData,
                videoUrl: document.getElementById('gallery-video-url').value.trim(),
                link:     document.getElementById('gallery-link').value.trim(),
                status:   'published',
                date:     new Date().toISOString()
            };

            let gallery = JSON.parse(localStorage.getItem('clickict_gallery') || '[]');
            if (this._editingGalleryId) {
                const idx = gallery.findIndex(g => g.id === this._editingGalleryId);
                if (idx !== -1) gallery[idx] = data;
                this.showMessage('Suuraan haaromfameera!', 'success');
            } else {
                gallery.unshift(data);
                this.showMessage('Suuraan dabalameera!', 'success');
            }
            localStorage.setItem('clickict_gallery', JSON.stringify(gallery));
            this._editingGalleryId = null;
            this._galleryImgData = '';
            form.reset();
            document.getElementById('gallery-image-preview').innerHTML = '';
            document.getElementById('gallery-form-title').textContent = '🖼️ Suuraa Haaraa Dabaluu';
            document.getElementById('gallery-cancel-edit').style.display = 'none';
            this.loadGallery();
        });
    }

    loadGallery() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        const gallery = JSON.parse(localStorage.getItem('clickict_gallery') || '[]');
        grid.innerHTML = '';
        if (gallery.length === 0) {
            grid.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:2rem;grid-column:1/-1;">Suuraan hin jiru. Suuraa haaraa dabalaa!</div>';
            return;
        }
        gallery.forEach(g => {
            const card = document.createElement('div');
            card.style.cssText = 'background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid #e5e7eb;';
            card.innerHTML = '<div style="position:relative;">'
                + '<img src="' + g.image + '" style="width:100%;height:140px;object-fit:cover;display:block;">'
                + '<span style="position:absolute;top:6px;left:6px;background:#2563eb;color:white;padding:2px 8px;border-radius:10px;font-size:0.72rem;font-weight:700;">' + g.category + '</span>'
                + '</div>'
                + '<div style="padding:0.75rem;">'
                + '<p style="margin:0 0 4px;font-weight:700;color:#0f172a;font-size:0.88rem;">' + g.title + '</p>'
                + '<p style="margin:0 0 8px;color:#64748b;font-size:0.78rem;">' + new Date(g.date).toLocaleDateString() + '</p>'
                + '<div style="display:flex;gap:6px;">'
                + '<button class="btn btn-small btn-warning" onclick="adminDashboard.editGallery(' + g.id + ')" style="flex:1;">✏️ Edit</button>'
                + '<button class="btn btn-small btn-danger" onclick="adminDashboard.deleteGallery(' + g.id + ')" style="flex:1;">🗑️</button>'
                + '</div></div>';
            grid.appendChild(card);
        });
    }

    editGallery(id) {
        const gallery = JSON.parse(localStorage.getItem('clickict_gallery') || '[]');
        const g = gallery.find(x => x.id === id);
        if (!g) return;
        this._editingGalleryId = id;
        this._galleryImgData = g.image || '';
        document.getElementById('gallery-title').value    = g.title;
        document.getElementById('gallery-category').value = g.category;
        document.getElementById('gallery-subtitle').value = g.subtitle || '';
        document.getElementById('gallery-content').value  = g.content;
        document.getElementById('gallery-video-url').value = g.videoUrl || '';
        document.getElementById('gallery-link').value     = g.link || '';
        if (g.image) {
            document.getElementById('gallery-image-preview').innerHTML =
                '<img src="' + g.image + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
        }
        document.getElementById('gallery-form-title').textContent = '✏️ Suuraa Gulaali';
        document.getElementById('gallery-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-tab="gallery"]').click();
        document.getElementById('gallery-form').scrollIntoView({ behavior:'smooth' });
    }

    cancelGalleryEdit() {
        this._editingGalleryId = null;
        this._galleryImgData = '';
        document.getElementById('gallery-form').reset();
        document.getElementById('gallery-image-preview').innerHTML = '';
        document.getElementById('gallery-form-title').textContent = '🖼️ Suuraa Haaraa Dabaluu';
        document.getElementById('gallery-cancel-edit').style.display = 'none';
    }

    deleteGallery(id) {
        if (!confirm('Suuraa kana dhugumaan haquu barbaaddaa?')) return;
        let gallery = JSON.parse(localStorage.getItem('clickict_gallery') || '[]');
        gallery = gallery.filter(g => g.id !== id);
        localStorage.setItem('clickict_gallery', JSON.stringify(gallery));
        this.loadGallery();
        this.showMessage('Suuraan haqameera!', 'success');
    }

    _getGalleryItem(id) {
        return JSON.parse(localStorage.getItem('clickict_gallery') || '[]').find(g => g.id === id);
    }

    // ═══════════════════════════════════════════════════════
    // SOCIAL MEDIA MANAGEMENT
    // ═══════════════════════════════════════════════════════
    setupSocialForm() {
        const form = document.getElementById('social-form');
        if (!form) return;

        const imgInput = document.getElementById('social-image');
        if (imgInput) {
            imgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                this.resizeImageToYoutubeBanner(file, (data) => {
                    const preview = document.getElementById('social-image-preview');
                    if (preview) preview.innerHTML = '<img src="' + data + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
                    this._socialImgData = data;
                });
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id:       this._editingSocialId || Date.now(),
                title:    document.getElementById('social-title').value.trim(),
                category: document.getElementById('social-category').value,
                subtitle: document.getElementById('social-subtitle').value.trim(),
                content:  document.getElementById('social-content').value.trim(),
                image:    this._socialImgData || (this._editingSocialId ? (this._getSocialPost(this._editingSocialId)||{}).image : '') || '',
                videoUrl: document.getElementById('social-video-url').value.trim(),
                link:     document.getElementById('social-link').value.trim(),
                status:   'published',
                date:     new Date().toISOString()
            };

            let posts = JSON.parse(localStorage.getItem('clickict_social_posts') || '[]');
            if (this._editingSocialId) {
                const idx = posts.findIndex(p => p.id === this._editingSocialId);
                if (idx !== -1) posts[idx] = data;
                this.showMessage('Post haaromfameera!', 'success');
            } else {
                posts.unshift(data);
                this.showMessage('Post dabalameera!', 'success');
            }
            localStorage.setItem('clickict_social_posts', JSON.stringify(posts));
            this._editingSocialId = null;
            this._socialImgData = '';
            form.reset();
            document.getElementById('social-image-preview').innerHTML = '';
            document.getElementById('social-form-title').textContent = '📱 Social Media Post Haaraa';
            document.getElementById('social-cancel-edit').style.display = 'none';
            this.loadSocialPosts();
        });
    }

    loadSocialPosts() {
        const tbody = document.getElementById('social-list');
        if (!tbody) return;
        const posts = JSON.parse(localStorage.getItem('clickict_social_posts') || '[]');
        tbody.innerHTML = '';
        if (posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem;">Social media post hin jiru. Post haaraa dabalaa!</td></tr>';
            return;
        }
        const platformIcons = { facebook:'📘', youtube:'▶️', telegram:'✈️', tiktok:'🎵', instagram:'📷', twitter:'🐦', general:'📢' };
        posts.forEach(p => {
            const tr = document.createElement('tr');
            const img = p.image
                ? '<img src="' + p.image + '" style="width:50px;height:34px;object-fit:cover;border-radius:4px;">'
                : '<div style="width:50px;height:34px;background:#e0e7ff;border-radius:4px;display:flex;align-items:center;justify-content:center;">' + (platformIcons[p.category]||'📢') + '</div>';
            tr.innerHTML = '<td>' + img + '</td>'
                + '<td><strong>' + p.title + '</strong><br><small style="color:#64748b;">' + (p.subtitle||'') + '</small></td>'
                + '<td><span style="font-size:1.1rem;">' + (platformIcons[p.category]||'📢') + '</span> ' + p.category + '</td>'
                + '<td>' + new Date(p.date).toLocaleDateString() + '</td>'
                + '<td class="action-buttons">'
                + '<button class="btn btn-small btn-warning" onclick="adminDashboard.editSocialPost(' + p.id + ')">✏️ Edit</button>'
                + '<button class="btn btn-small btn-danger" onclick="adminDashboard.deleteSocialPost(' + p.id + ')">🗑️ Delete</button>'
                + (p.link ? '<a href="' + p.link + '" target="_blank" class="btn btn-small btn-info" style="text-decoration:none;">🔗 View</a>' : '')
                + '</td>';
            tbody.appendChild(tr);
        });
    }

    editSocialPost(id) {
        const posts = JSON.parse(localStorage.getItem('clickict_social_posts') || '[]');
        const p = posts.find(x => x.id === id);
        if (!p) return;
        this._editingSocialId = id;
        this._socialImgData = p.image || '';
        document.getElementById('social-title').value    = p.title;
        document.getElementById('social-category').value = p.category;
        document.getElementById('social-subtitle').value = p.subtitle || '';
        document.getElementById('social-content').value  = p.content;
        document.getElementById('social-video-url').value = p.videoUrl || '';
        document.getElementById('social-link').value     = p.link || '';
        if (p.image) {
            document.getElementById('social-image-preview').innerHTML =
                '<img src="' + p.image + '" style="max-width:300px;max-height:169px;border-radius:8px;border:2px solid #e5e7eb;margin-top:8px;">';
        }
        document.getElementById('social-form-title').textContent = '✏️ Post Gulaali';
        document.getElementById('social-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-tab="social"]').click();
        document.getElementById('social-form').scrollIntoView({ behavior:'smooth' });
    }

    cancelSocialEdit() {
        this._editingSocialId = null;
        this._socialImgData = '';
        document.getElementById('social-form').reset();
        document.getElementById('social-image-preview').innerHTML = '';
        document.getElementById('social-form-title').textContent = '📱 Social Media Post Haaraa';
        document.getElementById('social-cancel-edit').style.display = 'none';
    }

    deleteSocialPost(id) {
        if (!confirm('Post kana dhugumaan haquu barbaaddaa?')) return;
        let posts = JSON.parse(localStorage.getItem('clickict_social_posts') || '[]');
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('clickict_social_posts', JSON.stringify(posts));
        this.loadSocialPosts();
        this.showMessage('Post haqameera!', 'success');
    }

    _getSocialPost(id) {
        return JSON.parse(localStorage.getItem('clickict_social_posts') || '[]').find(p => p.id === id);
    }

    // ═══════════════════════════════════════════════════════
    // SHARED: Resize image to YouTube banner (2560x1440)
    // ═══════════════════════════════════════════════════════
    resizeImageToYoutubeBanner(file, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            const W = 2560, H = 1440;
            canvas.width = W; canvas.height = H;
            const imgAspect = img.width / img.height;
            const targetAspect = W / H;
            let dw, dh, ox = 0, oy = 0;
            if (imgAspect > targetAspect) { dh = H; dw = dh * imgAspect; ox = (W - dw) / 2; }
            else { dw = W; dh = dw / imgAspect; oy = (H - dh) / 2; }
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, W, H);
            ctx.drawImage(img, ox, oy, dw, dh);
            callback(canvas.toDataURL('image/jpeg', 0.85));
        };
        const reader = new FileReader();
        reader.onload = ev => { img.src = ev.target.result; };
        reader.readAsDataURL(file);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});


// Change Password Functionality
document.addEventListener('DOMContentLoaded', () => {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelChange = document.getElementById('cancel-change');
    const changePasswordForm = document.getElementById('change-password-form');
    const passwordMessage = document.getElementById('password-message');

    // Open modal
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            changePasswordModal.style.display = 'flex';
            changePasswordForm.reset();
            passwordMessage.style.display = 'none';
        });
    }

    // Close modal
    const closeModalFunc = () => {
        changePasswordModal.style.display = 'none';
        changePasswordForm.reset();
        passwordMessage.style.display = 'none';
    };

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    if (cancelChange) {
        cancelChange.addEventListener('click', closeModalFunc);
    }

    // Close modal when clicking outside
    changePasswordModal.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            closeModalFunc();
        }
    });

    // Handle form submission
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Get stored admin credentials
            const storedPassword = localStorage.getItem('admin_password') || 'clickict2024';

            // Verify current password
            if (currentPassword !== storedPassword) {
                showPasswordMessage('Current password is incorrect!', 'error');
                return;
            }

            // Verify new passwords match
            if (newPassword !== confirmPassword) {
                showPasswordMessage('New passwords do not match!', 'error');
                return;
            }

            // Verify new password is different from current
            if (newPassword === currentPassword) {
                showPasswordMessage('New password must be different from current password!', 'error');
                return;
            }

            // Verify password strength (minimum 6 characters)
            if (newPassword.length < 6) {
                showPasswordMessage('Password must be at least 6 characters long!', 'error');
                return;
            }

            // Update password
            localStorage.setItem('admin_password', newPassword);
            
            showPasswordMessage('Password changed successfully! Please login again.', 'success');

            // Logout after 2 seconds
            setTimeout(() => {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminUsername');
                window.location.href = 'admin-login.html';
            }, 2000);
        });
    }

    function showPasswordMessage(message, type) {
        passwordMessage.textContent = message;
        passwordMessage.style.display = 'block';
        
        if (type === 'success') {
            passwordMessage.style.background = '#d1fae5';
            passwordMessage.style.color = '#065f46';
            passwordMessage.style.border = '1px solid #10b981';
        } else {
            passwordMessage.style.background = '#fee2e2';
            passwordMessage.style.color = '#991b1b';
            passwordMessage.style.border = '1px solid #ef4444';
        }
    }

    // Add hover effect to change password button
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('mouseenter', () => {
            changePasswordBtn.style.transform = 'translateY(-2px)';
            changePasswordBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        });

        changePasswordBtn.addEventListener('mouseleave', () => {
            changePasswordBtn.style.transform = 'translateY(0)';
            changePasswordBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        });
    }
});
