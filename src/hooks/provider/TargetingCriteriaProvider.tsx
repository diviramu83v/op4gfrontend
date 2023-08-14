import { createContext, useContext, useState, ReactNode } from 'react';
import { ITargetingCriteria, TargetingCriteriaContext } from '../context/TargetingCriteriaContext';

interface TargetingCriteriaProviderProps {
  children: ReactNode;
}

export const TargetingCriteriaProvider: React.FC<TargetingCriteriaProviderProps> = ({
  children,
}) => {
  const initialTargetingCriteria: ITargetingCriteria = {
    rfpId: 0,
    rfpCountries: []
  };

  const [targetingCriteria, setTargetingCriteria] = useState<ITargetingCriteria | null>(
    initialTargetingCriteria
  );

  return (
    <TargetingCriteriaContext.Provider
      value={{ targetingCriteria, setTargetingCriteria }}
    >
      {children}
    </TargetingCriteriaContext.Provider>
  );
};
