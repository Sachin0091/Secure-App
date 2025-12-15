import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IPMap({ lat, lon, country, isp }) {
  if (!lat || !lon) {
    return (
      <Text style={{ color: "#fff", marginTop: 10 }}>
        No geolocation info available.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>IP Geolocation</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
        mapType="standard"
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lon }}
          title={country || "Unknown Location"}
          description={isp || ""}
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.info}>🌍 Country: {country}</Text>
        <Text style={styles.info}>📡 ISP: {isp}</Text>
        <Text style={styles.info}>📍 Latitude: {lat}</Text>
        <Text style={styles.info}>📍 Longitude: {lon}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    color: "#00aaff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  map: {
    width: Dimensions.get("window").width - 30,
    height: 250,
    borderRadius: 12,
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 10,
  },
  info: {
    color: "#d0e6ff",
    marginBottom: 5,
  },
});

