import { firebaseApp } from './firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

export const auth = getAuth(firebaseApp);

console.log(auth.currentUser);

export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.error('got creds', credential);
  } catch(error) {
    console.error('Login failed:', error);
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch(error) {
    console.log('signout error', error);
  }
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}