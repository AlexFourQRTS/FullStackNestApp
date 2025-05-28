// Mock Firebase implementation - no authentication required
// This allows the app to work without Firebase credentials

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Mock auth object
export const auth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
};

export const signInWithGoogle = () => {
  return Promise.resolve();
};

export const handleRedirectResult = () => {
  return Promise.resolve(null);
};

export const logOut = () => {
  return Promise.resolve();
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Always call with null user (not authenticated)
  callback(null);
  // Return unsubscribe function
  return () => {};
};