import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import CyberBackground from "../components/CyberBackground";

export default function EmailCheckScreen() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBreach = async () => {
    if (!email) {
      Alert.alert("Error", "Enter an email!");
      return;
    }

    setLoading(true);

    const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(
      email
    )}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": "48a7644d69mshf5ad41744f4f3e6p143d73jsn8eb44ca4fe4e",
          "x-rapidapi-host": "breachdirectory.p.rapidapi.com",
        },
      });

      const data = await response.json();
      console.log("API RESPONSE:", data);

      if (data.success === false || !data.result) {
        setResult({ breached: false });
      } else {
        setResult({
          breached: true,
          last_breach: data.result[0]?.last_breach || "Unknown",
          sources: data.result.map((item) => item.source),
        });
      }
    } catch (err) {
      console.log("API ERROR:", err);
      Alert.alert("Error", "Could not connect to the breach API.");
    }

    setLoading(false);
  };

  return (
    <CyberBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Email Breach Checker</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={checkBreach}>
          <Text style={styles.buttonText}>
            {loading ? "Checking..." : "Check Email"}
          </Text>
        </TouchableOpacity>

        {result && (
          <>
            {!result.breached && (
              <View style={styles.safeCard}>
                <Text style={styles.safeTitle}>SAFE ✓</Text>
                <Text style={styles.safeText}>No breaches detected.</Text>
              </View>
            )}

            {result.breached && (
              <View style={styles.breachCard}>
                <Text style={styles.breachTitle}>⚠ BREACHED</Text>

                <Text style={styles.infoText}>
                  Last breach:{" "}
                  <Text style={{ color: "#fff" }}>{result.last_breach}</Text>
                </Text>

                <Text style={styles.infoText}>
                  Number of breaches:{" "}
                  <Text style={{ color: "#fff" }}>{result.sources.length}</Text>
                </Text>

                <Text style={styles.breachSubtitle}>Breached Sources:</Text>

                {result.sources.map((src, index) => (
                  <View key={index} style={styles.breachItem}>
                    <Text style={styles.breachName}>• {src}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </CyberBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  safeCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(0,200,100,0.25)",
  },
  safeTitle: { color: "#00FFAA", fontSize: 22, fontWeight: "bold" },
  safeText: { color: "#FFF", fontSize: 16, marginTop: 6 },
  breachCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,60,60,0.25)",
  },
  breachTitle: { color: "#FF6363", fontSize: 24, fontWeight: "bold" },
  infoText: {
    color: "#FFDCDC",
    marginTop: 10,
    fontSize: 16,
  },
  breachSubtitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
  },
  breachItem: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
  },
  breachName: { color: "#FFB0B0", fontSize: 16, fontWeight: "bold" },
});
