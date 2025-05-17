import React, { useMemo } from "react";
import { InfoModal } from "../components";
import { MessageModal } from "../types/global.type";

interface RentalPropertyContextType {
  isMapView: boolean;
  propertyCount: number;
  setPropertyCount: React.Dispatch<React.SetStateAction<number>>;
  setIsMapView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RentalPropertyContext =
  React.createContext<RentalPropertyContextType>({
    isMapView: false,
    propertyCount: 0,
    setPropertyCount: () => {},
    setIsMapView: () => {},
  });

export function RentalPropertyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMapView, setIsMapView] = React.useState<boolean>(false);
  const [propertyCount, setPropertyCount] = React.useState<number>(0);

  const value = useMemo(
    () => ({ propertyCount, setPropertyCount, isMapView, setIsMapView }),
    [setPropertyCount, setIsMapView]
  );
  return (
    <RentalPropertyContext.Provider value={value}>
      {children}
    </RentalPropertyContext.Provider>
  );
}
