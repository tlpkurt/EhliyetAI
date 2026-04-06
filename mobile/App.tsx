import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AIAnalysisScreen } from './src/screens/AIAnalysisScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MockExamScreen } from './src/screens/MockExamScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { QuestionSolveScreen } from './src/screens/QuestionSolveScreen';

type RootTabParamList = {
  Home: undefined;
  Lessons: undefined;
  Tests: undefined;
  AICoach: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function MainNavigator() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#1f8bff" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1f8bff',
          tabBarInactiveTintColor: '#94a8c6',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '700',
            marginBottom: 4,
          },
          tabBarStyle: {
            height: 82,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: '#d9e5f5',
            backgroundColor: '#ffffff',
          },
          tabBarIcon: ({ color, size }) => {
            const iconSize = size + 2;

            if (route.name === 'Home') {
              return <Ionicons name="home-outline" size={iconSize} color={color} />;
            }

            if (route.name === 'Lessons') {
              return <Ionicons name="book-outline" size={iconSize} color={color} />;
            }

            if (route.name === 'Tests') {
              return <Ionicons name="clipboard-outline" size={iconSize} color={color} />;
            }

            if (route.name === 'AICoach') {
              return <Ionicons name="hardware-chip-outline" size={iconSize} color={color} />;
            }

            return <Ionicons name="person-outline" size={iconSize} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', tabBarLabel: 'Home' }} />
        <Tab.Screen
          name="Lessons"
          component={QuestionSolveScreen}
          options={{ title: 'Lessons', tabBarLabel: 'Lessons' }}
        />
        <Tab.Screen name="Tests" component={MockExamScreen} options={{ title: 'Tests', tabBarLabel: 'Tests' }} />
        <Tab.Screen name="AICoach" component={AIAnalysisScreen} options={{ title: 'AI Coach', tabBarLabel: 'AI Coach' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
  },
});
