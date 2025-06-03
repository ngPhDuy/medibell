import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { OnboardingProvider } from "./src/contexts/OnboardingContext";
import "./global.css";

import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://b357d6f132e06538ac796c28a0cad7de@o4509434349879296.ingest.us.sentry.io/4509434378125312",
  enableInExpoDevelopment: true,
  debug: true, // optional
});

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
