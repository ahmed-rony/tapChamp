
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, ImageBackground, StyleSheet, Platform } from 'react-native';
import { useLevel } from './LevelContext';
import CooldownComponent from './CooldownComponent';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Progress from 'react-native-progress';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import useTimer from './useTimer'; // Ensure this path is correct
import { interstitialAdKeyAndroid, interstitialAdKeyIos } from './AdConfig';
import useAdRemovalPurchase from './useAdRemovalPurchase'; //add

Sound.setCategory('Playback');

var congratsSound: any;
if (Platform.OS === 'android') {
  congratsSound = new Sound(require('../android/sounds/CongratsT.mp3'));
} else {
  congratsSound = new Sound('tada.mp3', Sound.MAIN_BUNDLE);
}

var tapSound: any;
if (Platform.OS === 'android') {
  tapSound = new Sound(require('../android/sounds/TapThr.mp3'));
} else {
  tapSound = new Sound('punch.mp3', Sound.MAIN_BUNDLE);
}
const failSound = new Sound(require('../android/sounds/Fail.mp3'), (error) => {
  if (error) { console.log('Failed to load the sound', error); return; }
  console.log('Duration in seconds: ' + failSound.getDuration() + 'number of channels: ' + failSound.getNumberOfChannels());
});

// const adUnitId =  __DEV__ ? TestIds.INTERSTITIAL : Platform.OS == 'ios' ? interstitialAdKeyIos : interstitialAdKeyAndroid ;
const adUnitId =  __DEV__ ? TestIds.INTERSTITIAL : Platform.OS == 'ios' ? TestIds.INTERSTITIAL : interstitialAdKeyAndroid ;
const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
const LVLTwentyTwo = ({ navigation }) => {
  const { unlockedLevels, setUnlockedLevels, attemptsLeft, decreaseAttempts } = useLevel();
  const [points, setPoints] = useState(0);
  const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(30);
  const [message, setMessage] = useState('');
  const [lastButtonPressed, setLastButtonPressed] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const requiredTaps = 380;
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [adShown, setAdShown] = useState(false);
  const [addClosed, setAdClosed] = useState(false);
  const adRemovalPurchased = useAdRemovalPurchase(); //add

  const showInterstitialAd = () => {
    if (interstitialAd.loaded && !adShown && !adRemovalPurchased) { //add
      interstitialAd.show();
      setAdShown(true);
    } //add
  };

//New useEffext for IAP logic





  useEffect(() => {
    const eventLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Ad Loaded');
    });
    const eventErrorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Ad failed to load: ', error);
    });
    const adClosedListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
      setAdClosed(true);
    });
    interstitialAd.load();
    return () => {
      if (eventLoadListener && eventLoadListener.remove) {
        eventLoadListener.remove();
      }
      if (eventErrorListener && eventErrorListener.remove) {
        eventErrorListener.remove();
      }
      if (adClosedListener && adClosedListener.remove) {
        adClosedListener.remove();
      }
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const onWillBlur = () => {
        tapSound.pause();
        congratsSound.pause();
        failSound.pause();
      };
      const onDidFocus = () => {
        if (!isInitialLoad) {
          tapSound.play();
        } else {
          setIsInitialLoad(false);
        }
      };
      const unsubscribeBlur = navigation.addListener('blur', onWillBlur);
      const unsubscribeFocus = navigation.addListener('focus', onDidFocus);
      return () => {
        unsubscribeBlur();
        unsubscribeFocus();
      };
    }, [navigation, isInitialLoad])
  );









  useEffect(() => {
    if (timerStarted) {
      if (points >= requiredTaps && !adShown) {
        setMessage('Congratulations! You Beat Level 22!');
        congratsSound.play((success) => {
          if (!success) {
            console.log('Congrats sound did not play');
          }
        });
        if (!unlockedLevels.includes(23)) {
          setUnlockedLevels([...unlockedLevels, 23]);
        }
        showInterstitialAd();
        stopTimer();
      } else if (timeLeft === 0 && !gameOver && !adShown) {
        setGameOver(true);
        decreaseAttempts();
        setMessage('Time ran out. You lost.');
        failSound.play((success) => {
          if (!success) {
            console.log('Failed to play the fail sound');
          }
        });
        showInterstitialAd();
        stopTimer();
      }
    }
  }, [timerStarted, points, unlockedLevels, timeLeft, gameOver, decreaseAttempts, adShown]);
  useEffect(() => {
    return () => {
      tapSound.stop();
      congratsSound.stop();
      failSound.stop();
    };
  }, []);
  const handleButtonClick = (buttonType) => {
    if (!timerStarted) {
      if (attemptsLeft <= 0) {
        setMessage('You are out of lives! Try again later - Or add more Lives');
        return;
      }
      setTimerStarted(true);
      startTimer();
    }
    if (points < requiredTaps && (lastButtonPressed === null || lastButtonPressed !== buttonType)) {
      setPoints(points + 1);
      setLastButtonPressed(buttonType);
      tapSound.stop(() => {
        tapSound.play((success) => {
          if (!success) {
            console.log('Sound did not play');
          }
        });
      });
    } else if (points >= requiredTaps) {
      setMessage('Congratulations! You Beat Level 22!');
    }
  };
  return (
    <ImageBackground
      source={require('../android/Images/BackgroundofApp.png')}
      style={styles.backgroundImage}
    >
<Text style={styles.livesTextStyle}>Lives left: {String(attemptsLeft)}</Text>
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>
        {/* Adding CooldownComponent here */}
        <CooldownComponent />
   
        <View style={{ 
    width: '100%', 
    height: 70, 
    borderRadius: 5, 
    backgroundColor: '#DDDDDD', 
    marginTop: 15, 
    marginBottom: 20,
    overflow: 'hidden'  // This ensures that child components (LinearGradient) do not overflow the boundaries of this view
}}>
    <Progress.Bar 
        progress={1} // Always filled
        width={null}
        height={40}
        borderWidth={0}
        borderRadius={5}
        color='transparent'  // Set color to transparent to show gradient beneath
        unfilledColor='transparent'
        style={{ flex: 1, position: 'absolute' }}
        animated={true} // Enable animation
        animationType="spring" // Use "spring" animation
        animationConfig={{ bounciness: 10 }} // Configure the spring animation
    />
    
    <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#191970', '#ffebcd','#191970','#ffebcd']} // Your gradient colors
        style={{ 
            width: `${points / requiredTaps * 100}%`,  // Adjust width based on progress
            height: 70,
            borderRadius: 5 
        }}
    />
</View>  
        
        
        
        
        
        
        <Text style={styles.infoText}>
          You can only earn points towards the progress bar if you hit the buttons right to left or left to right.
        </Text>
        <Text style={styles.infoText}>You need to make {requiredTaps - points} more taps to win!</Text>
        
        <View style={styles.buttonContainer}>
          
          
        <TouchableOpacity style={styles.imageButton} onPress={() => handleButtonClick('D')}>
  <LinearGradient colors={['#FF6347', '#FFA500', '#4682B4']} style={{ ...styles.buttonGradient, width: '100%', height: '100%' }}>
    <Text style={styles.buttonText}>Tap!</Text>
  </LinearGradient>
</TouchableOpacity>
<TouchableOpacity style={styles.imageButton} onPress={() => handleButtonClick('T')}>
  <LinearGradient colors={['#FF6347', '#FFA500', '#4682B4']} style={{ ...styles.buttonGradient, width: '100%', height: '100%' }}>
    <Text style={styles.buttonText}>Tap!</Text>
  </LinearGradient>
</TouchableOpacity>
       
       
       
        </View>
        
        { (addClosed && message) && (
           <Modal visible={true} animationType="slide" transparent={true}>
           <View style={styles.modalContainer}>
             <Text style={styles.modalText}>{message}</Text>
             {message === 'Congratulations! You Beat Level 22!' && (
               <ConfettiCannon 
                 count={200} 
                 origin={{ x: -20, y: 0 }} 
                 explosionSpeed={400} 
                 fallSpeed={3000}
               />
             )}
             <View style={{ marginBottom: 40 }}>
               <TouchableOpacity style={styles.modalButton} onPress={() => {
                 setPoints(0); 
                 setMessage(''); 
                 setTimerStarted(false);
                 setGameOver(false);
                 resetTimer(); // Reset the timer
                 setAdShown(false); // Reset the adShown flag // Add this line to reset the game over state
                 // Reset any other states related to game end here if necessary
               }}>
                 <Text style={{ fontSize: 24 }}>Replay</Text>
               </TouchableOpacity>
             </View>
             <View>
               <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('Screen2')}>
               <Text style={{ fontSize: 20 }}>Back to Levels</Text>
               </TouchableOpacity>
             </View>
           </View>
         </Modal>
        )}
       
        {message && (
  <Modal visible={true} animationType="slide" transparent={true}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>{message}</Text>
      {message === 'Congratulations! You Beat Level 22!' && (
        <ConfettiCannon 
          count={200} 
          origin={{ x: -20, y: 0 }} 
          explosionSpeed={400} 
          fallSpeed={3000}
        />
      )}
      <View style={{ marginBottom: 40 }}>
        <TouchableOpacity style={styles.modalButton} onPress={() => {
          setPoints(0); 
          setMessage(''); 
          setTimerStarted(false);
          setGameOver(false);
          resetTimer(); // Reset the timer
          setAdShown(false); // Reset the adShown flag // Add this line to reset the game over state
          // Reset any other states related to game end here if necessary
        }}>
          <Text style={{ fontSize: 24 }}>Replay</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('Screen2')}>
        <Text style={{ fontSize: 20 }}>Back to Levels</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
      
      
      
      
      </View>
    </ImageBackground>
  );
};



