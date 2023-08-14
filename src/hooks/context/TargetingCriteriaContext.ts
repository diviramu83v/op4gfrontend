import { createContext, useContext } from 'react';

export interface IQualifications {
  id: number;
  tblRFP_id: number;
  target_id: number;
  fieldName: string;
  fieldValue: string[] | string;
}

export interface ITarget {
  id: number;
  name: string;
  ir: number;
  loi: number;
  nsize: number;
  targetTypeId: {
    label: string;
    value: number;
  };
  quotas: number;
  vendors: {
    label: string;
    value: number;
  }[];
  qualifications: IQualifications[];
}

export interface IRfpCountries {
  id: number;
  targets: ITarget[];
}

export interface ITargetingCriteria {
  rfpId: number;
  rfpCountries: IRfpCountries[];
}

export interface ITargetingCriteriaContext {
  targetingCriteria: ITargetingCriteria | null;
  setTargetingCriteria: (criteria: ITargetingCriteria) => void;
}

export const TargetingCriteriaContext = createContext<ITargetingCriteriaContext>({
  targetingCriteria: null,
  setTargetingCriteria: () => {}
});

export const useTargetingCriteria = () => {
  const context = useContext(TargetingCriteriaContext);
  if (context === null) {
    throw new Error(
      'useTargetingCriteria must be used within a TargetingCriteriaProvider'
    );
  }
  return context;
};
