/**
 * ============================================================================
 * lvlBase - Firebase Configuration & Service Layer
 * ============================================================================
 * Replace the placeholder config values with your actual Firebase project
 * credentials from: https://console.firebase.google.com/
 * 
 * Setup steps:
 * 1. Go to Firebase Console → Project Settings → General
 * 2. Scroll to "Your apps" → Web app → Config
 * 3. Copy and paste the config object below
 */

// Firebase Configuration - Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
    onSnapshot,
    orderBy,
    limit
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import {
    getAnalytics,
    logEvent
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics = null;

// Initialize Analytics only in production (not on localhost)
try {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        analytics = getAnalytics(app);
    }
} catch (e) {
    console.log('Analytics not available:', e.message);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

/**
 * ============================================================================
 * Firebase Service Object
 * ============================================================================
 * Centralised service layer for all Firebase operations. Import this in your
 * page scripts to access auth and Firestore functionality.
 */
const firebaseService = {
    auth,
    db,
    analytics,

    // ─── AUTH METHODS ─────────────────────────────────────────────────────────

    /** Sign in with email and password */
    async signIn(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    },

    /** Create a new user account */
    async register(email, password) {
        return await createUserWithEmailAndPassword(auth, email, password);
    },

    /** Sign in with Google popup */
    async signInWithGoogle() {
        return await signInWithPopup(auth, googleProvider);
    },

    /** Sign out the current user */
    async signOut() {
        return await signOut(auth);
    },

    /** Send password reset email */
    async resetPassword(email) {
        return await sendPasswordResetEmail(auth, email);
    },

    /** Send email verification to current user */
    async verifyEmail() {
        if (auth.currentUser) {
            return await sendEmailVerification(auth.currentUser);
        }
        throw new Error('No user is currently signed in.');
    },

    /** Update user display name and/or photo */
    async updateUserProfile(displayName, photoURL) {
        if (auth.currentUser) {
            return await updateProfile(auth.currentUser, { displayName, photoURL });
        }
        throw new Error('No user is currently signed in.');
    },

    /** Subscribe to auth state changes */
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    },

    /** Get current user or null */
    getCurrentUser() {
        return auth.currentUser;
    },

    // ─── FIRESTORE METHODS ────────────────────────────────────────────────────

    /** Get a single document by path */
    async getDocument(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },

    /** Set/overwrite a document */
    async setDocument(collectionName, docId, data) {
        const docRef = doc(db, collectionName, docId);
        return await setDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    },

    /** Update specific fields in a document */
    async updateDocument(collectionName, docId, data) {
        const docRef = doc(db, collectionName, docId);
        return await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    },

    /** Add a new document with auto-generated ID */
    async addDocument(collectionName, data) {
        const colRef = collection(db, collectionName);
        return await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
    },

    /** Query documents with optional filters */
    async queryDocuments(collectionName, filters = [], orderByField = null, limitCount = null) {
        let q = collection(db, collectionName);
        const constraints = [];
        filters.forEach(([field, op, value]) => constraints.push(where(field, op, value)));
        if (orderByField) constraints.push(orderBy(orderByField));
        if (limitCount) constraints.push(limit(limitCount));
        if (constraints.length > 0) q = query(q, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    /** Listen to real-time document updates */
    listenToDocument(collectionName, docId, callback) {
        const docRef = doc(db, collectionName, docId);
        return onSnapshot(docRef, (snap) => {
            callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        });
    },

    // ─── USER PROFILE METHODS ─────────────────────────────────────────────────

    /** Create or update a user profile in Firestore */
    async saveUserProfile(uid, profileData) {
        return await this.setDocument('users', uid, profileData);
    },

    /** Fetch a user profile from Firestore */
    async getUserProfile(uid) {
        return await this.getDocument('users', uid);
    },

    /** Get user role from Firestore */
    async getUserRole(uid) {
        const profile = await this.getUserProfile(uid);
        return profile ? profile.role : null;
    },

    // ─── ANALYTICS METHODS ────────────────────────────────────────────────────

    /** Log an analytics event */
    logEvent(eventName, params = {}) {
        if (analytics) {
            logEvent(analytics, eventName, params);
        }
    },

    // ─── ROUTING HELPERS ──────────────────────────────────────────────────────

    /**
     * Route user to the correct dashboard based on their role.
     * The `basePath` parameter adjusts relative paths (e.g., '../' from /pages/).
     */
    routeByRole(role, basePath = '') {
        const routes = {
            student: `${basePath}school/students/dashboard.html`,
            teacher: `${basePath}school/teachers/dashboard.html`,
            parent:  `${basePath}school/parents/dashboard.html`,
            admin:   `${basePath}school/admin/dashboard.html`,
        };
        const destination = routes[role] || `${basePath}index.html`;
        window.location.href = destination;
    }
};

export { firebaseService, auth, db, googleProvider };
export default firebaseService;
