import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingContextType = {
  hasSeenOnboarding: boolean | null;
  setHasSeenOnboarding: (value: boolean) => void;
};

const OnboardingContext = createContext<OnboardingContextType>({
  hasSeenOnboarding: null,
  setHasSeenOnboarding: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const fetch = async () => {
      const val = await AsyncStorage.getItem("hasSeenOnboarding");
      console.log(val);
      if (val === null) {
        setHasSeenOnboardingState(false);
        return;
      }
      setHasSeenOnboardingState(val === "true");
    };
    fetch();
  }, []);

  const setHasSeenOnboarding = async (value: boolean) => {
    console.log("setHasSeenOnboarding", value);
    await AsyncStorage.setItem("hasSeenOnboarding", value ? "true" : "false");
    setHasSeenOnboardingState(value);
  };

  return (
    <OnboardingContext.Provider
      value={{ hasSeenOnboarding, setHasSeenOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
