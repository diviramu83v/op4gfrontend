import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import classNames from 'classnames/bind';
import style from './search.module.scss';
import IconButton from '@mui/material/IconButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SelectReact, { ActionMeta, MultiValue } from 'react-select';
import {
  AGE_GROUP_OPTIONS,
  GENDER_IDENTITY_OPTIONS,
  HHI_OPTIONS,
  EDUCATION_OPTIONS,
  PARENTAL_STATUS_OPTIONS,
  HOUSEHOLD_DECISION_MAKER_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  AUTO_MAKE_OPTIONS,
  SMOKER_TYPE_OPTIONS,
  GAMERS_GAME_TYPE_OPTIONS,
  PET_TYPE_OPTIONS,
  BIG_TICKET_PURCHASES_OPTIONS,
  SMART_HOME_DEVICES_OPTIONS
} from './consumer';
import {
  EMPLOYEE_SIZE_OPTIONS,
  COMPANY_REVENUE_OPTIONS,
  ROLE_OPTIONS,
  INDUSTRY_OPTIONS,
  DECISION_MAKER_OPTIONS
} from './b2b';

import {
  MEDICAL_CONDITION_OPTIONS,
  MEDICAL_CONDITION_GROUP_OPTIONS
} from './patient';

import {
  CAREGIVER_TYPE_OPTIONS
} from './caregivers';

import {
  HEALTHCARE_ROLE_OPTIONS,
  PRACTICE_SETTING_OPTIONS,
  PRIMARY_SPECIALTY_OPTIONS,
  SPECIALTY_AREA_OPTIONS
} from './hcps';

import {
  GENDER_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ETHNICITY_OPTIONS,
} from './common';
import { TargetingCriteriaContext } from '@/hooks/context/TargetingCriteriaContext';
import { useRouter } from 'next/router';


const cx = classNames.bind(style);

type SearchProps = {
  selectedTargetType: number;
  qualification: string;
  countryId: number;
  targetId: number;
  isUpdate: boolean;
};

interface OptionType {
  label: string;
  value: string;
}

