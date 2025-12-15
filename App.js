// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import EmailCheckScreen from "./screens/EmailCheckScreen";
import UrlScanScreen from "./screens/UrlScanScreen";
import TicketScreen from "./screens/TicketScreen";
import DeviceSecurityScreen from "./screens/DeviceSecurityScreen"; // ✅ ADD THIS

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#0A1A2F" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Secure" }}
        />

        <Stack.Screen
          name="EmailCheck"
          component={EmailCheckScreen}
          options={{ title: "Email Breach" }}
        />

        <Stack.Screen
          name="UrlScan"
          component={UrlScanScreen}
          options={{ title: "URL Scan" }}
        />

        <Stack.Screen
          name="Ticket"
          component={TicketScreen}
          options={{ title: "Support Ticket" }}
        />

        {/* ✅ Device Security Screen — INSIDE the navigator */}
        <Stack.Screen
          name="DeviceSecurity"
          component={DeviceSecurityScreen}
          options={{ title: "Device Security" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
