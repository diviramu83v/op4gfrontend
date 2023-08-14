import fetchAPICountry from '@/api/Country';
import fetchAPIProject from '@/api/Project';
import { postAPITargetingCriteria, postCreateBid, putCreateBid, putCreateCountry } from '@/api/Rfp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Menu,
  Tab,
  TextField
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { VariantType, useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SelectReact, { ActionMeta, MultiValue } from 'react-select';

import { CountryItem, IRfpCountriesResponse, ITarget, ITargetCountry, ITargetingCriteria, OptionType, TabItem } from '@/models/supply-request.model';
import fetchAPITargetType from '@/api/TargetType';
import CountryComponent from '@/components/target/CountryComponent';
import  BouncingDotsLoader from '@/components/boundLoading/boundLoading';
import { useTargetingCriteria } from '../../hooks/context/TargetingCriteriaContext';
import { useRouter } from 'next/router';
import { fetchAPIBidResponse } from '@/api/Edit';
import style from './CreateBid.module.scss';

const cx = classNames.bind(style);

const CreateBID = () => {
  const { isLoading, data: targetTypes } = useQuery(
    ['targetTypes'],
    () => fetchAPITargetType()
  );
  // const [qualificationLists, setQualificationLists] = useState<QualificationLists>(qualifications);
  const [selectedProjectID, setSelectedProjectID] = useState<string>('');
  const [tab, setTab] = useState<TabItem[]>([]);

  const {
    isLoading: isLoadingCountry,
    isError: isErrorCountry,
    data: countries
  } = useQuery(['countries'], () => fetchAPICountry());

  useEffect(() => {
    if (!isLoadingCountry && countries) {
      handleCountriesName();
    }
  }, [isLoadingCountry, countries]);

  const [totalNSize, setTotalNSize] = useState<number>(0);
  const [noOfOpenEnds, setNoOfOpenEnds] = useState<number>(0);
  const [additionalDetails, setAdditionalDetails] = useState<string>('');

  const [isDisableTab, setIsDisableTab] = useState<boolean>(true);
  const [value, setValue] = useState('createbid');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [countriesNames, setCountriesNames] = useState<CountryItem[]>();

  const handleCountriesName = () => {
    const tempCountriesNames = countries?.payload.map(item => ({
      label: item.name,
      value: item.name
    }));
    setCountriesNames(tempCountriesNames);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleClickSuccess = (variant: VariantType) => {
    enqueueSnackbar('Submited successfully!', {
      variant,
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };

  // Drag a csv file
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [fileUpload, setFileUpload] = useState<File>();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFileName(acceptedFiles[0].name);
    setFileUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleRemoveFile = () => {
    setUploadedFileName('');
    setFileUpload(undefined);
  };

  //select
  const [selectedCountryStore, setSelectedCountryStore] = React.useState<CountryItem[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<string[]>([]);
  const [targetCountry, setTargetCountry] = React.useState<ITargetCountry[]>([]);

  const handleChangeSelect = (newValue: MultiValue<CountryItem>, actionMeta: ActionMeta<CountryItem>) => {
    const selectedValues: string[] = newValue.map(item => item.value);
    setSelectedCountry(selectedValues);
    setSelectedCountryStore(newValue as CountryItem[]);
  };

  const handleTargetChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    countryName: string
  ) => {
    const updatedTargetCountry = targetCountry.map(country => {
      if (country.name === countryName) {
        return { ...country, target: parseInt(event.target.value) };
      }
      return country;
    });
    setTargetCountry(updatedTargetCountry);
  };

  useEffect(() => {
    const updateTargetCountry = selectedCountry.map(item => ({
      id: getCountryID(item),
      name: item,
      target: 1
    }));
    setTargetCountry(updateTargetCountry);
  }, [selectedCountry]);

  const getCountryID = (countryName: string) => {
    const country = countries?.payload.find(item => item.name === countryName);
    if (country) {
      return country.id;
    }
    return 0;
  };
  //submit
  const [mutationResponse, setMutationResponse] = useState<IRfpCountriesResponse[]>();

  const mutationPost = useMutation(postCreateBid, {
    onSuccess: async data => {
      if (data.success) {
        setIsDisableTab(false);
        if (data.payload.rfpCountries) {
          setMutationResponse(data.payload.rfpCountries);
          const tab = data.payload.rfpCountries.map(item => ({
            id: item.id,
            countryName: item.countryName
          }))
          setTab(tab)
        }
        let tempTargeting: ITargetingCriteria = {
          rfpId: data.payload.rfpId,
          rfpCountries: data.payload.rfpCountries.map(item => {
            const noOfTarget = item.targets.length;
            const targets: ITarget[] = [];

            if (targetTypes)
              item.targets.map(target => {
                targets.push({
                  id: target.id,
                  name: target.name,
                  ir: 0,
                  loi: 0,
                  nsize: 0,
                  targetTypeId: {
                    label: targetTypes[0].name,
                    value: targetTypes[0].id
                  },
                  quotas: 0,
                  vendors: [],
                  qualifications: []
                  // qualifications: qualificationLists[1].map(item => ({
                  //   fieldName: item,
                  //   fieldValue: ''
                  // }))
                });
              });

            return {
              id: item.id,
              targets: targets
            };
          })
        };
        await updateTargetingCriteria(tempTargeting);
        setValue(data.payload.rfpCountries[0].id + '')
        handleClickSuccess('success');
      } else {
        setIsDisableTab(true);
        handleClickSuccess('error');
      }
    }
  });

  const mutationPut = useMutation(putCreateBid, {
    onSuccess: data => {
      if (data.success) {
        setValue(tab[0].id + '')
        setIsDisableTab(false);
        handleClickSuccess('success');
      } else {
        setIsDisableTab(true);
        handleClickSuccess('error');
      }
    }
  })

  const [pi, setPi] = useState<string>('true');
  const [qualfollowup, setQualfollowup] = useState<string>('true');
  const [tracker, setTracker] = useState<string>('true');

  const { targetingCriteria, setTargetingCriteria: updateTargetingCriteria } = useTargetingCriteria();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    targetCountry.map((item, index) => {
      formData.append(`countries[${index}][id]`, item.id.toString());
      formData.append(`countries[${index}][noOfTargets]`, item.target.toString());
    });

    if (fileUpload) {
      formData.append('file', fileUpload);
    } else {
      formData.append('file', '');
    }
    formData.append('projectId', selectedProjectID);
    formData.append('pi', pi);
    formData.append('qualfollowup', qualfollowup);
    formData.append('tracker', tracker);
    formData.append('noOfCountries', selectedCountry.length.toString());

    if (!isNaN(rfpId!)) {
      mutationPut.mutate({
        rfpId: rfpId,
        formData: formData
      })
    } else {
      mutationPost.mutate(formData);
    }
  };

  const [searchText, setSearchText] = useState<string>('');
  const [projectName, setProjectName] = useState<OptionType[]>([]);
  const [selectedProject, setSelectedProject] = useState<OptionType>();

  const {
    isLoading: isLoadingProject,
    isError: isErrorProject,
    data: projects,
    refetch: refetchProjects
  } = useQuery(['projects', searchText], () => fetchAPIProject(searchText));

  useEffect(() => {
    const tempProject = projects?.map(item => ({
      label: item.name,
      value: item.id.toString()
    }));
    if (tempProject) setProjectName(tempProject);
  }, [projects])

  const handleChangeSelectProject = (newValue: OptionType | null, actionMeta: ActionMeta<OptionType>) => {
    if (newValue) {
      const selectedValue = {
        label: newValue.label,
        value: newValue.value
      };
      setSelectedProjectID(newValue.value);
      setSelectedProject(selectedValue);
    } else {
      setSelectedProject(undefined);
    }
  };

  const handleSearchTextChangeProject = (searchText: string) => {
    setSearchText(searchText);
    refetchProjects(); // Fetch updated data based on the search text
  };

  const mutationTargeting = useMutation(postAPITargetingCriteria, {
    onSuccess: data => {
      if (data.success) {
        router.push(`/partner-rfq?rfpid=${data.payload.rfpId}`)
        handleClickSuccess('success');
      } else {
        handleClickSuccess('error');
      }
    }
  });

  const getTargeting = (data: ITargetingCriteria) => {
    const newTargeting = {
      rfpId: data.rfpId,
      rfpCountries: data.rfpCountries.map((country) => ({
        id: country.id,
        targets: country.targets.map((target) => ({
          ...target,
          targetTypeId: target.targetTypeId.value,
          vendors: target.vendors.map(item => item.value)
        }))
      }))
    }

    return newTargeting;
  }

  const mutationCountry = useMutation(putCreateCountry, {
    onSuccess: data => {
      if (data.success) {
        if (isNext)
          router.push(`/partner-rfq?rfpid=${rfpId}`)
        removeCountryTargeting(rfpId!)
        handleClickSuccess('success');
      } else {
        handleClickSuccess('error');
      }
    }
  });

  const handleSave = () => {
    if (!isNaN(rfpId!)) {
      getTargeting(targetingCriteria!).rfpCountries.map((item, index) => {
        mutationCountry.mutate({
          rfpId: rfpId,
          data: {
            rfpCountries: [
              item
            ]
          }
        })
      })

      if (isLastTarget(parseInt(value))) {
        setIsNext(true)
      } else {
        setIsNext(false)
      }
    } else {
      mutationTargeting.mutate(getTargeting(targetingCriteria!));
    }
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsExpanded(false);
  };

  const isLastTarget = (countryId: number) => {
    let isLast = false;

    if (tab[tab.length - 1].id === countryId) {
      isLast = true;
    }

    return isLast;
  }

  const nextTab = (countryId: number) => {
    setValue(countryId + '')
  }

  // Edit mode
  const router = useRouter();
  const param = router.query.rfpId;
  const [rfpId, setRfpId] = useState<number>();
  const [isDisabledUpdate, setIsDisableUpdate] = useState<boolean>(true)
  const [isNext, setIsNext] = useState<boolean>(false)

  // useEffect(() => {
  //   if (isNext)
  //     router.push(`/partner-rfq?rfpid=${rfpId}`)
  // }, [isNext])

  useEffect(() => {
    setRfpId(parseInt(param as string, 10))
  }, [param])

  useEffect(() => {
    if (isNaN(rfpId!)) {
      setIsDisableUpdate(true)
    } else {
      setIsDisableUpdate(false)
    }
  }, [rfpId])

  const {
    isLoading: isLoadingCountryResponse,
    isError: isErrorCountryResponse,
    data: countryResponse,
    refetch: refetchCountryResponse
  } = useQuery(['BidResponse', rfpId], () => fetchAPIBidResponse(rfpId!));

  useEffect(() => {
    if (countryResponse?.success) {
      setTotalNSize(countryResponse.payload.total_n_size)
      setNoOfOpenEnds(countryResponse.payload.no_of_open_ends)
      setAdditionalDetails(countryResponse.payload.additional_details)
      setPi(countryResponse.payload.pi + '')
      setQualfollowup(countryResponse.payload.qualfollowup + '')
      setTracker(countryResponse.payload.tracker + '')
      const defaultTargetCountry = countryResponse.payload.rfp_countries.map(item => ({
        id: item.country.id,
        name: item.country.name,
        target: item.targetCount
      }))
      setTargetCountry(defaultTargetCountry)
      setSelectedProject({
        label: countryResponse.payload.project.name,
        value: countryResponse.payload.project.id + ''
      })
      const defaultCountryStore = countryResponse.payload.rfp_countries.map(item => ({
        value: item.country.id + '',
        label: item.country.name,
      }))
      setSelectedCountryStore(defaultCountryStore)
      const tab = countryResponse.payload.rfp_countries.map(item => ({
        id: item.id,
        countryName: item.country.name
      }))
      const countryName = countryResponse.payload.rfp_countries.map(item => item.country.name)
      setSelectedCountry(countryName)
      setTab(tab)
      const filePath = countryResponse.payload?.attachmentFile?.source;
      if(filePath){
        const uploadedFileName: string | undefined = filePath.split('redirect/').pop();
        uploadedFileName && setUploadedFileName(uploadedFileName);
      }
      
      if (rfpId) {
        const tempTargetingCriteria: ITargetingCriteria = {
          rfpId: rfpId,
          rfpCountries: []
        }
        console.log(tempTargetingCriteria)

        updateTargetingCriteria(tempTargetingCriteria);
      }
    }
  }, [countryResponse])

  const removeCountryTargeting = (id: number) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach((country) => {
      if (!country.targets) {
        return;
      }
      const indexToRemove = updatedCriteria.rfpCountries.findIndex((item) => item.id === id);
      updatedCriteria.rfpCountries.splice(indexToRemove, 1);
    });

    updateTargetingCriteria(updatedCriteria);
  };

  return (
    <>
      <form
        action=''
        onSubmit={handleSubmit}
      >
        <Box className={cx('w100p')}>
          <Box className={cx('container', 'my20')}>
            <Box>RFP {selectedCountry.length} Countries</Box>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  aria-label='Bid Details'
                  onChange={handleChange}
                >
                  <Tab
                    label='Bid Details'
                    value='createbid'
                  />
                  {tab?.map(country => (
                    <Tab
                      key={country.id}
                      label={country.countryName}
                      value={country.id + ''}
                      disabled={isDisableTab && isDisabledUpdate}
                    />
                  ))}
                </TabList>
              </Box>
              <TabPanel value='createbid'>
                <Box className={cx('fs22', 'my20')}>Survey Information</Box>
                <Box className={cx('d-flex')}>
                  <Box className={cx('w50p')}>
                    <Box
                      width='50%'
                      display='flex'
                      flexWrap='wrap'
                      flexDirection='column'
                    >
                      <FormControl>
                        <Box className={cx('pb10')}>Project <span className={cx('cl-red')}> *</span></Box>
                      </FormControl>
                      <SelectReact
                        isLoading={isLoadingProject}
                        required
                        isDisabled={!isDisableTab}
                        name='project'
                        value={selectedProject}
                        options={projectName}
                        className='basic-multi-select'
                        classNamePrefix='select'
                        onChange={handleChangeSelectProject}
                        onInputChange={handleSearchTextChangeProject} // Add this line
                      />
                      <FormControl>
                        <Box className={cx('pb10', 'pt20')}>
                          Sample size (N=)<span className={cx('cl-red')}> *</span>
                        </Box>
                        <TextField
                          id='totalNSize'
                          name='totalNSize'
                          type='number'
                          disabled={!isDisableTab}
                          required
                          inputProps={{ min: 0 }}
                          value={totalNSize}
                          onChange={e => {
                            setTotalNSize(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <Box className={cx('pb10', 'pt20')}>
                          # of Countries<span className={cx('cl-red')}> *</span>
                        </Box>
                        <TextField
                          id=''
                          name=''
                          type='number'
                          required
                          inputProps={{ min: 0 }}
                          value={targetCountry.length}
                          disabled
                        />
                      </FormControl>
                      <FormControl>
                        <Box className={cx('pb10', 'pt20')}>
                          Open Ends<span className={cx('cl-red')}> *</span>
                        </Box>
                        <TextField
                          id='noOfOpenEnds'
                          name='noOfOpenEnds'
                          type='number'
                          disabled={!isDisableTab}
                          required
                          inputProps={{ min: 0 }}
                          value={noOfOpenEnds}
                          onChange={e => {
                            setNoOfOpenEnds(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                    </Box>
                    <Box className={cx('d-flex', 'form-size')} display='flex' flexWrap='wrap' marginBottom='25px'>
                      <FormControl>
                        <Box
                          display='flex'
                          alignItems='center'
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                id='pi'
                                checked={pi === 'true'}
                                disabled={!isDisableTab}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setPi('true');
                                  } else {
                                    setPi('false');
                                  }
                                }}
                              />
                            }
                            label='Pill'
                          />
                          <InfoIcon className={cx('pr10')} />
                        </Box>
                      </FormControl>
                      <FormControl>
                        <Box
                          display='flex'
                          alignItems='center'
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                id='qualfollowup'
                                checked={qualfollowup === 'true'}
                                disabled={!isDisableTab}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setQualfollowup('true');
                                  } else {
                                    setQualfollowup('false');
                                  }
                                }}
                              />
                            }
                            label='Qual follow up'
                          />
                          <InfoIcon className={cx('pr10')} />
                        </Box>
                      </FormControl>
                      <FormControl>
                        <Box
                          display='flex'
                          alignItems='center'
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                id='tracker'
                                checked={tracker === 'true'}
                                disabled={!isDisableTab}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setTracker('true');
                                  } else {
                                    setTracker('false');
                                  }
                                }}
                              />
                            }
                            label='Tracking Study'
                          />
                          <InfoIcon className={cx('pr10')} />
                        </Box>
                      </FormControl>
                    </Box>
                    <Box width='90%'>
                      <FormControl fullWidth>
                        <Box
                          className={cx('pb10')}
                          textAlign='center'
                        >
                          Additional Details
                        </Box>
                        <TextField
                          id='additionalDetails'
                          name='additionalDetails'
                          multiline
                          disabled={!isDisableTab}
                          rows={4}
                          value={additionalDetails}
                          onChange={e => {
                            setAdditionalDetails(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Box>
                  <Box className={cx('w50p')}>
                    <Box
                      display='flex'
                      justifyContent='center'
                      flexDirection='column'
                      flexWrap='wrap'
                    >
                      <div className={cx(`${!(isDisableTab && isDisabledUpdate) ? 'disabled-div' : ''}`)}>
                        <p>Upload File</p>
                        {uploadedFileName ? (
                          <div className={cx('uploadedFileName', 'drag-container')}>
                            <span>{uploadedFileName}</span>
                            <div hidden={!isDisableTab}>
                              <CloseIcon
                                onMouseDown={() => {
                                  handleRemoveFile();
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            
                            <div
                              {...getRootProps()}
                              className={cx('drag-container')}
                            >
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Drag a csv file here...</p>
                              ) : (
                                <p>
                                  Drag a csv file here or <span>browser</span> for a file to
                                  upload
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <div className={cx('multipleSelectCheckmarks')}>
                        <p className={cx('pb10')}>
                          Country<span className={cx('cl-red')}> *</span>
                        </p>
                        <SelectReact
                          isMulti
                          isLoading={isErrorCountry}
                          required
                          isDisabled={!(isDisableTab && isDisabledUpdate)}
                          name="country"
                          value={selectedCountryStore}
                          options={countriesNames!}
                          className={cx('basic-multi-select')}
                          classNamePrefix="select"
                          onChange={handleChangeSelect}
                        />
                      </div>
                      {targetCountry.length != 0 ? (
                        <div className={cx('table-component')}>
                          {/* <div className={cx('title')}></div> */}
                          <div className={cx('row-component')}>
                            <div
                              className={cx('row', 'head')}
                            >
                              <p>Country</p>
                              <p># of Targets Needed</p>
                            </div>
                          </div>
                          <div className={cx('row-component')}>
                            {targetCountry.map(country => (
                              <div
                                key={country.name}
                                className={cx('row')}
                              >
                                <div className={cx('label')}>
                                  <label htmlFor=''>{country.name}</label>
                                </div>
                                <div className={cx('input')}>
                                  <input
                                    type='number'
                                    min={1}
                                    width='100%'
                                    disabled={!(isDisableTab && isDisabledUpdate)}
                                    value={country.target}
                                    onChange={event =>
                                      handleTargetChange(event, country.name)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </Box>
                  </Box>
                </Box>
                <button
                  type='submit'
                  disabled={!isDisableTab}
                  className={cx('btn-save', 'flex-center')}
                >
                  Save & Continue {(mutationPost.isLoading || mutationPut.isLoading) && <BouncingDotsLoader/>}
                </button>
              </TabPanel>
              {tab?.map((country) => (
                <TabPanel
                  key={country.id}
                  value={country.id + ''}
                >
                  <Box width='100%'>
                    <Box
                      width='100%'
                      padding='0 24px'
                      display='flex'
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='flex-start' // Added justifyContent property
                      mx='auto'
                      pb='5px'
                    >
                      <Grid
                        marginTop='30px'
                        container
                        spacing={10}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={cx('sm-center')}
                      >
                        <Grid
                          item
                          xs={4}
                          sm={8}
                          md={10}
                          style={{ paddingLeft: '0px', paddingTop: '0px' }}
                        >
                          <CountryComponent countryId={country.id} />
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sm={8}
                          md={2}
                          style={{ paddingLeft: '0px', paddingTop: '0px' }}
                        >
                          {isLastTarget(country.id) ? (
                            <>
                              <div className={cx('sm-flex-center')}>
                                <div className={cx('bg-width', 'sm-btn', 'save-container')}>
                                  <Button
                                    className={cx('save-btn')}
                                    onClick={() => {
                                      handleSave();
                                    }}
                                  >
                                    <span className={cx('text-center', 'flex-center')}>Save {mutationCountry.isLoading && <BouncingDotsLoader/>}</span>
                                  </Button>
                                  <Button
                                    onClick={handleClick}
                                    className={cx('save-btn-dropdown')}
                                  >
                                    <ArrowDropDownIcon className={cx('text-white')} />
                                  </Button>
                                </div>
                                <Button>
                                  <Menu
                                    anchorEl={anchorEl}
                                    open={isExpanded}
                                    onClose={handleClose}
                                  >
                                    <MenuItem onClick={handleClose}>
                                      Save and Send to Vendors
                                    </MenuItem>
                                  </Menu>
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={cx('sm-flex-center')}>
                                <div className={cx('bg-width', 'sm-btn', 'save-container')}>
                                  <Button
                                    className={cx('save-btn')}
                                    disabled={mutationCountry.isLoading}
                                    onClick={() => {
                                      if (isNaN(rfpId!)) {
                                        nextTab(country.id + 1)
                                      } else {
                                        handleSave();
                                        nextTab(country.id + 1)
                                      }
                                    }}
                                  > 
                                    <span className={cx('text-center', 'flex-center')}>{isNaN(rfpId!) ? 'Next' : 'Save & Next'} {mutationCountry.isLoading && <BouncingDotsLoader/>}</span> 
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </TabPanel>
              ))}
            </TabContext>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default CreateBID;
