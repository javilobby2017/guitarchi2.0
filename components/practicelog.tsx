import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

const maxStrings = 6;

const PracticeLog = () => {
    const [stringsLeft, setStringsLeft] = useState<number>(maxStrings);
    const [lastPractice, setLastPractice] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
          const storedStrings = await AsyncStorage.getItem('stringsLeft');
          const storedLastPractice = await AsyncStorage.getItem('lastPractice');
          
          if (storedStrings !== null) setStringsLeft(parseInt(storedStrings));
      if (storedLastPractice) setLastPractice(storedLastPractice);
    };
    
    loadData();
}, []);

const playStringSnap = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/src_assets_sounds_string-snaps.wav')
    );
    await sound.playAsync();

     // Unload the sound from memory after playing
     sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
      }
    });

  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

const handlePlaySound = async () => {
  setIsPlaying(true);
  await playStringSnap();
  setIsPlaying(false);
};

const [isPlaying, setIsPlaying] = useState(false);

 
const [missedDay, setMissedDay] = useState(false);

  useEffect(() => {
    const lastPracticeDate = new Date(localStorage.getItem("lastPractice") || "");
    const today = new Date();

    if (lastPracticeDate && (today.getDate() - lastPracticeDate.getDate() > 1)) {
      setMissedDay(true);
    
    }
  }, []);

  useEffect(() => {
  if (missedDay) {
      playStringSnap();
  }
}, [missedDay]);

useEffect(() => {
    const checkMissedDays = async () => {
      if (!lastPractice) return;

      const today = new Date();
      const lastDate = new Date(lastPractice);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        let newStringsLeft = Math.max(0, stringsLeft - diffDays);
        setStringsLeft(newStringsLeft);
        await AsyncStorage.setItem('stringsLeft', newStringsLeft.toString());

        if (newStringsLeft === 0) {
          setMessage("Oh no! You've lost all your strings. Your guitar is unplayable! 😢");
        }
      }
    };

    //checked missed days

    checkMissedDays();
  }, [lastPractice]);

  const logPractice = async () => {
    const today = new Date().toLocaleDateString();

    if (today !== lastPractice) {
      setLastPractice(today);
      await AsyncStorage.setItem('lastPractice', today);
      setMessage("Practice logged! 🎸");
    } else {
      setMessage("You've already practiced today! ✅");
    }
  };

  const resetGuitar = async () => {
    setStringsLeft(maxStrings);
    setLastPractice(null);
    await AsyncStorage.setItem('stringsLeft', maxStrings.toString());
    await AsyncStorage.removeItem('lastPractice');
    setMessage("Guitar reset! 🎉 Start practicing again.");
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Guitar Practice Log</Text>

      <Text style={{ fontSize: 18 }}>Strings Left: {stringsLeft}</Text>
      <Text style={{ fontSize: 16, color: 'red', marginBottom: 10 }}>{message}</Text>

      <Button title="Log Practice" onPress={logPractice} disabled={stringsLeft === 0} />
      <Button title="Reset Guitar" onPress={resetGuitar} disabled={stringsLeft > 0} />
    
      {/* <TouchableOpacity 
                onPress={handlePlaySound} 
                disabled={isPlaying}
                style={{
                    backgroundColor: isPlaying ? '#999' : '#ff5c5c',
                    padding: 15,
                    borderRadius: 10
                }}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>
                    {isPlaying ? 'Playing...' : 'Test String Snap Sound'}
                </Text>
            </TouchableOpacity> */}
    
    </View>
  );
};

export default PracticeLog;

