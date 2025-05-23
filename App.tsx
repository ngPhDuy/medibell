import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { OnboardingProvider } from "./src/contexts/OnboardingContext";
import "./global.css";

export default function App() {
  return (
    <OnboardingProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </OnboardingProvider>
  );
}
