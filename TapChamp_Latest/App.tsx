
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ImageBackground, Image, Platform } from 'react-native';
import Screen2 from './Screens/Screen2';
import LVLOne from './Screens/LVLOne';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LVLTwo from './Screens/LVLTwo';
import LVLThree from './Screens/LVLThree';
import LVLFour from './Screens/LVLFour';
import LVLFive from './Screens/LVLFive';
import LVLSix from './Screens/LVLSix';
import LVLSeven from './Screens/LVLSeven';
import LVLEight from './Screens/LVLEight';
import LVLNine from './Screens/LVLNine';
import LVLTen from './Screens/LVLTen';
import LVLEleven from './Screens/LVLEleven';
import LVLTwelve from './Screens/LVLTwelve';
import LVLThirteen from './Screens/LVLThirteen';
import LVLFourteen from './Screens/LVLFourtneen';
import LVLFifteen from './Screens/LVLFifteen';
import LVLSixteen from './Screens/LVLSixteen';
import LVLSeventeen from './Screens/LVLSeventeen';
import LVLEighteen from './Screens/LVLEighteen';
import LVLNineteen from './Screens/LVLNineteen';
import LVLTwenty from './Screens/LVLTwenty';
import LVLTwentyOne from './Screens/LVLTwentyOne';
import LVLTwentyTwo from './Screens/LVLTwentyTwo';
import LVLTwentyThree from './Screens/LVLTwentyThree';
import LVLTwentFour from './Screens/TwentFour';
import LVLTwentFive from './Screens/TwentFive';
import Perks from './Screens/Perks';
import Winner from './Screens/Winner';
import LevelContext from './Screens/LevelContext';
import { LevelProvider } from './Screens/LevelContext';
import * as Notifications from 'expo-notifications';
import * as InAppPurchases from 'expo-in-app-purchases';
import LinearGradient from 'react-native-linear-gradient';
import Purchases from 'react-native-purchases';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import { DeviceEventEmitter } from 'react-native';
import IAPHandler from './Screens/IAPHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appsFlyer from 'react-native-appsflyer';
import { requestTrackingPermission } from 'react-native-tracking-transparency';



const Stack = createNativeStackNavigator();
const App = () => {
  
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isHowToModalVisible, setHowToModalVisible] = useState(false);
  const [adRemovalPurchased, setAdRemovalPurchased] = useState(false); // New state for ad removal
  
 // Function to request tracking authorization
const requestTrackingAuthorization = async () => {
  try {
    const status = await requestTrackingPermission();
    console.log('Tracking authorization status:', status);
    // Handle the status (e.g., show relevant UI based on the permission status)
  } catch (error) {
    console.error('Error requesting tracking authorization:', error);
  }
};

useEffect(() => {
  requestTrackingAuthorization();
}, []);


  const toggleContactModal = () => {
    setContactModalVisible(!isContactModalVisible);
  };
  const toggleHowToModal = () => {
    setHowToModalVisible(!isHowToModalVisible);
  };
  const navigation = useNavigation();
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4586126437187561/5177238275';

  Purchases.setDebugLogsEnabled(true); // Enable to get detailed logs
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Purchases.configure({apiKey: 'appl_BCXUEVMRGsCxbRUAXhSGpSADPVS'});
   } else if (Platform.OS === 'android') {
      Purchases.configure({apiKey: "goog_shaecyUGGZAuvEbEwIQQDdovQfr" });
        }

  }, []);

  appsFlyer.initSdk(
    {
      devKey: 'UQDfRYhoZc2D67S2tQaV55',
      isDebug: false,
      appId: Platform.OS === 'ios' ? 'id6474350546' : 'com.tapchamp',
      // onInstallConversionDataListener: true, //Optional
      // onDeepLinkListener: true, //Optional
      timeToWaitForATTUserAuthorization: 10
    },
    (result) => {
      console.log(result);
    },
    (error) => {
      console.error(error);
    }
  );
  
   useEffect(() => {
    // fetchData();
    const checkAdRemovalPurchase = async () => {
        try {
          const purchased = await AsyncStorage.getItem('@removeAdsPurchased');
          if (purchased === 'true') {
            console.log('Remove ads purchased:', purchased);
            setAdRemovalPurchased(true);
          } else {
            // Handle situation accordingly if the value is not found
            console.log('Remove ads purchased key is not set in AsyncStorage');
          }
        } catch (error) {
          // Handling error if fetching the value fails
          console.error('Error retrieving data from AsyncStorage', error);
        }
    };

    checkAdRemovalPurchase();
    const subscription = DeviceEventEmitter.addListener('removeAdsPurchased', (status) => {
      setAdRemovalPurchased(status);
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  return (

    <ImageBackground source={require('./android/Images/BackgroundofApp.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
      <Image source={require('./android/Images/tapchampt.png')} style={styles.titleImage} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate({ name: 'Screen2' })}>
          <Text style={styles.buttonText}>Play Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleContactModal}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleHowToModal}>
          <Text style={styles.buttonText}>How To Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Perks')}>
  <Text style={styles.buttonText}>Perks</Text>
</TouchableOpacity>
       
       {/* Conditional rendering of Banner Ad based on adRemovalPurchased state */}
{!adRemovalPurchased && (
  <BannerAd
    size={BannerAdSize.BANNER}
    unitId={TestIds.BANNER}
    onAdLoaded={() => {
      console.log('Advert loaded');
    }}
    onAdFailedToLoad={error => {
      console.error('Advert failed to load: ', error);
    }}
  />
)}

       
       
        {/* Contact Modal */}
        <Modal animationType="slide" transparent={true} visible={isContactModalVisible}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.contactText}>
        Contact Us: Please reach out to @MSMEntertain on X for all inquiries.
      </Text>
      <TouchableOpacity onPress={toggleContactModal}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>





        {/* How To Modal */}
        <Modal animationType="slide" transparent={true} visible={isHowToModalVisible}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.howToTitle}>How To Play</Text>
      <Text style={styles.howToText}>
        <Text style={styles.howToBold}>Fill the Progress Bar:</Text> Your goal is to fill up the progress bar as quickly as possible before time runs out. Keep your eyes on the clock and stay focused.
        {"\n"}
        <Text style={styles.howToBold}>Precision Matters:</Text> Points are earned by tapping the buttons in the correct order, either from left to right or right to left.
      </Text>
      <TouchableOpacity onPress={toggleHowToModal}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </View>
      </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  titleImage: {
    width: 700, // Set the width as needed
    height: 100, // Set the height as needed
    marginBottom: 20, // Adjust the spacing as needed
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // Spread out vertically
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Arial', // Change the font family
    marginTop: 20, // Moved the title to the top
  },
  button: {
    backgroundColor: '#ffdead',
    padding: 33, // Made the buttons bigger
    margin: 10,
    borderRadius: 40, // Made the buttons more rounded
    
  },
  buttonText: {
    color: 'black',
    fontSize: 30, // Increased button text size
    textAlign: 'center',
    width: 230,
  },
  contactText: {
    color: 'black',
    fontSize: 25, // Choose your desired size

    marginBottom: 30, // Add some margin if needed
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    
  },
  howToTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  howToText: {
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 10,
  },
  howToBold: {
    color: 'black',
    fontSize: 25, // Choose your desired size

    marginBottom: 30, // Add some margin if needed
  },
  closeButton: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  
});



