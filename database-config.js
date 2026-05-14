// ClickICT Database Manager
// Currently uses localStorage as the storage backend.
// To upgrade to Firebase or Supabase, fill in the credentials below
// and load the corresponding SDK in your HTML before this script.

class DatabaseManager {
    constructor() {
        this.dbType = 'localStorage';
        this.isConnected = false;

        // --- Firebase config (optional) ---
        // Replace placeholder values with real credentials to enable Firebase.
        this.firebaseConfig = {
            apiKey:            "YOUR_FIREBASE_API_KEY",
            authDomain:        "YOUR_PROJECT.firebaseapp.com",
            projectId:         "YOUR_PROJECT_ID",
            storageBucket:     "YOUR_PROJECT.appspot.com",
            messagingSenderId: "YOUR_SENDER_ID",
            appId:             "YOUR_FIREBASE_APP_ID"
        };

        // --- Supabase config (optional) ---
        // Replace placeholder values with real credentials to enable Supabase.
        this.supabaseConfig = {
            url:     "YOUR_SUPABASE_URL",
            anonKey: "YOUR_SUPABASE_ANON_KEY"
        };

        // Detect whether credentials are real
        this._firebaseConfigured = (
            this.firebaseConfig.apiKey    !== "YOUR_FIREBASE_API_KEY" &&
            this.firebaseConfig.projectId !== "YOUR_PROJECT_ID"
        );
        this._supabaseConfigured = (
            this.supabaseConfig.url     !== "YOUR_SUPABASE_URL" &&
            this.supabaseConfig.anonKey !== "YOUR_SUPABASE_ANON_KEY"
        );

        this.init();
    }

    async init() {
        await this.connectToDatabase();
    }

    async connectToDatabase() {
        if (this._firebaseConfigured && await this.connectFirebase()) {
            this.dbType = 'firebase';
            console.log('[DB] Connected to Firebase');
            return;
        }

        if (this._supabaseConfigured && await this.connectSupabase()) {
            this.dbType = 'supabase';
            console.log('[DB] Connected to Supabase');
            return;
        }

        // Default: localStorage
        this.dbType = 'localStorage';
        this.isConnected = true;
        console.log('[DB] Using localStorage');
    }

    async connectFirebase() {
        try {
            if (typeof firebase === 'undefined') return false;
            firebase.initializeApp(this.firebaseConfig);
            this.firebaseDb = firebase.firestore();
            this.isConnected = true;
            return true;
        } catch (e) {
            console.warn('[DB] Firebase connection failed:', e);
            return false;
        }
    }

    async connectSupabase() {
        try {
            if (typeof supabase === 'undefined') return false;
            this.supabaseClient = supabase.createClient(
                this.supabaseConfig.url,
                this.supabaseConfig.anonKey
            );
            this.isConnected = true;
            return true;
        } catch (e) {
            console.warn('[DB] Supabase connection failed:', e);
            return false;
        }
    }

    // ─── Generic CRUD ────────────────────────────────────────────────────────

    async create(collection, data) {
        try {
            if (this.dbType === 'firebase')    return await this.firebaseCreate(collection, data);
            if (this.dbType === 'supabase')    return await this.supabaseCreate(collection, data);
            return this.localStorageCreate(collection, data);
        } catch (e) {
            console.error('[DB] create error:', e);
            return { success: false, error: e };
        }
    }

    async read(collection, id = null) {
        try {
            if (this.dbType === 'firebase')    return await this.firebaseRead(collection, id);
            if (this.dbType === 'supabase')    return await this.supabaseRead(collection, id);
            return this.localStorageRead(collection, id);
        } catch (e) {
            console.error('[DB] read error:', e);
            return { success: false, error: e };
        }
    }

    async update(collection, id, data) {
        try {
            if (this.dbType === 'firebase')    return await this.firebaseUpdate(collection, id, data);
            if (this.dbType === 'supabase')    return await this.supabaseUpdate(collection, id, data);
            return this.localStorageUpdate(collection, id, data);
        } catch (e) {
            console.error('[DB] update error:', e);
            return { success: false, error: e };
        }
    }

    async delete(collection, id) {
        try {
            if (this.dbType === 'firebase')    return await this.firebaseDelete(collection, id);
            if (this.dbType === 'supabase')    return await this.supabaseDelete(collection, id);
            return this.localStorageDelete(collection, id);
        } catch (e) {
            console.error('[DB] delete error:', e);
            return { success: false, error: e };
        }
    }

