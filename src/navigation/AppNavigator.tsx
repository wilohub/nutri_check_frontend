import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import ScanScreen from "../screens/ScanScreen"; // <-- Importamos tu nueva pantalla real
import ReportScreen from "../screens/ReportScreen";

function HistoryScreenMock() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>📊 Historial Ciudadano</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 5,
            shadowOpacity: 0.1,
            height: 60,
            paddingBottom: 8,
          },
        }}
      >
        <Tab.Screen
          name="Escáner"
          component={ScanScreen} // <-- Enlazamos el Escáner Real con la Cámara
          options={{
            tabBarLabel: "Escanear",
            tabBarIcon: () => <Text>🔍</Text>,
          }}
        />
        <Tab.Screen
          name="Historial"
          component={HistoryScreenMock}
          options={{
            tabBarLabel: "Historial",
            tabBarIcon: () => <Text>📈</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
});
