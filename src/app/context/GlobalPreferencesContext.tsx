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

  const [preferences, setPreferences] = useState<
    { density: string; columnResizable: boolean; dataWrap: boolean; theme: string; per_page: number } | null
  >(null);

  useEffect(() => {
    if (screenPreferences) {
      setPreferences(screenPreferences.preferences);
    }
  }, [screenPreferences]);

  useEffect(() => {
    if (filterData.length === 0) {
      dispatch(fetchFilterData());
    }
  }, [filterData, dispatch]);

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

  if (!screenPreferences || !preferences || !filterData) {
    return <div>Loading preferences...</div>;
  }

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