
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert // Make sure to import Alert if you're using it
} from 'react-native';
import Purchases from 'react-native-purchases';
import { useLevel } from './LevelContext'; // Adjust the path as per your directory structure
import AsyncStorage from '@react-native-async-storage/async-storage';
const Perks = () => {
  const [offerings, setOfferings] = useState(null);
  const { addIapLives } = useLevel(); // Destructure the function from the hook
  const backgroundImage = require('../android/Images/BackgroundofApp.png');
 
  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setOfferings(offerings.current.availablePackages);
        }
      } catch (e) {
        console.log("Error fetching offerings: ", e);
        Alert.alert("Offerings Error", e.message);
      }
    };
  
    fetchOfferings();
  }, []);
  
  
  const handlePurchase = async (packageToPurchase) => {
    try {
      const purchaseMade = await Purchases.purchasePackage(packageToPurchase);
      if (purchaseMade.productIdentifier == 'more_lives') {
        await addIapLives(); // Add 5 additional lives from IAP
        Alert.alert("Purchase Successful", "You've unlocked more lives!");
      } else if (purchaseMade.productIdentifier == 'add_more_lives') {
        await addIapLives(); // Add 5 additional lives from IAP
        Alert.alert("Purchase Successful", "You've unlocked more lives!");
      } else if (purchaseMade.productIdentifier == 'remove_ads') {
         // Handle No Ads purchase
         AsyncStorage.setItem('@removeAdsPurchased', 'true');
         Alert.alert("Purchase Successful", "You've removed the ads!");
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert("Purchase Error", e.message);
      }
    }
  };
  
  return (
   
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        {offerings && offerings.map((offerPackage) => (
          <View key={offerPackage.identifier} style={styles.perkItem}>
            <Text style={styles.perkTitle}>
              {offerPackage.identifier === 'Consumable' ? 'More Lives!' :
               offerPackage.identifier === 'remove_ads' ? 'Your Custom Title for No More Ads' :
               offerPackage.product.title}
            </Text>
            <Text style={styles.perkDescription}>
              {offerPackage.identifier === 'Consumable' ? 'Earn 5 more lives' :
               offerPackage.identifier === 'remove_ads' ? 'Your Custom Description for No More Ads' :
               offerPackage.product.description}
            </Text>
            <TouchableOpacity
              style={styles.perkButton}
              onPress={() => handlePurchase(offerPackage)}
            >
              <Text style={styles.perkButtonText}>
                Buy {offerPackage.product.price_string}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
 
  
  background: {
    flex: 1,
    width: '100%', // Ensure it covers the whole screen
    height: '100%', // Ensure it covers the whole screen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Adjust color if needed for better visibility over your background
    marginBottom: 20,
  },
  perkItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for readability
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 35,
    borderRadius: 8,
    marginBottom: 60,
    alignItems: 'center',
  },
  perkTitle: {
    fontSize: 40,
    color:'black',
    fontWeight: '600',
  },
  perkDescription: {
    textAlign: 'center',
    marginVertical: 10,
        fontSize: 17, // Increase font size as desired
fontWeight: '600',
  },
  perkButton: {
    backgroundColor: '#ffdead',
    paddingVertical: 15, // Increase padding for bigger button height
    paddingHorizontal: 20, // Increase padding for wider button
    borderRadius: 5,
  },
  perkButtonText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 18, // Increase font size for the button text as well
  },
});
export default Perks;
