import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  getDocFromServer,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase with applet configuration
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: Required for specific firestoreDatabaseId */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection as per skill instructions
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or initial probe:', error.message);
    }
  }
}
testConnection();

export interface LeaderboardRecord {
  id?: string;
  playerName: string;
  score: number;
  distance: number;
  coins: number;
  correctAnswers?: number;
  checkpointsCleared?: number;
  outfit?: string;
  userId?: string;
  createdAt?: Timestamp | Date | string;
}

// Generate a random clean alphanumeric ID conforming to ^[a-zA-Z0-9_\-]+$
function generateEntryId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = 'run_' + Date.now().toString(36) + '_';
  for (let i = 0; i < 8; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// Save a new score run to the global leaderboard
export async function saveScoreToLeaderboard(record: Omit<LeaderboardRecord, 'id' | 'createdAt'>): Promise<string> {
  const entryId = generateEntryId();
  const path = `leaderboard/${entryId}`;
  try {
    const docRef = doc(db, 'leaderboard', entryId);
    await setDoc(docRef, {
      playerName: record.playerName.trim().slice(0, 32) || 'Pelari SMP',
      score: Math.max(0, Math.floor(record.score)),
      distance: Math.max(0, Math.floor(record.distance)),
      coins: Math.max(0, Math.floor(record.coins)),
      correctAnswers: record.correctAnswers ? Math.max(0, Math.floor(record.correctAnswers)) : 0,
      checkpointsCleared: record.checkpointsCleared ? Math.max(0, Math.floor(record.checkpointsCleared)) : 0,
      outfit: record.outfit || 'smp',
      ...(auth.currentUser ? { userId: auth.currentUser.uid } : {}),
      createdAt: serverTimestamp(),
    });
    return entryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return '';
  }
}

// Subscribe to real-time top global scores
export function subscribeToLeaderboard(
  callback: (records: LeaderboardRecord[]) => void,
  limitCount = 30
): () => void {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(limitCount));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: LeaderboardRecord[] = [];
        snapshot.forEach((d) => {
          records.push({
            id: d.id,
            ...(d.data() as Omit<LeaderboardRecord, 'id'>),
          });
        });
        callback(records);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (error) {
    console.error('Google Sign-in error:', error);
    return null;
  }
}

// Sign out
export async function logOut(): Promise<void> {
  await signOut(auth);
}
