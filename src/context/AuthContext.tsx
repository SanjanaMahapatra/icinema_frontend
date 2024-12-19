import React, { createContext, useContext, useState, ReactNode, useRef, useMemo } from 'react';

interface ShowDetails {
  theatreName : string,
  movieName : string,
  showTime : string,
  showDate : { day: string, date: string, month: string, isSelected: boolean, string_date_format: string }
}
interface AuthContextType {
  showLoginModal: string;
  setShowLoginModal: (show: string) => void;
  selectedSeatsCount: number;
  setSelectedSeatsCount: (count: number) => void;
  btnref: React.RefObject<HTMLButtonElement>;
  selectedShowDetails: ShowDetails;
  setSelectedShowDetails: (showDetails: ShowDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState("");
  const [selectedSeatsCount, setSelectedSeatsCount] = useState(2);
  const btnref = useRef<HTMLButtonElement>(null);
  const [selectedShowDetails, setSelectedShowDetails] = useState<ShowDetails>({
    theatreName: '',
    movieName: '',
    showTime: '',
    showDate: { day: '', date: '', month: '', isSelected: false, string_date_format: '' }
  });

  const contextValue = useMemo(
    () => ({
      showLoginModal,
      setShowLoginModal,
      btnref,
      selectedSeatsCount,
      setSelectedSeatsCount,
      selectedShowDetails,
      setSelectedShowDetails
    }),
    [showLoginModal, selectedSeatsCount, selectedShowDetails] 
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};