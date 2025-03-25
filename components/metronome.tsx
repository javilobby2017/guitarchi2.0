// src/components/Metronome.tsx
import { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Fix: Use useRef to store interval ID

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/tick.mp3'));
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playTick = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        await playTick();
      }, (60 / bpm) * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm]);

  const toggleMetronome = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Metronome</Text>
      
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Tempo: {bpm} BPM</Text>
      <Slider
        minimumValue={40}
        maximumValue={220}
        step={1}
        value={bpm}
        onValueChange={(value) => setBpm(value) }
        style={{ width: '80%', marginBottom: 20 }}
      />

      <Button title={isPlaying ? 'Stop' : 'Start'} onPress={toggleMetronome} />
    </View>
  );
};

export default Metronome;
