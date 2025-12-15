// screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import CyberBackground from "../components/CyberBackground";

export default function HomeScreen({ navigation }) {
  return (
    <CyberBackground>
      <View style={styles.centerBox}>

        {/* Logo */}
        <Image source={require("../assets/shield.png")} style={styles.logo} />

        <Text style={styles.title}>Secure</Text>
        <Text style={styles.subtitle}>Your Cyber Safety Companion</Text>

        {/* FIXED ROUTE NAME */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EmailCheck")}
        >
          <Text style={styles.buttonText}>Email Breach Checker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UrlScan")}
        >
          <Text style={styles.buttonText}>URL / Website Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DeviceSecurity")}
>

            <Text style={styles.buttonText}>Device Security Scanner</Text>
</TouchableOpacity>


        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Ticket")}
        >
          <Text style={styles.buttonText}>Support Ticket</Text>
        </TouchableOpacity>

      </View>
    </CyberBackground>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#00A8FF",
    textShadowColor: "#0080FF",
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#AACCFF",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    width: "85%",
    alignItems: "center",
    shadowColor: "#00BFFF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
