'use client'
import { ScreenPreferencesData } from '@/types/table/screen-preferences.type';
import { useState, useEffect } from 'react';

const mockScreenPreferences: ScreenPreferencesData = {
  per_page_values: [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ],
  preferences: {
    density: "standard",
    columnResizable: true,
    dataWrap: false,
    theme: "dark",
    per_page: 50,
  },
};

export const useScreenPreferences = () => {
  const [screenPreferences, setScreenPreferences] = useState<ScreenPreferencesData | null>(null);

  useEffect(() => {
    setScreenPreferences(mockScreenPreferences);
  }, []);

  return screenPreferences;
};
