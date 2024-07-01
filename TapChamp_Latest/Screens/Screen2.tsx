import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'react-native';
import LVLOne from './LVLOne';
import LVLTwo from './LVLTwo';
import LVLThree from './LVLThree';
import LVLFour from './LVLFour';
import LVLFive from './LVLFive';
import LVLSix from './LVLSix';
import LVLSeven from './LVLSeven';
import LVLEight from './LVLEight';
import LVLNine from './LVLNine';
import LVLTen from './LVLTen';
import LVLEleven from './LVLEleven';
import LVLTwelve from './LVLTwelve';
import LVLThirteen from './LVLThirteen';
import LVLFourteen from './LVLFourteen';
import LVLFifteen from './LVLFifteen';
import LVLSixteen from './LVLSixteen';
import LVLSeventeen from './LVLSeventeen';
import LVLEighteen from './LVLEighteen';
import LVLNineteen from './LVLNineteen';
import LVLTwenty from './LVLTwenty';
import LVLTwentyOne from './LVLTwentyOne';
import LVLTwentyTwo from './LVLTwentyTwo';
import LVLTwentyThree from './LVLTwentyThree';
import LVLTwentFour from './LVLTwentFour';
import LVLTwentFive from './LVLTwentFive';
import { useNavigation } from '@react-navigation/native';
import { useLevel } from './LevelContext';

const LOCKED_COLOR = '#585f6b';
const UNLOCKED_COLOR = '#ffdead';

const levelScreens = [
  'LVLOne',
  'LVLTwo',
  'LVLThree',
  'LVLFour',
  'LVLFive',
  'LVLSix',
  'LVLSeven',
  'LVLEight',
  'LVLNine',
  'LVLTen',
  'LVLEleven',
  'LVLTwelve',
  'LVLThirteen',
  'LVLFourteen',
  'LVLFifteen',
  'LVLSixteen',
  'LVLSeventeen',
  'LVLEighteen',
  'LVLNineteen',
  'LVLTwenty',
  'LVLTwentyOne',
  'LVLTwentyTwo',
  'LVLTwentyThree',
  'LVLTwentFour',
  'LVLTwentFive',
  'Winner'
];



const Screen2 = () => {
  const navigation = useNavigation();
  const { unlockedLevels } = useLevel();

  const navigateToLevel = (index) => {
    navigation.navigate(levelScreens[index]);
  };

  const renderItem = ({ item, index }) => {
    const isUnlocked = unlockedLevels.includes(index + 1); // index + 1 represents the level number
    const buttonColor = isUnlocked ? UNLOCKED_COLOR : LOCKED_COLOR;
    let levelText;
    if (index === levelScreens.length - 1) {
      levelText = 'Winner'; // Keep the 'Winner' text for the last item
    } else {
      levelText = `Level ${index + 1}`; // Converts '0' to 'Level 1', '1' to 'Level 2', etc.
    }


    
    return (
      <TouchableOpacity
        style={[styles.levelButton, { backgroundColor: buttonColor }]}
        onPress={isUnlocked ? () => navigateToLevel(index) : null}
      >
        <Text style={styles.levelText}>{levelText}</Text>
      </TouchableOpacity>
    );
  };





  return (
    <ImageBackground
      source={require('../android/Images/BackgroundofApp.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}></Text>
        <FlatList
          data={levelScreens}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
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
 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  levelButton: {
    paddingVertical: 25, // Increased padding for a larger button
    paddingHorizontal: 30, // Increased padding for a larger button
    margin: 10,
    borderRadius: 25,
    width: 300,
     // Use a bright color for the shadow to simulate a glow
     shadowColor: "#1abc9c", // This should be a bright color for the glow effect
     shadowOffset: { width: 0, height: 0 }, // You can adjust this as needed
     shadowOpacity: 0.8, // You might need to adjust this to get the right glow intensity
     shadowRadius: 10, // The blur radius - the higher the number, the more 'glow'
     // Elevation for Android, note that Android does not support shadow color
     elevation: 8, // The higher the elevation, the bigger the shadow/glow,
  },
  levelText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Screen2;
