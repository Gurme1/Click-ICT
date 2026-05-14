// ClickICT Book Seller Management System
class BookSeller {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('clickict_books') || '[]');
        this.editingId = null;
        this.isAdminMode = document.getElementById('book-form') !== null;
        this.init();
    }

    init() {
        if (this.isAdminMode) { this.setupAdminForm(); }
        this.renderBooks();
    }

    setupAdminForm() {
        const form = document.getElementById('book-form');
        if (!form) return;

        const pdfInput = document.getElementById('book-pdf');
        if (pdfInput) {
            pdfInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const info = document.getElementById('pdf-info');
                const filename = document.getElementById('pdf-filename');
                if (file && info && filename) {
                    filename.textContent = 'PDF: ' + file.name + ' (' + (file.size/1024).toFixed(0) + ' KB)';
                    info.style.display = 'block';
                    const zone = document.getElementById('pdf-upload-zone');
                    if (zone) { zone.style.borderColor='#059669'; zone.style.background='#f0fdf4'; }
                }
            });
        }

        const coverInput = document.getElementById('book-cover');
        if (coverInput) {
            coverInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('cover-preview');
                    if (preview) {
                        preview.innerHTML = '<div style="position:relative;display:inline-block;margin-top:8px;">'
                            + '<img src="' + ev.target.result + '" alt="Cover preview" style="width:120px;height:160px;object-fit:cover;border-radius:8px;border:2px solid #2563eb;box-shadow:0 4px 12px rgba(37,99,235,0.2);">'
                            + '<button type="button" onclick="clearCover()" style="position:absolute;top:-8px;right:-8px;background:#dc2626;color:white;border:none;width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:0.75rem;">x</button>'
                            + '</div>'
                            + '<p style="font-size:0.78rem;color:#059669;margin-top:6px;font-weight:600;">Cover: ' + file.name + '</p>';
                        const zone = document.getElementById('cover-upload-zone');
                        if (zone) { zone.style.borderColor='#2563eb'; zone.style.background='#eff6ff'; }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const titleVal    = document.getElementById('book-title').value.trim();
        const authorVal   = document.getElementById('book-author').value.trim();
        const descVal     = document.getElementById('book-description').value.trim();
        const priceEtbVal = parseFloat(document.getElementById('book-price-etb').value) || 0;
        const priceUsdVal = parseFloat(document.getElementById('book-price-usd').value) || 0;
        const categoryVal = document.getElementById('book-category').value;
        const stockVal    = document.getElementById('book-stock').value;
        const contactVal  = document.getElementById('book-contact').value.trim();
        const coverInput  = document.getElementById('book-cover');
        const pdfInput    = document.getElementById('book-pdf');

        const processBook = (coverData, pdfData, pdfName) => {
            if (this.editingId) {
                const idx = this.books.findIndex(b => b.id === this.editingId);
                if (idx !== -1) {
                    this.books[idx] = { ...this.books[idx], title:titleVal, author:authorVal, description:descVal,
                        priceEtb:priceEtbVal, priceUsd:priceUsdVal, category:categoryVal, stock:stockVal,
                        contact:contactVal, cover:coverData||this.books[idx].cover,
                        pdf:pdfData||this.books[idx].pdf, pdfName:pdfName||this.books[idx].pdfName,
                        updatedAt:new Date().toISOString() };
                    this.showMsg('Kitaabni haaromfameera!', 'success');
                }
                this.editingId = null;
                document.getElementById('book-form-title').textContent = 'Kitaaba Haaraa Dabaluu';
                document.getElementById('book-cancel-edit').style.display = 'none';
            } else {
                this.books.unshift({ id:Date.now(), title:titleVal, author:authorVal, description:descVal,
                    priceEtb:priceEtbVal, priceUsd:priceUsdVal, category:categoryVal, stock:stockVal,
                    contact:contactVal, cover:coverData||'', pdf:pdfData||'', pdfName:pdfName||'',
                    status:'published', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
                this.showMsg('Kitaabni dabalameera!', 'success');
            }
            this.saveBooks(); this.renderBooks(); form.reset();
            document.getElementById('cover-preview').innerHTML = '';
            const pdfInfo = document.getElementById('pdf-info');
            if (pdfInfo) pdfInfo.style.display = 'none';
            const cz = document.getElementById('cover-upload-zone');
            const pz = document.getElementById('pdf-upload-zone');
            if (cz) { cz.style.borderColor='#cbd5e1'; cz.style.background='#f8fafc'; }
            if (pz) { pz.style.borderColor='#cbd5e1'; pz.style.background='#f8fafc'; }
        };

        const readCover = () => new Promise(resolve => {
            const file = coverInput && coverInput.files[0];
            if (!file) return resolve(null);
            const r = new FileReader();
            r.onload = ev => resolve(ev.target.result);
            r.readAsDataURL(file);
        });
        const readPdf = () => new Promise(resolve => {
            const file = pdfInput && pdfInput.files[0];
            if (!file) return resolve({ data:null, name:null });
            const r = new FileReader();
            r.onload = ev => resolve({ data:ev.target.result, name:file.name });
            r.readAsDataURL(file);
        });
        Promise.all([readCover(), readPdf()]).then(([coverData, pdfResult]) => {
            processBook(coverData, pdfResult.data, pdfResult.name);
        });
    }

    editBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;
        this.editingId = id;
        document.getElementById('book-title').value       = book.title;
        document.getElementById('book-author').value      = book.author || '';
        document.getElementById('book-description').value = book.description;
        document.getElementById('book-price-etb').value   = book.priceEtb;
        document.getElementById('book-price-usd').value   = book.priceUsd;
        document.getElementById('book-category').value    = book.category;
        document.getElementById('book-stock').value       = book.stock || 'available';
        document.getElementById('book-contact').value     = book.contact || '';
        if (book.cover) {
            document.getElementById('cover-preview').innerHTML =
                '<img src="' + book.cover + '" style="width:120px;height:160px;object-fit:cover;border-radius:8px;border:2px solid #2563eb;margin-top:8px;">';
            const cz = document.getElementById('cover-upload-zone');
            if (cz) { cz.style.borderColor='#2563eb'; cz.style.background='#eff6ff'; }
        }
        if (book.pdfName) {
            const pi = document.getElementById('pdf-info');
            const pf = document.getElementById('pdf-filename');
            if (pi && pf) { pf.textContent = 'PDF: ' + book.pdfName + ' (existing)'; pi.style.display='block'; }
            const pz = document.getElementById('pdf-upload-zone');
            if (pz) { pz.style.borderColor='#059669'; pz.style.background='#f0fdf4'; }
        }
        document.getElementById('book-form-title').textContent = 'Kitaaba Gulaali';
        document.getElementById('book-cancel-edit').style.display = 'inline-flex';
        document.getElementById('book-form').scrollIntoView({ behavior:'smooth' });
    }

    cancelEdit() {
        this.editingId = null;
        document.getElementById('book-form').reset();
        document.getElementById('cover-preview').innerHTML = '';
        const pi = document.getElementById('pdf-info');
        if (pi) pi.style.display = 'none';
        const cz = document.getElementById('cover-upload-zone');
        const pz = document.getElementById('pdf-upload-zone');
        if (cz) { cz.style.borderColor='#cbd5e1'; cz.style.background='#f8fafc'; }
        if (pz) { pz.style.borderColor='#cbd5e1'; pz.style.background='#f8fafc'; }
        document.getElementById('book-form-title').textContent = 'Kitaaba Haaraa Dabaluu';
        document.getElementById('book-cancel-edit').style.display = 'none';
    }

    deleteBook(id) {
        if (!confirm('Kitaaba kana dhugumaan haquu barbaaddaa?')) return;
        this.books = this.books.filter(b => b.id !== id);
        this.saveBooks(); this.renderBooks();
        this.showMsg('Kitaabni haqameera!', 'success');
    }

    toggleStatus(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;
        book.status = book.status === 'published' ? 'draft' : 'published';
        this.saveBooks(); this.renderBooks();
        this.showMsg(book.status === 'published' ? 'Published!' : 'Draft!', 'success');
    }

    renderBooks() {
        // ── Admin table ──────────────────────────────────────
        const tbody = document.getElementById('books-list');
        if (tbody) {
            tbody.innerHTML = '';
            if (this.books.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:2rem;">Kitaabni hin jiru. Kitaaba haaraa dabalaa!</td></tr>';
            } else {
                this.books.forEach(book => {
                    const tr = document.createElement('tr');
                    const coverHtml = book.cover
                        ? '<img src="' + book.cover + '" style="width:40px;height:52px;object-fit:cover;border-radius:4px;">'
                        : '<div style="width:40px;height:52px;background:#e0e7ff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📚</div>';
                    const stockColor = book.stock === 'available' ? '#dcfce7' : '#fee2e2';
                    const stockText  = book.stock === 'available' ? '#166534' : '#dc2626';
                    const stockLabel = book.stock === 'available' ? 'Available' : 'Out of Stock';
                    const statusClass = book.status === 'published' ? 'status-published' : 'status-draft';
                    const toggleLabel = book.status === 'published' ? 'Unpublish' : 'Publish';
                    const toggleClass = book.status === 'published' ? 'btn-secondary' : 'btn-success';
                    const pdfCell = book.pdfName
                        ? '<span style="color:#059669;font-size:0.8rem;">📄 ' + book.pdfName + '</span>'
                        : '<span style="color:#94a3b8;font-size:0.8rem;">No PDF</span>';
                    tr.innerHTML = '<td>' + coverHtml + '</td>'
                        + '<td><strong>' + book.title + '</strong><br><small style="color:#64748b;">' + (book.author || '') + '</small></td>'
                        + '<td><span style="color:#059669;font-weight:700;">ETB ' + book.priceEtb.toLocaleString() + '</span><br>'
                        + '<span style="color:#2563eb;font-size:0.85rem;">$' + book.priceUsd.toFixed(2) + '</span></td>'
                        + '<td><span style="background:' + stockColor + ';color:' + stockText + ';padding:2px 8px;border-radius:12px;font-size:0.78rem;font-weight:600;">' + stockLabel + '</span></td>'
                        + '<td>' + pdfCell + '</td>'
                        + '<td><span class="status-badge ' + statusClass + '">' + book.status + '</span></td>'
                        + '<td class="action-buttons">'
                        + '<button class="btn btn-small btn-warning" onclick="window.bookSeller.editBook(' + book.id + ')">✏️ Edit</button>'
                        + '<button class="btn btn-small btn-danger" onclick="window.bookSeller.deleteBook(' + book.id + ')">🗑️ Delete</button>'
                        + '<button class="btn btn-small ' + toggleClass + '" onclick="window.bookSeller.toggleStatus(' + book.id + ')">' + toggleLabel + '</button>'
                        + '</td>';
                    tbody.appendChild(tr);
                });
            }
        }

        // ── Public store grid ────────────────────────────────
        const grid = document.getElementById('books-store-grid');
        if (grid) {
            const published = this.books.filter(b => b.status === 'published');
            grid.innerHTML = '';
            if (published.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#94a3b8;">'
                    + '<div style="font-size:3rem;margin-bottom:1rem;">📚</div>'
                    + '<p style="font-size:1.1rem;">Kitaabni hin jiru. Deebi\'aa ilaalaa!</p></div>';
                return;
            }
            published.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                const coverHtml = book.cover
                    ? '<img src="' + book.cover + '" alt="' + book.title + '" class="book-cover-img">'
                    : '<div class="book-cover-placeholder">📚</div>';
                const stockClass = book.stock === 'available' ? 'in-stock' : 'out-stock';
                const stockLabel = book.stock === 'available' ? '✅ Available' : '❌ Out of Stock';
                const authorHtml = book.author ? '<p class="book-author">✍️ ' + book.author + '</p>' : '';
                const desc = book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description;
                const pdfBtn = book.pdf
                    ? '<button class="btn-book-pdf" onclick="window.bookSeller.previewPdf(' + book.id + ')">📄 Preview PDF</button>'
                    : '';
                card.innerHTML = '<div class="book-cover-wrap">' + coverHtml
                    + '<span class="book-stock-badge ' + stockClass + '">' + stockLabel + '</span></div>'
                    + '<div class="book-info">'
                    + '<span class="book-category-tag">' + book.category + '</span>'
                    + '<h3 class="book-title">' + book.title + '</h3>'
                    + authorHtml
                    + '<p class="book-desc">' + desc + '</p>'
                    + '<div class="book-prices">'
                    + '<span class="price-etb">ETB ' + book.priceEtb.toLocaleString() + '</span>'
                    + '<span class="price-usd">$' + book.priceUsd.toFixed(2) + '</span>'
                    + '</div>'
                    + '<div class="book-actions">'
                    + pdfBtn
                    + '<button class="btn-book-buy" onclick="window.bookSeller.orderBook(' + book.id + ')">🛒 Order Now</button>'
                    + '</div></div>';
                grid.appendChild(card);
            });
        }
    }

    previewPdf(id) {
        const book = this.books.find(b => b.id === id);
        if (!book || !book.pdf) return;
        const existing = document.getElementById('pdf-modal');
        if (existing) existing.remove();
        const modal = document.createElement('div');
        modal.id = 'pdf-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;';
        modal.innerHTML = '<div style="width:100%;max-width:900px;background:white;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;height:90vh;">'
            + '<div style="background:#1e293b;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;">'
            + '<span style="color:white;font-weight:600;">📄 ' + (book.pdfName || book.title) + '</span>'
            + '<button onclick="document.getElementById(\'pdf-modal\').remove()" style="background:#dc2626;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;">✕ Close</button>'
            + '</div>'
            + '<iframe src="' + book.pdf + '" style="flex:1;border:none;width:100%;"></iframe>'
            + '</div>';
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.body.appendChild(modal);
    }

    orderBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        // ── Payment details ──────────────────────────────────
        const TELEBIRR = '0917123477';
        const BINANCE  = '1236587644';

        const existing = document.getElementById('order-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'order-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';

        const coverImg = book.cover
            ? '<img src="' + book.cover + '" style="width:60px;height:80px;object-fit:cover;border-radius:8px;flex-shrink:0;">'
            : '<div style="width:60px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;">📚</div>';

        const authorLine = book.author ? '<p style="margin:0 0 8px;color:#64748b;font-size:0.82rem;">✍️ ' + book.author + '</p>' : '';

        // Contact section
        let contactSection = '';
        if (book.contact) {
            const isEmail = book.contact.indexOf('@') !== -1;
            const actionBtn = isEmail
                ? '<a href="mailto:' + book.contact + '?subject=Order: ' + encodeURIComponent(book.title) + '" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#059669;color:white;padding:9px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.88rem;">📧 Send Email Order</a>'
                : '<a href="tel:' + book.contact + '" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#059669;color:white;padding:9px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.88rem;">📞 Call Seller</a>';
            contactSection = '<div style="border:2px solid #e2e8f0;border-radius:14px;margin-bottom:1rem;overflow:hidden;">'
                + '<div style="background:linear-gradient(135deg,#059669,#047857);padding:10px 16px;display:flex;align-items:center;gap:10px;">'
                + '<span style="font-size:1.6rem;">📞</span>'
                + '<div><p style="margin:0;color:white;font-weight:800;font-size:0.95rem;">Direct Contact</p>'
                + '<p style="margin:0;color:rgba(255,255,255,0.8);font-size:0.75rem;">Call or message the seller</p></div></div>'
                + '<div style="padding:14px 16px;background:#f0fdf4;">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;background:white;border:1.5px solid #bbf7d0;border-radius:10px;padding:10px 14px;margin-bottom:10px;">'
                + '<div><p style="margin:0;font-size:1.05rem;font-weight:700;color:#166534;">' + book.contact + '</p>'
                + '<p style="margin:0;font-size:0.75rem;color:#4ade80;">Seller Contact</p></div>'
                + '<button onclick="navigator.clipboard.writeText(\'' + book.contact + '\').then(function(){var b=document.activeElement;b.textContent=\'✅ Copied!\';b.style.background=\'#059669\';setTimeout(function(){b.textContent=\'📋 Copy\';b.style.background=\'#e0e7ff\';b.style.color=\'#3730a3\';},2000);})" style="background:#e0e7ff;color:#3730a3;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:700;font-family:inherit;">📋 Copy</button>'
                + '</div>' + actionBtn + '</div></div>';
        }

        modal.innerHTML = '<div style="background:white;border-radius:20px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.35);">'

            // Header
            + '<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:1.25rem 1.5rem;border-radius:20px 20px 0 0;display:flex;justify-content:space-between;align-items:center;">'
            + '<div><h3 style="margin:0;color:white;font-size:1.1rem;">🛒 Order Book</h3>'
            + '<p style="margin:0;color:#94a3b8;font-size:0.82rem;">' + book.title + '</p></div>'
            + '<button onclick="document.getElementById(\'order-modal\').remove()" style="background:rgba(255,255,255,0.12);border:none;color:white;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem;">✕</button>'
            + '</div>'

            + '<div style="padding:1.5rem;">'

            // Book summary
            + '<div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.5rem;background:#f8fafc;padding:1rem;border-radius:12px;border:1px solid #e2e8f0;">'
            + coverImg
            + '<div style="flex:1;"><p style="margin:0 0 4px;font-weight:700;color:#0f172a;font-size:0.95rem;">' + book.title + '</p>'
            + authorLine
            + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'
            + '<span style="font-size:1.2rem;font-weight:800;color:#059669;">ETB ' + book.priceEtb.toLocaleString() + '</span>'
            + '<span style="background:#dbeafe;color:#1d4ed8;padding:3px 10px;border-radius:8px;font-size:0.85rem;font-weight:700;">$' + book.priceUsd.toFixed(2) + '</span>'
            + '</div></div></div>'

            // Step 1
            + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:1.25rem;">'
            + '<div style="width:24px;height:24px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0;">1</div>'
            + '<p style="margin:0;font-weight:700;color:#0f172a;font-size:0.95rem;">Choose Payment Method</p></div>'

            // TeleBirr
            + '<div style="border:2px solid #fed7aa;border-radius:14px;margin-bottom:1rem;overflow:hidden;">'
            + '<div style="background:linear-gradient(135deg,#ff6b00,#ff8c00);padding:10px 16px;display:flex;align-items:center;gap:10px;">'
            + '<span style="font-size:1.6rem;">📱</span>'
            + '<div><p style="margin:0;color:white;font-weight:800;font-size:0.95rem;">TeleBirr</p>'
            + '<p style="margin:0;color:rgba(255,255,255,0.85);font-size:0.75rem;">Ethio Telecom Mobile Payment</p></div>'
            + '<span style="margin-left:auto;background:rgba(255,255,255,0.2);color:white;padding:2px 10px;border-radius:12px;font-size:0.72rem;font-weight:700;">ETB</span>'
            + '</div>'
            + '<div style="padding:14px 16px;background:#fff7ed;">'
            + '<p style="margin:0 0 8px;color:#7c2d12;font-size:0.82rem;font-weight:600;">📲 Send ETB ' + book.priceEtb.toLocaleString() + ' to this TeleBirr number:</p>'
            + '<div style="display:flex;align-items:center;justify-content:space-between;background:white;border:1.5px solid #fed7aa;border-radius:10px;padding:10px 14px;margin-bottom:10px;">'
            + '<div><p style="margin:0;font-size:1.3rem;font-weight:800;color:#ea580c;letter-spacing:2px;font-family:Courier New,monospace;">' + TELEBIRR + '</p>'
            + '<p style="margin:0;font-size:0.75rem;color:#9a3412;">TeleBirr Account Number</p></div>'
            + '<button onclick="navigator.clipboard.writeText(\'' + TELEBIRR + '\').then(function(){var b=document.activeElement;b.textContent=\'✅ Copied!\';b.style.background=\'#059669\';setTimeout(function(){b.textContent=\'📋 Copy\';b.style.background=\'#e0e7ff\';b.style.color=\'#3730a3\';},2000);})" style="background:#e0e7ff;color:#3730a3;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:700;font-family:inherit;white-space:nowrap;">📋 Copy</button>'
            + '</div>'
            + '<a href="tel:' + TELEBIRR + '" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#ea580c;color:white;padding:9px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.88rem;">📞 Call / Send via TeleBirr</a>'
            + '</div></div>'

            // Binance
            + '<div style="border:2px solid rgba(240,185,11,0.4);border-radius:14px;margin-bottom:1rem;overflow:hidden;">'
            + '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:10px 16px;display:flex;align-items:center;gap:10px;">'
            + '<span style="font-size:1.6rem;">🪙</span>'
            + '<div><p style="margin:0;color:#f0b90b;font-weight:800;font-size:0.95rem;">Binance Pay</p>'
            + '<p style="margin:0;color:rgba(255,255,255,0.7);font-size:0.75rem;">Crypto / USDT Payment</p></div>'
            + '<span style="margin-left:auto;background:rgba(240,185,11,0.2);color:#f0b90b;padding:2px 10px;border-radius:12px;font-size:0.72rem;font-weight:700;">USD</span>'
            + '</div>'
            + '<div style="padding:14px 16px;background:#0d0d1a;">'
            + '<p style="margin:0 0 8px;color:#94a3b8;font-size:0.82rem;font-weight:600;">💵 Send $' + book.priceUsd.toFixed(2) + ' USDT to this Binance Pay ID:</p>'
            + '<div style="display:flex;align-items:center;justify-content:space-between;background:#1a1a2e;border:1.5px solid rgba(240,185,11,0.3);border-radius:10px;padding:10px 14px;margin-bottom:10px;">'
            + '<div><p style="margin:0;font-size:1.3rem;font-weight:800;color:#f0b90b;letter-spacing:2px;font-family:Courier New,monospace;">' + BINANCE + '</p>'
            + '<p style="margin:0;font-size:0.75rem;color:#64748b;">Binance Pay ID</p></div>'
            + '<button onclick="navigator.clipboard.writeText(\'' + BINANCE + '\').then(function(){var b=document.activeElement;b.textContent=\'✅ Copied!\';b.style.background=\'#059669\';setTimeout(function(){b.textContent=\'📋 Copy\';b.style.background=\'#1a1a2e\';b.style.color=\'#f0b90b\';},2000);})" style="background:#1a1a2e;color:#f0b90b;border:1.5px solid rgba(240,185,11,0.4);padding:6px 14px;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:700;font-family:inherit;white-space:nowrap;">📋 Copy</button>'
            + '</div>'
            + '<div style="background:#1a1a2e;border:1px solid rgba(240,185,11,0.2);border-radius:8px;padding:8px 12px;">'
            + '<p style="margin:0;color:#94a3b8;font-size:0.75rem;line-height:1.6;">⚠️ Open Binance app → Pay → Send → Enter ID <strong style="color:#f0b90b;">' + BINANCE + '</strong> → Enter USDT amount</p>'
            + '</div></div></div>'

            // Seller contact
            + contactSection

            // Step 2 note
            + '<div style="background:#fefce8;border:1.5px solid #fde047;border-radius:10px;padding:12px 14px;margin-bottom:1.25rem;">'
            + '<div style="display:flex;align-items:flex-start;gap:8px;">'
            + '<div style="width:24px;height:24px;background:#ca8a04;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:700;flex-shrink:0;margin-top:1px;">2</div>'
            + '<div><p style="margin:0;font-weight:700;color:#713f12;font-size:0.88rem;">After Payment</p>'
            + '<p style="margin:0;color:#92400e;font-size:0.8rem;margin-top:3px;line-height:1.5;">Send your payment screenshot to the seller. Your book will be delivered after payment is confirmed. ✅</p>'
            + '</div></div></div>'

            // Close button
            + '<button onclick="document.getElementById(\'order-modal\').remove()" style="width:100%;background:#f1f5f9;color:#374151;border:none;padding:11px;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.9rem;font-family:inherit;">Close</button>'

            + '</div></div>';

        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.body.appendChild(modal);
    }

    saveBooks() {
        localStorage.setItem('clickict_books', JSON.stringify(this.books));
    }

    showMsg(msg, type) {
        const container = document.getElementById('book-message-container') || document.getElementById('message-container');
        if (!container) return;
        const div = document.createElement('div');
        div.className = 'message message-' + type;
        div.textContent = msg;
        container.appendChild(div);
        setTimeout(function() { div.remove(); }, 4000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.bookSeller = new BookSeller();
});

