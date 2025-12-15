// screens/TicketScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { db } from "../firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function TicketScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitTicket = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "tickets"), {
        name: name,
        email: email,
        message: message,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Your ticket has been submitted!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submit a Support Ticket</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Enter your issue"
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.button} onPress={submitTicket}>
        <Text style={styles.buttonText}>Submit Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    height: 120,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0d6efd",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