const AppNavigator = () => {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);


  return (
   

    <NavigationContainer>
      <LevelProvider>
      <Stack.Navigator
      initialRouteName="App"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F0F8FF', // Replace with the exact color code you wish to use
        },
        headerTintColor: '#000', // This sets the color of the back button and title if needed
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center', // Center title
      }}
    >
        <Stack.Screen name="App" component={App} />
        <Stack.Screen name="Screen2" component={Screen2} options={{ title: 'Levels' }}/>
        <Stack.Screen name="LVLOne" component={LVLOne} options={{ title: 'Level 1' }}/>
        <Stack.Screen name="LVLTwo" component={LVLTwo}options={{ title: 'Level 2' }} />
        <Stack.Screen name="LVLThree" component={LVLThree}options={{ title: 'Level 3' }} />
        <Stack.Screen name="LVLFour" component={LVLFour}options={{ title: 'Level 4' }} />
        <Stack.Screen name="LVLFive" component={LVLFive} options={{ title: 'Level 5' }}/>
        <Stack.Screen name="LVLSix" component={LVLSix} options={{ title: 'Level 6' }}/>
        <Stack.Screen name="LVLSeven" component={LVLSeven} options={{ title: 'Level 7' }}/>
        <Stack.Screen name="LVLEight" component={LVLEight}options={{ title: 'Level 8' }} />
        <Stack.Screen name="LVLNine" component={LVLNine} options={{ title: 'Level 9' }}/>
        <Stack.Screen name="LVLTen" component={LVLTen}options={{ title: 'Level 10' }} />
        <Stack.Screen name="LVLEleven" component={LVLEleven} options={{ title: 'Level 11' }}/>
        <Stack.Screen name="LVLTwelve" component={LVLTwelve} options={{ title: 'Level 12' }}/>
        <Stack.Screen name="LVLThirteen" component={LVLThirteen}options={{ title: 'Level 13' }} />
        <Stack.Screen name="LVLFourteen" component={LVLFourteen}options={{ title: 'Level 14' }} />
        <Stack.Screen name="LVLFifteen" component={LVLFifteen} options={{ title: 'Level 15' }}/>
        <Stack.Screen name="LVLSixteen" component={LVLSixteen} options={{ title: 'Level 16' }}/>
        <Stack.Screen name="LVLSeventeen" component={LVLSeventeen} options={{ title: 'Level 17' }}/>
        <Stack.Screen name="LVLEighteen" component={LVLEighteen} options={{ title: 'Level 18' }}/>
        <Stack.Screen name="LVLNineteen" component={LVLNineteen}options={{ title: 'Level 19' }} />
        <Stack.Screen name="LVLTwenty" component={LVLTwenty} options={{ title: 'Level 20' }}/>
        <Stack.Screen name="LVLTwentyOne" component={LVLTwentyOne}options={{ title: 'Level 21' }} />
        <Stack.Screen name="LVLTwentyTwo" component={LVLTwentyTwo} options={{ title: 'Level 22' }}/>
        <Stack.Screen name="LVLTwentyThree" component={LVLTwentyThree} options={{ title: 'Level 23' }}/>
        <Stack.Screen name="LVLTwentFour" component={LVLTwentFour} options={{ title: 'Level 24' }}/>
        <Stack.Screen name="LVLTwentFive" component={LVLTwentFive} options={{ title: 'Level 25' }}/>
        <Stack.Screen name="Perks" component={Perks} />
        <Stack.Screen name="Winner" component={Winner}/>

      </Stack.Navigator>
      </LevelProvider>
    </NavigationContainer>
   
  );
};
export default AppNavigator;
