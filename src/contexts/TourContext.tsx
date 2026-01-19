import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TourContextType {
  isTourRunning: boolean;
  startTour: () => void;
  stopTour: () => void;
  tourCompleted: boolean;
  setTourCompleted: (completed: boolean) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(() => {
    return localStorage.getItem("dash2zero-tour-completed") === "true";
  });

  const startTour = useCallback(() => {
    setIsTourRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourRunning(false);
  }, []);

  const handleSetTourCompleted = useCallback((completed: boolean) => {
    setTourCompleted(completed);
    localStorage.setItem("dash2zero-tour-completed", String(completed));
  }, []);

  return (
    <TourContext.Provider
      value={{
        isTourRunning,
        startTour,
        stopTour,
        tourCompleted,
        setTourCompleted: handleSetTourCompleted,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
