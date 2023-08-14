export interface LandingInternalData {
  wo: number;
  clientName: string;
  projectName: string;
  vendorsInvited: number;
  vendorsResponded: number;
  assignedTo: string;
  bidDueDate: string;
  id: number;
}

export interface OptionType {
  label: string;
  value: string;
}


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

export interface ITargetCountry {
  id: number;
  name: string;
  target: number;
}

export interface ITargetResponse {
  id: number;
  name: string;
}

export interface IRfpCountriesResponse {
  id: number;
  countryName: string;
  targets: ITargetResponse[];
}

export interface TabItem {
  id: number;
  countryName: string;
}

export interface CountryItem {
  label: string;
  value: string;
}

export interface OptionType {
  label: string;
  value: string;
}

export interface QualificationLists {
  [key: string]: string[];
}