// Clear cover upload
function clearCover() {
    const input   = document.getElementById('book-cover');
    const preview = document.getElementById('cover-preview');
    const zone    = document.getElementById('cover-upload-zone');
    if (input)   input.value = '';
    if (preview) preview.innerHTML = '';
    if (zone)    { zone.style.borderColor = '#cbd5e1'; zone.style.background = '#f8fafc'; }
    if (window.bookSeller && window.bookSeller.editingId) {
        const idx = window.bookSeller.books.findIndex(function(b) { return b.id === window.bookSeller.editingId; });
        if (idx !== -1) window.bookSeller.books[idx].cover = '';
    }
}

// Clear PDF upload
function clearPdf() {
    const input = document.getElementById('book-pdf');
    const info  = document.getElementById('pdf-info');
    const zone  = document.getElementById('pdf-upload-zone');
    if (input) input.value = '';
    if (info)  info.style.display = 'none';
    if (zone)  { zone.style.borderColor = '#cbd5e1'; zone.style.background = '#f8fafc'; }
    if (window.bookSeller && window.bookSeller.editingId) {
        const idx = window.bookSeller.books.findIndex(function(b) { return b.id === window.bookSeller.editingId; });
        if (idx !== -1) { window.bookSeller.books[idx].pdf = ''; window.bookSeller.books[idx].pdfName = ''; }
    }
}
