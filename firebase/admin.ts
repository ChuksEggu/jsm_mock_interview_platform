// Firebase Admin SDK initialization for server-side Firestore/Auth access
// Required env vars (configure in .env.local or deployment env):
// - FIREBASE_PROJECT_ID
// - FIREBASE_CLIENT_EMAIL
// - FIREBASE_PRIVATE_KEY (keep newlines or use \n; code below normalizes)
import {initializeApp, getApps,cert} from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

const initFirebaseAdmin = () => {
    const apps = getApps();

    if(!apps.length){
        initializeApp({
            credential: cert({
                // Strip accidental wrapping quotes and normalize newlines for the private key
                projectId: process.env.FIREBASE_PROJECT_ID?.replace(/^"|"$/g, ""),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.replace(/^"|"$/g, ""),
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, "").replace(/\\n/g, "\n"),
                // projectId: process.env.FIREBASE_PROJECT_ID,
                // clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n")

            }),
        });
    }
    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();