import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import ScanScreen from "../screens/ScanScreen";
import ReportScreen from "../screens/reportScreen/ReportScreen";

function HistoryScreenMock() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>📊 Historial Ciudadano</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack principal de la pestaña de Escáner
function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanMain" component={ScanScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
    </Stack.Navigator>
  );
}

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
          component={ScanStack}
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
