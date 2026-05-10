import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { OperationType, handleFirestoreError } from '../lib/error-handler';

const COLLECTION_NAME = 'users';

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const path = `${COLLECTION_NAME}/${uid}`;
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async ensureProfile(uid: string, email: string, displayName: string): Promise<UserProfile> {
    const existing = await this.getProfile(uid);
    const isAdminEmail = email === 'ocw1202@gmail.com';
    
    if (existing) {
      if (isAdminEmail && existing.role !== 'admin') {
        // Correct the role if needed
        const updated = { ...existing, role: 'admin' as const };
        await setDoc(doc(db, COLLECTION_NAME, uid), updated);
        return updated;
      }
      return existing;
    }

    const path = `${COLLECTION_NAME}/${uid}`;
    try {
      const newProfile: UserProfile = {
        uid,
        email,
        displayName,
        role: isAdminEmail ? 'admin' : 'customer',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, COLLECTION_NAME, uid), newProfile);
      return newProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  }
};