const styles = StyleSheet.create({
  
  
  buttonText: {
    position: 'absolute', 
    color: '#fff8dc', 
    fontSize: 44, 
    fontFamily:'sans-serif-medium',
    fontWeight: 'bold',
    textAlign: 'center', 
    alignSelf: 'center',
  },
  modalButton: {
    fontSize: 60, // Set your desired font size
    margin: 10,
    paddingVertical: 25, // Increase vertical padding for a larger button
    paddingHorizontal: 60, // Increase horizontal padding for a wider button
    borderRadius: 5, // You can modify this as per your design
    backgroundColor: '#ffdead', // Button background color
    color: '#000', // Text color for the button
    overflow: 'hidden',
    elevation: 2, // This adds a slight shadow on Android
    minWidth: 150, // Minimum width of the button
    textAlign: 'center',
  },
 
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 70,  // Assuming you want the same border radius as before
  },
  
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    fontFamily:'sans-serif-medium',
    marginVertical: 10,
    textAlign: 'center',
    color: 'black',
  },
  livesTextStyle: {
    fontSize: 26,  // Example size, you can adjust this
    marginVertical: 10,
    textAlign: 'center',
    fontFamily:'sans-serif-medium',
    color: 'black',  // Example color, you can adjust this
    fontWeight: 'bold', // Making the text bold as an example
    // Add any other styling properties you'd like
},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 10,
  },
  imageButton: {
    width: 140,
  height: 70,
  borderRadius: 70,
 
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 45,
},
  timer: {
    fontSize: 24,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    fontFamily:'sans-serif-medium',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darken the background a bit
    paddingHorizontal: 20, // Add horizontal padding
  },
  imageStyle: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  modalText: {
    fontSize: 40, // Adjust the font size if needed
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Add some margin to the bottom
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slight white transparent background
    padding: 20, // Padding inside the text background
    borderRadius: 10, // Rounded corners for the text background
  },
  
  timerContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 110,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
});
export default LVLTwentyTwo;
