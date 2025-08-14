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
import { RestaurantTheme } from "../theme"; // Import the theme

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

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type OrderStackParamList = {
  OrderHistory: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();
const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const TablesStack = createNativeStackNavigator<TablesStackParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const OrderStack = createNativeStackNavigator<OrderStackParamList>();

function MenuStackNavigator() {
  return (
    <MenuStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
        headerTitleStyle: {
          color: RestaurantTheme.colors.primary,
          fontWeight: 800,
        },
        headerTintColor: RestaurantTheme.colors.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
      }}
    >
      <MenuStack.Screen
        name="MenuList"
        component={MenuListScreen}
        options={{ title: "Menu Items" }}
      />
      <MenuStack.Screen
        name="MenuEdit"
        component={MenuEditScreen}
        options={{ title: "Edit Menu Item" }}
      />
    </MenuStack.Navigator>
  );
}

function TablesStackNavigator() {
  return (
    <TablesStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
        headerTitleStyle: {
          color: RestaurantTheme.colors.primary,
          fontWeight: 800,
        },
        headerTintColor: RestaurantTheme.colors.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
      }}
    >
      <TablesStack.Screen
        name="Tables"
        component={TablesScreen}
        options={{ title: "Tables" }}
      />
      <TablesStack.Screen
        name="OrderCreate"
        component={OrderCreateScreen}
        options={{ title: "Create Order" }}
      />
    </TablesStack.Navigator>
  );
}

function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
        headerTitleStyle: {
          color: RestaurantTheme.colors.primary,
          fontWeight: 800,
        },
        headerTintColor: RestaurantTheme.colors.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
      }}
    >
      <DashboardStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
    </DashboardStack.Navigator>
  );
}

function OrdersStackNavigator() {
  return (
    <OrderStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
        headerTitleStyle: {
          color: RestaurantTheme.colors.primary,
          fontWeight: 800,
        },
        headerTintColor: RestaurantTheme.colors.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
      }}
    >
      <OrderStack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: "Order History" }}
      />
    </OrderStack.Navigator>
  );
}


function MainTabs() {
  return (
    <Tabs.Navigator
      id={undefined}
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
        tabBarActiveTintColor: RestaurantTheme.colors.primary,
        tabBarInactiveTintColor: RestaurantTheme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: RestaurantTheme.colors.cardBackground,
          borderTopColor: RestaurantTheme.colors.cardBorder,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen
        name="DashboardTab"
        component={DashboardStackNavigator}
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
        component={OrdersStackNavigator}
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
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: RestaurantTheme.colors.background
      }}>
        <ActivityIndicator
          size="large"
          color={RestaurantTheme.colors.primary}
        />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: RestaurantTheme.colors.background,
        },
      }}
    >
      {!isAuthed ? (
        <RootStack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
}