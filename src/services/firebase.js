import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
    apiKey: "AIzaSyBbRHkvnTASQm8i8MklNxASakWntdzJpro",
    authDomain: "parentroomsapp.firebaseapp.com",
    projectId: "parentroomsapp",
    storageBucket: "parentroomsapp.firebasestorage.app",
    messagingSenderId: "851979742399",
    appId: "1:851979742399:web:312f89cb5c93f0789daa0a",
    measurementId: "G-9Y47CEXWBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Configure Google Sign In with your client ID
GoogleSignin.configure({
  webClientId: '571273218624-h7qej71o2pruq42ikhj9u2tp32sm9vt7.apps.googleusercontent.com',
  iosClientId: '571273218624-h7qej71o2pruq42ikhj9u2tp32sm9vt7.apps.googleusercontent.com', // Using same client ID for iOS
});

export { auth, GoogleSignin };