const SearchComponent = ({ selectedTargetType, qualification, countryId, targetId, isUpdate }: SearchProps) => {
  // Function to get the qualification options based on selectedTargetType
  const getQualificationOptions = (selectedTargetType: string, qualification: string) => {
    switch (selectedTargetType) {
      case 'Age Group':
        return AGE_GROUP_OPTIONS;
      case 'Gender: Sex assigned at birth':
        return GENDER_OPTIONS;
      case 'Gender Identity':
        return GENDER_IDENTITY_OPTIONS;
      case 'HHI':
        return HHI_OPTIONS;
      case 'Employment Status':
        return EMPLOYMENT_STATUS_OPTIONS;
      case 'Education':
        return EDUCATION_OPTIONS;
      case 'Ethnicity':
        return ETHNICITY_OPTIONS;
      case 'Parental Status':
        return PARENTAL_STATUS_OPTIONS;
      case 'Household Decision Maker':
        return HOUSEHOLD_DECISION_MAKER_OPTIONS;
      case 'Vehicle Type':
        return VEHICLE_TYPE_OPTIONS;
      case 'Auto Make':
        return AUTO_MAKE_OPTIONS;
      case 'Smoker Type':
        return SMOKER_TYPE_OPTIONS;
      case 'Gamers_Game Type':
        return GAMERS_GAME_TYPE_OPTIONS;
      case 'Pet Type':
        return PET_TYPE_OPTIONS;
      case 'Big Ticket Purchases':
        return BIG_TICKET_PURCHASES_OPTIONS;
      case 'Smart Home Devices':
        return SMART_HOME_DEVICES_OPTIONS;
      case 'Employee Size':
        return EMPLOYEE_SIZE_OPTIONS;
      case 'Company Revenue':
        return COMPANY_REVENUE_OPTIONS;
      case 'Role':
        return ROLE_OPTIONS;
      case 'Industry':
        return INDUSTRY_OPTIONS;
      case 'Decision Maker':
        return DECISION_MAKER_OPTIONS;
      case 'Medical Condition':
        return MEDICAL_CONDITION_OPTIONS;
      case 'Medical Condition Group':
        return MEDICAL_CONDITION_GROUP_OPTIONS;
      case 'Caregiver Type':
        return CAREGIVER_TYPE_OPTIONS;
      case 'Healthcare Role':
        return HEALTHCARE_ROLE_OPTIONS;
      case 'Practice Setting':
        return PRACTICE_SETTING_OPTIONS;
      case 'Primary Specialty':
        return PRIMARY_SPECIALTY_OPTIONS;
      case 'Specialty Area':
        return SPECIALTY_AREA_OPTIONS;
      default:
        return [];
    }
  };


  const { targetingCriteria, setTargetingCriteria } = useContext(
    TargetingCriteriaContext
  );

  useEffect(() => {
    getInitValue();
  }, []);

  useEffect(() => {
    getInitValue();
  }, [qualification]);

  const handleUpdateTarget = (value: string | string[]) => {

    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    let foundQualification = false;

    updatedCriteria.rfpCountries.forEach((country) => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId) {
        country.targets.forEach((target) => {
          if (target.id === targetId) {
            target.qualifications.forEach((item, index) => {
              if (item.fieldName === qualification) {
                if (value === '' || value === '0 - 0') {
                  // If value is empty, remove the qualification
                  target.qualifications.splice(index, 1);
                } else {
                  item.fieldValue = value as string[];
                }
                foundQualification = true;
              }
            });

            if (!foundQualification && value !== '') {
              target.qualifications.push({
                id: 0,
                target_id: 0,
                tblRFP_id: 0,
                fieldName: qualification,
                fieldValue: value as string[],
              });
            }
          }
        });
      }
    });

    setTargetingCriteria(updatedCriteria);
  };

  const getInitValue = () => {
    if (!targetingCriteria) {
      return;
    }

    targetingCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.qualifications.forEach(item => {
              if (item.fieldName === qualification) {
                if (qualification === 'Age Group') {
                  const values = item.fieldValue.toString().split(" - ");
                  const value1 = parseInt(values[0]);
                  const value2 = parseInt(values[1]);
                  setValue1(value1);
                  setValue2(value2);
                } else {
                  if (isUpdate) {
                    const store = parseStringToArray(item.fieldValue).map(item => ({
                      label: item + '',
                      value: item + ''
                    }))
                    setSelectedQualificationStore(store)
                  } else {
                    const store = Array.isArray(item.fieldValue)
                      ? item.fieldValue.map(item => ({
                        label: item + '',
                        value: item + ''
                      }))
                      : [];
                    setSelectedQualificationStore(store)
                  }
                }
              }
            });
          }
        });
    });
  }

  function parseStringToArray(str: any): string[] {
    try {
      const cleanStr = str.replace('["', '');
      const cleanString = cleanStr.replace('"]', '');

      const stringArray = cleanString.split('", "').map((item: any) => item.trim());

      return stringArray;
    } catch (error) {
      console.error('Error parsing string to array:', error);
      return [];
    }
  }

  const [value1, setValue1] = useState<number>(0);
  const [value2, setValue2] = useState<number>(0);
  const minValue = 0;
  const maxValue = 99;

  const handleIncrement1 = () => {
    if (value1 < maxValue) {
      setValue1((prevValue) => prevValue + 1);
      handleUpdateTarget((value1 + 1) + ' - ' + value2);
    }
  };

  const handleDecrement1 = () => {
    if (value1 > minValue) {
      setValue1((prevValue) => prevValue - 1);
      handleUpdateTarget((value1 - 1) + ' - ' + value2);
    }
  };

  const handleIncrement2 = () => {
    if (value2 < maxValue) {
      setValue2((prevValue) => prevValue + 1);
      handleUpdateTarget(value1 + ' - ' + (value2 + 1));
    }
  };

  const handleDecrement2 = () => {
    if (value2 > minValue) {
      setValue2((prevValue) => prevValue - 1);
      handleUpdateTarget(value1 + ' - ' + (value2 - 1));
    }
  };

  useEffect(() => {
    const options = getQualificationOptions(qualification, '_');
    const defaultOption: OptionType[] = options.map(item => ({
      label: item,
      value: item
    }))
    setSelectedQualifications(defaultOption)
  }, [qualification])

  const [selectedQualifications, setSelectedQualifications] = React.useState<OptionType[]>([]);
  const [selectedQualificationStore, setSelectedQualificationStore] = React.useState<OptionType[]>([]);

  const handleChangeSelect = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    const selectedValues: string[] = newValue.map(item => item.value);
    handleUpdateTarget(selectedValues);
    setSelectedQualificationStore(newValue as OptionType[]);
  };

  return (
    <div>
      {qualification !== 'Age Group' ? (
        <>
          <Box width='70%' minWidth='300px' mx='auto' my='20px' mb='40px'>
            <SelectReact
              isMulti
              required
              name="Qualification"
              value={selectedQualificationStore}
              options={selectedQualifications}
              className={cx('basic-multi-select')}
              classNamePrefix="select"
              onChange={handleChangeSelect}
            />
          </Box>
        </>
      ) : (
        <>
          <div className={cx('input-with-buttons-container')}>
            <div className={cx("input-group")}>
              <IconButton onClick={handleIncrement1}>
                <ArrowDropUpIcon />
              </IconButton>
              <input type="text" value={value1} readOnly />
              <IconButton onClick={handleDecrement1}>
                <ArrowDropDownIcon />
              </IconButton>
            </div>
            <div className={cx("input-group")}>
              <IconButton onClick={handleIncrement2}>
                <ArrowDropUpIcon />
              </IconButton>
              <input type="text" value={value2} readOnly />
              <IconButton onClick={handleDecrement2}>
                <ArrowDropDownIcon />
              </IconButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchComponent;
