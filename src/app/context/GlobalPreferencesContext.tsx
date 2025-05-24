"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useScreenPreferences } from "../hooks/useScreenPreferences";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterData } from "@/Store/Slices/filterDataSlice";
import { AppDispatch, RootState } from "@/Store/Store";
import { GlobalPreferencesContextType } from "@/Types/Table/tableTypes";


const GlobalPreferencesContext = createContext<GlobalPreferencesContextType | null>(null);

export const GlobalPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const screenPreferences = useScreenPreferences();
  const dispatch = useDispatch<AppDispatch>();
  const filterData = useSelector((state: RootState) => state.filterData.data);

  // Manage preferences state separately, initialized with screenPreferences.preferences
  const [preferences, setPreferences] = useState<
    { density: string; columnResizable: boolean; dataWrap: boolean; theme: string; per_page: number } | null
  >(null);

  // Initialize preferences when screenPreferences is available
  useEffect(() => {
    if (screenPreferences) {
      setPreferences(screenPreferences.preferences);
    }
  }, [screenPreferences]);

  // Fetch filter data if not already loaded
  useEffect(() => {
    if (filterData.length === 0) {
      dispatch(fetchFilterData());
    }
  }, [filterData, dispatch]);

  // Function to update preferences with partial updates
  const updatePreferences = (
    newPreferences: Partial<{
      density: string;
      columnResizable: boolean;
      dataWrap: boolean;
      theme: string;
      per_page: number;
    }>
  ) => {
    setPreferences((prev) => (prev ? { ...prev, ...newPreferences } : null));
  };

  // Wait until all required data is loaded
  if (!screenPreferences || !preferences || !filterData) {
    return <div>Loading preferences...</div>;
  }

  // Construct the context value
  const contextValue: GlobalPreferencesContextType = {
    per_page_values: screenPreferences.per_page_values,
    preferences,
    filterData,
    updatePreferences,
  };

  return (
    <GlobalPreferencesContext.Provider value={contextValue}>
      {children}
    </GlobalPreferencesContext.Provider>
  );
};

export const useGlobalPreferencesContext = () => {
  const context = useContext(GlobalPreferencesContext);
  if (!context) throw new Error("useGlobalPreferencesContext must be used within a GlobalPreferencesProvider");
  return context;
};