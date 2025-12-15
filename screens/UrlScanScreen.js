// screens/UrlScanScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { scanUrlIPQS, whoisLookup } from "../services/apiService";

export default function UrlScanScreen() {
  const [url, setUrl] = useState("");
  const [scan, setScan] = useState(null);
  const [whois, setWhois] = useState(null);
  const [geoInfo, setGeoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const onScan = async () => {
    if (!url.trim()) return alert("Enter URL or domain");
    Keyboard.dismiss();
    setLoading(true);
    setScan(null);
    setWhois(null);
    setGeoInfo(null);

    try {
      // 1) URL scan (IPQualityScore)
      const s = await scanUrlIPQS(url.trim());
      if (!s.ok) throw new Error(s.error || "URL scan failed");
      setScan(s.raw);

      // 2) RDAP / WHOIS
      const w = await whoisLookup(url.trim());
      setWhois(w.ok ? w : { ok: false, error: w.error });

      // 3) Geo info: IPQS commonly returns latitude/longitude and ISP
      const lat = s.raw.latitude || s.raw.ip_latitude || s.raw.geo?.latitude;
      const lon = s.raw.longitude || s.raw.ip_longitude || s.raw.geo?.longitude;
      const country = s.raw.country_code || s.raw.geo?.country || s.raw.country;
      const isp = s.raw.ISP || s.raw.isp || s.raw.as_owner;

      if (lat && lon) {
        setGeoInfo({
          lat: Number(lat),
          lon: Number(lon),
          country,
          isp,
          riskScore: s.raw.risk_score ?? 0,
        });
      } else {
        // try from whois fallback if available
        const wlat = w?.raw?.network?.latitude || w?.raw?.entities?.[0]?.vcardArray;
        // we won't attempt complex parsing here — rely on IPQS mostly
      }
    } catch (err) {
      alert("Scan error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Website / URL Scanner</Text>

      <TextInput
        style={styles.input}
        placeholder="https://example.com or example.com"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={onScan} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Scanning..." : "Scan URL"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} size="large" color="#1E88E5" />}

      {scan && (
        <View style={[styles.card, (scan.unsafe || scan.phishing || scan.suspicious) ? styles.cardDanger : styles.cardSafe]}>
          <Text style={(scan.unsafe || scan.phishing || scan.suspicious) ? styles.bigDanger : styles.bigSafe}>
            {(scan.unsafe || scan.phishing || scan.suspicious) ? "UNSAFE" : "SAFE"}
          </Text>

          <Text style={styles.meta}>Domain: {scan.domain || scan.url || "Unknown"}</Text>
          <Text style={styles.meta}>Risk score: {scan.risk_score ?? "N/A"}/100</Text>
          <Text style={styles.meta}>ISP: {scan.ISP || scan.isp || scan.as_owner || "Unknown"}</Text>
          <Text style={styles.meta}>Country: {scan.country_code || scan.country || "Unknown"}</Text>
        </View>
      )}

      {whois && whois.ok && (
        <View style={styles.whois}>
          <Text style={styles.sectionTitle}>WHOIS / RDAP</Text>
          <Text style={styles.meta}>Registrar: {whois.registrar || "Unknown"}</Text>
          <Text style={styles.meta}>Created: {whois.created || "Unknown"}</Text>
          <Text style={styles.meta}>Expires: {whois.expires || "Unknown"}</Text>
          <Text style={styles.meta}>Nameservers: {(whois.nameservers || []).join(", ") || "Unknown"}</Text>
        </View>
      )}

      {geoInfo ? (
        <>
          <ThreatRadarMap
            lat={geoInfo.lat}
            lon={geoInfo.lon}
            country={geoInfo.country}
            isp={geoInfo.isp}
            riskScore={geoInfo.riskScore}
          />
        </>
      ) : (
        <View style={{ marginTop: 18 }}>
          <Text style={{ color: "#bfcbdc" }}>Geolocation not available for this site.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#081021" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12, color: "#cfeaff" },
  input: { borderWidth: 1, borderColor: "#122235", padding: 12, borderRadius: 10, marginBottom: 12, backgroundColor: "#0b1624", color: "#fff" },
  btn: { backgroundColor: "#0ea5ff", padding: 14, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#042037", fontWeight: "800" },

  card: { padding: 14, borderRadius: 12, marginTop: 12 },
  cardDanger: { backgroundColor: "#2b0b0b", borderLeftColor: "#ff3c3c", borderLeftWidth: 6 },
  cardSafe: { backgroundColor: "#07220b", borderLeftColor: "#00e676", borderLeftWidth: 6 },

  bigDanger: { color: "#ffb3b3", fontSize: 18, fontWeight: "800" },
  bigSafe: { color: "#b6ffda", fontSize: 18, fontWeight: "800" },

  meta: { color: "#d1e9ff", marginTop: 6 },

  whois: { marginTop: 12, padding: 12, backgroundColor: "#071428", borderRadius: 10, borderColor: "rgba(255,255,255,0.03)", borderWidth: 1 },
  sectionTitle: { color: "#00aaff", fontWeight: "700", marginBottom: 6 },
});
