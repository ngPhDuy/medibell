import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { OnboardingProvider } from "./src/contexts/OnboardingContext";
import "./global.css";

export default function App() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </OnboardingProvider>
  );
}
