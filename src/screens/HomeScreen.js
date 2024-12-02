import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        Alert.alert(
          'Location Error',
          'Unable to get your location. Please check your settings and try again.'
        );
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FINDPARENTROOMS</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : userLocation ? (
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
              }}
              title="You are here"
              description="Your current location"
            />
          </MapView>
        ) : (
          <Text style={styles.errorText}>Unable to load map</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={getCurrentLocation}
      >
        <Text style={styles.refreshButtonText}>Refresh Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;