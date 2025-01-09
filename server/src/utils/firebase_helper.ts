import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  addDoc,
  setDoc,
  getDoc
} from "firebase/firestore";
import * as dotenv from "dotenv";
import { Wallet, Pool } from "../types/types";

dotenv.config();

export class FirebaseHelper {
  private firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  private app = initializeApp(this.firebaseConfig);
  private db = getFirestore(this.app);

  async fetchDocs<T>(collectionName: string): Promise<T[]> {
    try {
      const collectionRef = collection(this.db, collectionName);
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

  async fetchDocByQuery<T>(
    collectionName: string, 
    fieldName: string, 
    value: string
  ): Promise<T | null> {
    try {
      const collectionRef = collection(this.db, collectionName);
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

  async updateDocument(
    collectionName: string, 
    docId: string, 
    data: Partial<any>
  ): Promise<boolean> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return false;
    }
  }

  async addDocument(
    collectionName: string, 
    data: Partial<any>
  ): Promise<boolean> {
    try {
      const collectionRef = collection(this.db, collectionName);
      const result = await addDoc(collectionRef, data);
      const id = result.id;
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, { id });
      return true;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return false;
    }
  }

  async setDocument(
    collectionName: string, 
    data: Partial<any>,
    customId?: string 
  ): Promise<boolean> {
    try {
      const id = customId || crypto.randomUUID(); // Custom ID veya otomatik UUID
      const docRef = doc(this.db, collectionName, id);
      await setDoc(docRef, data);
      return true;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      return false;
    }
  }

  async fetchDoc<T>(collection: string, docId: string): Promise<T | null> {
    const docRef = doc(this.db, collection, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  }
}
