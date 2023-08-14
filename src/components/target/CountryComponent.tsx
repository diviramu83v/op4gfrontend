import { ITargetingCriteria, TargetingCriteriaContext } from '@/hooks/context/TargetingCriteriaContext';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';

import style from './Target.module.scss';
import TargetComponent from './TargetComponent';
import { useQuery } from '@tanstack/react-query';
import { fetchAPICountryResponse } from '@/api/Edit';
import { useRouter } from 'next/router';

const cx = classNames.bind(style);
interface CountryComponentProps {
  countryId: number;
}

export interface IQualifications {
  id: number;
  tblRFP_id: number;
  target_id: number;
  fieldName: string;
  fieldValue: string[] | string;
}

interface ITarget {
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

interface IRfpCountries {
  id: number;
  targets: ITarget[];
}

const CountryComponent: React.FC<CountryComponentProps> = ({ countryId }) => {
  const router = useRouter();
  const param = router.query.rfpId;
  const [rfpId, setRfpId] = useState<number>();

  useEffect(() => {
    setRfpId(parseInt(param as string, 10))
  }, [param])

  const [targets, setTargets] = useState<ITarget[]>([]);
  const { targetingCriteria, setTargetingCriteria: updateTargetingCriteria } = useContext(TargetingCriteriaContext);

  const [valueTab, setValueTab] = useState<string>('');

  const getRfpCountry = () => {
    const rfpCountry = targetingCriteria?.rfpCountries.find(
      item => item.id === countryId
    );
    if (rfpCountry) {
      setTargets(rfpCountry.targets);
      setValueTab(rfpCountry.targets[0].id.toString());
    }
  };

  useEffect(() => {
    getRfpCountry();
  }, []);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  const {
    isLoading: isLoadingResponse,
    isError: isErrorResponse,
    data: response,
    refetch: refetchResponse
  } = useQuery(['CountryResponse', rfpId, countryId], () => fetchAPICountryResponse({
    rfpId: rfpId,
    countryId: countryId
  }));

  useEffect(() => {
    const defaultTargeting = response?.payload;
    if (defaultTargeting) {
      const tempTargetingCriteria: IRfpCountries = {
        id: defaultTargeting.id,
        targets: defaultTargeting.rfp_targets.map(item => ({
          id: item.id,
          ir: item.ir !== null ? item.ir : 0,
          loi: item.loi !== null ? item.loi : 0,
          name: item.name,
          nsize: item.nsize !== null ? item.nsize : 0,
          targetTypeId: {
            label: item.target_type.name,
            value: item.target_type.id
          },
          quotas: item.quotas !== null ? item.quotas : 0,
          vendors: item.vendors_overview.map(vendor => ({
            label: vendor.name,
            value: vendor.id
          })),
          qualifications: item.rfp_target_qualifications.map(qua => ({
            id: qua.id,
            tblRFP_id: qua.tblRFP_id,
            target_id: qua.target_id,
            fieldName: qua.field_name,
            fieldValue: qua.field_value !== null ? qua.field_value : "" // Gán giá trị mặc định (ví dụ: "") nếu 'fieldValue' là null
          }))
        }))
      }

      setIsCriteriaUpdated(true);
      handleUpdateRfpCountry(tempTargetingCriteria)
    }
  }, [response]);

  const [isCriteriaUpdated, setIsCriteriaUpdated] = useState(false);
  useEffect(() => {
    if (isCriteriaUpdated) {
      setIsCriteriaUpdated(false);
      getRfpCountry();
    }
  }, [isCriteriaUpdated]);

  const handleUpdateRfpCountry = (value: IRfpCountries) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    let foundQualification = false;

    updatedCriteria.rfpCountries.forEach((country, index) => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId) {
        updatedCriteria.rfpCountries[index] = value;
        foundQualification = true;
      }
    });

    if (!foundQualification) {
      updatedCriteria.rfpCountries.push(value);
    }
    updateTargetingCriteria(updatedCriteria);
  };

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1', textAlign: 'center' }}>
        <TabContext value={valueTab}>
          <Box sx={{ borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <TabList
              onChange={handleChangeTab}
              aria-label='lab API tabs example'
            >
              {targets?.map(item => (
                <Tab
                  label={item.name}
                  value={item.id + ''}
                  key={item.id + ''}
                />
              ))}
            </TabList>
          </Box>
          {targets?.map(item => (
            <TabPanel
              value={item.id + ''}
              key={item.id + ''}
            >
              <TargetComponent
                targetId={item.id}
                countryId={countryId}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </>
  );
};

export default CountryComponent;
