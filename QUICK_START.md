# ClickICT - Quick Start Guide 🚀

## 🌐 Access Your Website

### Main Website
Open in browser: `index.html`

### Admin Panel
1. Open: `system/admin-login.html`
2. Login with:
   - **Username:** admin
   - **Password:** clickict2024

### User Registration
Open: `system/user-register.html`

## 📂 Folder Structure (Simple)

```
clickict/
├── index.html          ← Start here!
├── img/                ← All images
└── system/             ← All other pages
    ├── kompitara.html
    ├── bilbila.html
    ├── ai.html
    ├── videos.html
    ├── gallery.html
    ├── admin-dashboard.html
    └── ... (other pages)
```

## ✨ Key Features

### 📖 Reading Mode
- Click the "📖 Reading Mode" button (bottom right)
- Comfortable sepia background
- Larger text for easy reading
- Toggle back to normal mode anytime

### 🌍 Multi-Language
- Switch languages using the dropdown in navigation
- Supports: Oromo, Amharic, English, Arabic
- Your choice is saved automatically

### 🎥 Admin Dashboard Features
1. **Posts Management** - Create, edit, delete, pin posts
2. **Videos** - Add YouTube videos with categories
3. **Gallery** - Upload and manage images
4. **Social Media** - Manage social media links
5. **Users** - View registered users
6. **Settings** - Change password and site settings

## 🔧 Common Tasks

### Add a New Video (Admin)
1. Login to admin dashboard
2. Click "Videos" tab
3. Fill in: Title, Category, Description, YouTube URL
4. Click "Add Video"

### Add a New Image (Admin)
1. Login to admin dashboard
2. Click "Gallery" tab
3. Upload image, add title and description
4. Click "Add Image"

### Create a New Post (Admin)
1. Login to admin dashboard
2. Click "Posts" tab
3. Fill in all fields
4. Choose category
5. Click "Create Post"
6. Optional: Pin to homepage

### Update Social Media Links (Admin)
1. Login to admin dashboard
2. Click "Social Media" tab
3. Add/edit platform links
4. Toggle active/inactive
5. Links appear in website footer

## 🎨 Customization

### Change Colors
Edit `styles.css` - look for color codes like:
- `#667eea` (purple)
- `#764ba2` (dark purple)
- `#059669` (green)

### Add More Images
1. Add images to `img/` folder
2. Reference in HTML: `<img src="../img/yourimage.jpg">`

### Edit Content
- Open any HTML file in `system/` folder
- Edit text directly
- Save and refresh browser

## ⚠️ Important Notes

1. **All pages except index.html are in system/ folder**
2. **Images are in img/ folder at root level**
3. **Data is stored in browser localStorage (temporary)**
4. **For production, implement real backend and database**

## 🆘 Troubleshooting

### Images not showing?
- Check if images are in `img/` folder
- Verify path uses `../img/` in system folder pages

### Admin login not working?
- Clear browser cache
- Use correct credentials: admin / clickict2024
- Check browser console for errors

### Language not switching?
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Try again

### Reading mode not working?
- Check if `script.js` is loaded
- Look for button at bottom right
- Clear cache and reload

## 📱 Mobile Responsive

The website is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

## 🔒 Security Tips

For production deployment:
1. Change admin password immediately
2. Implement HTTPS
3. Use real database (not localStorage)
4. Add input validation
5. Implement CSRF protection
6. Use environment variables for secrets

## 📞 Support

**Developer:** Gurmessa Milki  
**Email:** gurmessa89@gmail.com

---

**Quick Tip:** Bookmark `system/admin-dashboard.html` for easy admin access!
