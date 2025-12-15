// components/CyberBackground.js

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function CyberBackground({ children }) {
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Animated Cyber Grid */}
      <Animated.View
        style={[
          styles.grid,
          { opacity: fadeAnim }
        ]}
      />

      {/* Page Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00172D",
    opacity: 0.6,
    borderColor: "#0AF",
    borderWidth: 0.2,
    backgroundImage:
      "linear-gradient(90deg, rgba(0,140,255,0.25) 1px, transparent 1px), " +
      "linear-gradient(0deg, rgba(0,140,255,0.25) 1px, transparent 1px)",
  },
  content: {
    flex: 1,
    padding: 15,
  },
});
