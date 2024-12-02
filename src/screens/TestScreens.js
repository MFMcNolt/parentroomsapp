import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, GoogleSignin } from '../services/firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const TestScreen = () => {
  const testGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign In test...');
      
      // Check Google Play Services
      await GoogleSignin.hasPlayServices();
      console.log('Play Services check passed');
      
      // Attempt sign in
      const { idToken } = await GoogleSignin.signIn();
      console.log('Got ID token from Google');
      
      // Create credential
      const credential = GoogleAuthProvider.credential(idToken);
      console.log('Created Google credential');
      
      // Sign in with Firebase
      const userCredential = await signInWithCredential(auth, credential);
      console.log('Successfully signed in with Firebase:', userCredential.user.email);
      
    } catch (error) {
      console.error('Sign In Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test Screen</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={testGoogleSignIn}
      >
        <Text style={styles.buttonText}>Test Google Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TestScreen;