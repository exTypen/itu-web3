import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  addDoc 
} from "firebase/firestore";
import * as dotenv from "dotenv";
import { Wallet, Pool } from "../types/types.js";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchDocs<T>(collectionName: string): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    return [];
  }
}

async function fetchDocByQuery<T>(
  collectionName: string, 
  fieldName: string, 
  value: string
): Promise<T | null> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(fieldName, "==", value));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as T;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    return null;
  }
}

async function updateDocument(
  collectionName: string, 
  docId: string, 
  data: Partial<Wallet | Pool>
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
}

async function addDocument(
  collectionName: string, 
  data: Partial<Wallet | Pool>
): Promise<boolean> {
  try {
    const collectionRef = collection(db, collectionName);
    const result = await addDoc(collectionRef, data);
    const id = result.id;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { id });
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return false;
  }
}

export { fetchDocs, fetchDocByQuery, updateDocument, addDocument }; 