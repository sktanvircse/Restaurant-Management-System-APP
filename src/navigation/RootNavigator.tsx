import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/auth";
import MenuListScreen from "../screens/MenuListScreen";
import MenuEditScreen from "../screens/MenuEditScreen";
import TablesScreen from "../screens/TablesScreen";
import OrderCreateScreen from "../screens/OrderCreateScreen";
import DashboardScreen from "../screens/DashboardScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import { useHydrateStores } from "../store/storage";
import LoginScreen from "../screens/LoginScreen";
// Import all your screens here...

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabsParamList = {
  DashboardTab: undefined;
  MenuTab: undefined;
  TablesTab: undefined;
  OrdersTab: undefined;
};

export type MenuStackParamList = {
  MenuList: undefined;
  MenuEdit: { itemId?: string };
};

export type TablesStackParamList = {
  Tables: undefined;
  OrderCreate: { tableId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();
const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const TablesStack = createNativeStackNavigator<TablesStackParamList>();

function MenuStackNavigator() {
  return (
    <MenuStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuList" component={MenuListScreen} />
      <MenuStack.Screen name="MenuEdit" component={MenuEditScreen} />
    </MenuStack.Navigator>
  );
}

function TablesStackNavigator() {
  return (
    <TablesStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <TablesStack.Screen name="Tables" component={TablesScreen} />
      <TablesStack.Screen name="OrderCreate" component={OrderCreateScreen} />
    </TablesStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            DashboardTab: "home",
            MenuTab: "restaurant",
            TablesTab: "grid",
            OrdersTab: "receipt",
          };

          const iconName = iconMap[route.name] || "help-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      })}
    >
      <Tabs.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="MenuTab"
        component={MenuStackNavigator}
        options={{ title: "Menu" }}
      />
      <Tabs.Screen
        name="TablesTab"
        component={TablesStackNavigator}
        options={{ title: "Tables" }}
      />
      <Tabs.Screen
        name="OrdersTab"
        component={OrderHistoryScreen}
        options={{ title: "Orders" }}
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useHydrateStores();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {!isAuthed ? (
        <RootStack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
}