    // ─── Firebase ────────────────────────────────────────────────────────────

    async firebaseCreate(collection, data) {
        const ref = await this.firebaseDb.collection(collection).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, id: ref.id, data };
    }

    async firebaseRead(collection, id = null) {
        if (id) {
            const doc = await this.firebaseDb.collection(collection).doc(id).get();
            if (!doc.exists) return { success: false, error: 'Not found' };
            return { success: true, data: { id: doc.id, ...doc.data() } };
        }
        const snap = await this.firebaseDb.collection(collection).get();
        return { success: true, data: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
    }

    async firebaseUpdate(collection, id, data) {
        await this.firebaseDb.collection(collection).doc(id).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, id, data };
    }

    async firebaseDelete(collection, id) {
        await this.firebaseDb.collection(collection).doc(id).delete();
        return { success: true, id };
    }

    // ─── Supabase ────────────────────────────────────────────────────────────

    async supabaseCreate(collection, data) {
        const { data: result, error } = await this.supabaseClient
            .from(collection).insert([data]).select();
        if (error) throw error;
        return { success: true, data: result[0] };
    }

    async supabaseRead(collection, id = null) {
        let q = this.supabaseClient.from(collection).select('*');
        if (id) q = q.eq('id', id).single();
        const { data, error } = await q;
        if (error) throw error;
        return { success: true, data };
    }

    async supabaseUpdate(collection, id, data) {
        const { data: result, error } = await this.supabaseClient
            .from(collection).update(data).eq('id', id).select();
        if (error) throw error;
        return { success: true, data: result[0] };
    }

    async supabaseDelete(collection, id) {
        const { error } = await this.supabaseClient
            .from(collection).delete().eq('id', id);
        if (error) throw error;
        return { success: true, id };
    }

    // ─── localStorage ────────────────────────────────────────────────────────

    localStorageCreate(collection, data) {
        const items = this._lsGet(collection);
        const newItem = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.unshift(newItem);
        this._lsSet(collection, items);
        return { success: true, data: newItem };
    }

    localStorageRead(collection, id = null) {
        const items = this._lsGet(collection);
        if (id) {
            const item = items.find(i => i.id == id);
            return item
                ? { success: true, data: item }
                : { success: false, error: 'Item not found' };
        }
        return { success: true, data: items };
    }

    localStorageUpdate(collection, id, data) {
        const items = this._lsGet(collection);
        const idx = items.findIndex(i => i.id == id);
        if (idx === -1) return { success: false, error: 'Item not found' };
        items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
        this._lsSet(collection, items);
        return { success: true, data: items[idx] };
    }

    localStorageDelete(collection, id) {
        const items = this._lsGet(collection).filter(i => i.id != id);
        this._lsSet(collection, items);
        return { success: true, id };
    }

    // ─── localStorage helpers ────────────────────────────────────────────────

    _lsGet(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            console.warn('[DB] localStorage parse error for key:', key, e);
            return [];
        }
    }

    _lsSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Likely storage quota exceeded (e.g. too many large base64 images)
            console.error('[DB] localStorage write failed for key:', key, e);
        }
    }

    // ─── Utilities ───────────────────────────────────────────────────────────

    getConnectionStatus() {
        return {
            connected: this.isConnected,
            type: this.dbType,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Returns a map of every localStorage key used by ClickICT and its item count.
     * Useful for debugging data state.
     */
    inspect() {
        const keys = [
            'clickict_posts',
            'clickict_pages',
            'clickict_comments',
            'clickict_users',
            'clickict_settings',
            'clickict_navigation',
            'clickict_social_links',
            'website_content',
            'admin_password',
            'clickict_language'
        ];
        const report = {};
        keys.forEach(k => {
            try {
                const raw = localStorage.getItem(k);
                if (raw === null) { report[k] = '(not set)'; return; }
                const parsed = JSON.parse(raw);
                report[k] = Array.isArray(parsed)
                    ? `${parsed.length} item(s)`
                    : typeof parsed === 'object'
                        ? `object (${Object.keys(parsed).length} keys)`
                        : parsed;
            } catch (e) {
                report[k] = '(parse error)';
            }
        });
        console.table(report);
        return report;
    }

    async testConnection() {
        try {
            const result = await this.create('_db_test', { test: true });
            if (result.success) {
                await this.delete('_db_test', result.data.id);
                return { success: true, type: this.dbType };
            }
            return { success: false, error: 'Test failed' };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}

// Expose globally
window.dbManager = new DatabaseManager();
