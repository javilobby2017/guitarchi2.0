import React, { useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, Text, View, StyleSheet, Animated } from "react-native";
import { Image } from 'expo-image';
// import logo from "@/assets/images/guitar.webp"
import Metronome from "@/components/metronome";
import PracticeLog from "@/components/practicelog";
// import VideoScreen from "@/components/video";



// function Index() {

// };


const FloatingImage = () => {
  const floatAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const float = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10, // Float down by 10 units
          duration: 1000, // Duration of the float
          useNativeDriver: true, // Use native driver for smoother animations
        }),
        Animated.timing(floatAnim, {
          toValue: -10, // Float up by 10 units
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => float()); // Loop the animation by restarting it once it completes
    };

    float(); 

    return () => {
      // Clean up animation on unmount
      floatAnim.stopAnimation();
    };
  }, [floatAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Guitarchi</Text>

      <Animated.View style={[styles.imageContainer, { transform: [{ translateY: floatAnim }] }]}>
        <Image
          source={require("../assets/images/guitar.webp")}
          style={styles.image}
        />
      </Animated.View>

      <Metronome />

      <PracticeLog />
      
      {/* <VideoScreen /> */}
    
    </SafeAreaView>
   );

  }; 
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#4A90E2",
    },
    imageContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    image: {
      height: 300,
      width: 300,
      borderRadius: 10,
    },
  });
  
  export default FloatingImage;
