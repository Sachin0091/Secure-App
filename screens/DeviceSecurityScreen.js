// screens/DeviceSecurityScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import * as Application from "expo-application";
import CyberBackground from "../components/CyberBackground";

export default function DeviceSecurityScreen() {
  const [securityInfo, setSecurityInfo] = useState({
    isRooted: false,
    isEmulator: false,
    devMode: false,
    biometrics: false,
    appSource: "Unknown",
  });

  useEffect(() => {
    (async () => {
      const rooted = await Device.isDevice && Device.osBuildId === null;
      const biometrics = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const emulator = !Device.isDevice;
      const devMode = Device.isDevice && __DEV__;
      const installer = Application.androidApplicationId
        ? await Application.getInstallReferrerAsync()
        : "App Store / Unknown";

      setSecurityInfo({
        isRooted: rooted,
        isEmulator: emulator,
        devMode: devMode,
        biometrics: biometrics && enrolled,
        appSource: installer || "Unknown",
      });
    })();
  }, []);

  return (
    <CyberBackground>
      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.title}>Device Security Status</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Device:</Text>
          <Text style={styles.value}>{Device.manufacturer} {Device.modelName}</Text>

          <Text style={styles.label}>OS:</Text>
          <Text style={styles.value}>{Device.osName} {Device.osVersion}</Text>

          <Text style={styles.label}>Root / Jailbreak:</Text>
          <Text style={[styles.value, securityInfo.isRooted ? styles.bad : styles.good]}>
            {securityInfo.isRooted ? "⚠ Rooted / Jailbroken" : "✓ Secure"}
          </Text>

          <Text style={styles.label}>Emulator:</Text>
          <Text style={[styles.value, securityInfo.isEmulator ? styles.bad : styles.good]}>
            {securityInfo.isEmulator ? "⚠ Running in Emulator" : "✓ Real Device"}
          </Text>

          <Text style={styles.label}>Developer Mode:</Text>
          <Text style={[styles.value, securityInfo.devMode ? styles.bad : styles.good]}>
            {securityInfo.devMode ? "⚠ Developer Mode Enabled" : "✓ Disabled"}
          </Text>

          <Text style={styles.label}>Biometrics:</Text>
          <Text style={[styles.value, securityInfo.biometrics ? styles.good : styles.bad]}>
            {securityInfo.biometrics ? "✓ Available" : "⚠ Not Enabled"}
          </Text>

          <Text style={styles.label}>Install Source:</Text>
          <Text style={styles.value}>{securityInfo.appSource}</Text>
        </View>
      </ScrollView>
    </CyberBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 15,
  },
  label: {
    fontSize: 16,
    color: "#AACCFF",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  good: { color: "#00FFAA" },
  bad: { color: "#FF6767" },
});

