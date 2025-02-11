import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithCredential,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, GoogleSignin } from '../services/firebase';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        if (!name.trim()) {
          Alert.alert('Error', 'Please enter your name');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Error',
        error.message.includes('auth/') ? 
          error.message.split('auth/')[1].replace(/-/g, ' ') : 
          'Authentication failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the user ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with credential from the Google user
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>FINDPARENTROOMS</Text>
        
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
            onPress={() => setIsSignUp(false)}
          >
            <Text style={[styles.toggleText, !isSignUp && styles.activeToggleText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isSignUp && styles.activeToggle]}
            onPress={() => setIsSignUp(true)}
          >
            <Text style={[styles.toggleText, isSignUp && styles.activeToggleText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#fff',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AuthScreen;