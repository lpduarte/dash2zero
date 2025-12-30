import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserType } from '@/types/user';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  isEmpresa: boolean;
  isMunicipio: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>('empresa');
  
  // Por enquanto, mock user como empresa
  // Será substituído por login real no futuro
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Empresa Demo',
    email: 'demo@empresa.pt',
    userType: 'empresa',
    createdAt: new Date(),
  });

  const isEmpresa = userType === 'empresa';
  const isMunicipio = userType === 'municipio';

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    if (user) {
      setUser({
        ...user,
        userType: type,
        name: type === 'empresa' ? 'Empresa Demo' : 'Município Demo',
        municipality: type === 'municipio' ? 'Porto' : undefined,
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      userType,
      setUserType: handleSetUserType,
      isEmpresa, 
      isMunicipio 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
