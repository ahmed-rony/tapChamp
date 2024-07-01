import React, { useState, useEffect, useRef } from 'react'; // Add useRef here
import { Animated, View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound'; // Import Sound

const UNIQUE_ID_KEY = 'UNIQUE_USER_ID';
const generateUniqueId = () => {
  return 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2);
};




// Updated FireworkParticle component
const FireworkParticle = ({ offsetX, offsetY, color }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  const moveX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, offsetX]
  });

  const moveY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, offsetY]
  });

  const fadeOut = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1, 0]
  });

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }, [animValue]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 4,
        height: 4,
        backgroundColor: color,
        opacity: fadeOut,
        transform: [{ translateX: moveX }, { translateY: moveY }]
      }}
    />
  );
};

const Winner = () => {
  const [userId, setUserId] = useState('');
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    Sound.setCategory('Playback');
    const congratsSound = new Sound(require('../android/sounds/WinnerEnddd.mp3'), (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      congratsSound.play();
    });

    // Generate unique ID and play sound effect
    const generateAndPlay = async () => {
      await loadUniqueId();
      setShowFireworks(true);

      // Stop the fireworks after a certain duration
      setTimeout(() => setShowFireworks(false), 5000);
    };

    generateAndPlay();

    return () => {
      congratsSound.release();
    };
  }, []);

  const storeUniqueId = async (id) => {
    try {
      await AsyncStorage.setItem(UNIQUE_ID_KEY, id);
    } catch (error) {
      console.error('Error storing the unique ID', error);
    }
  };

  const loadUniqueId = async () => {
    try {
      const savedId = await AsyncStorage.getItem(UNIQUE_ID_KEY);
      if (savedId) {
        setUserId(savedId);
      } else {
        const newId = generateUniqueId();
        setUserId(newId);
        await storeUniqueId(newId);
      }
    } catch (error) {
      console.error('Error loading the unique ID', error);
    }
  };

  // Create an array of particles with different offsets and colors
  const particles = Array.from({ length: 600 }).map((_, index) => {
    const angle = (index / 100) * Math.PI * 2;
    const radius = Math.random() * 100;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    return <FireworkParticle key={index} offsetX={offsetX} offsetY={offsetY} color={color} />;
  });

  return (
    <ImageBackground
      source={require('../android/Images/BackgroundofApp.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.congratsText}>Congratulations! You've completed all the levels!</Text>
        <Text style={styles.userIdText}>Your Unique ID: {userId}</Text>
        <Text style={styles.instructionsText}>Please screenshot this ID and send it to us via X for a prize.</Text>
        <TouchableOpacity onPress={() => {/* Add functionality to copy ID to clipboard */}}>
          <Text style={styles.copyIdText}>Copy ID</Text>
        </TouchableOpacity>
      </View>
      {showFireworks && <View style={styles.fireworksContainer}>{particles}</View>}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Add padding for better readability
  },

  fireworksContainer: {
    position: 'absolute',
    top: '10%',
    left: '30%',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireworkParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  congratsText: {
    marginBottom: 100, // Add some margin to the bottom of the text
    textAlign: 'center', // Center the text
    fontSize: 40, // Increase font size
    fontWeight: 'bold', // Optional: Make it bold
    color:'black',
  },
  userIdText: {
    fontSize: 20, // Increase font size
    marginBottom: 40, // Optional: Add some margin to the bottom of the text\
    color:'black',
  },
  instructionsText: {
    fontSize: 18, // Increase font size
    marginBottom: 20, // Optional: Add some margin to the bottom of the text
    textAlign: 'center', // Center the text
    color:'black',
  },
  copyIdText: {
    fontSize: 18, // Increase font size
    color: 'blue', // Optional: Make it stand out
  },
  // You can add more styles as needed
});
export default Winner;
