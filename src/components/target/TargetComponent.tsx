import fetchAPITargetType from '@/api/TargetType';
import fetchAPIVendor from '@/api/Vendor';
import SearchComponent from '@/components/search/SearchComponent';
import { TargetingCriteriaContext } from '@/hooks/context/TargetingCriteriaContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import SelectReact, { ActionMeta, MultiValue } from 'react-select';
import Popover from '@mui/material/Popover';
import Switch from '@mui/material/Switch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper'

import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormGroup from '@mui/material/FormGroup';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { qualifications } from '../search/qualification';
import style from './Target.module.scss';
import Qualification from './Qualification';
import Column from './Column';
import QualificationCard from './QualificationCard';
import { useRouter } from 'next/router';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export interface IQualifications {
  id: number;
  tblRFP_id: number;
  target_id: number;
  fieldName: string;
  fieldValue: string[] | string;
}

interface QualificationLists {
  [key: string]: string[];
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

interface TargetComponentProps {
  targetId: number;
  countryId: number;
}

interface OptionType {
  label: string;
  value: string;
}

const cx = classNames.bind(style);

const TargetComponent: React.FC<TargetComponentProps> = ({ targetId, countryId }) => {
  const router = useRouter();
  const param = router.query.rfpId;
  const [rfpId, setRfpId] = useState<number>();
  const [isDisabled, setIsDisable] = useState<boolean>(false);

  useEffect(() => {
    setRfpId(parseInt(param as string, 10))
  }, [param])

  useEffect(() => {
    if (isNaN(rfpId!)) {
      setIsDisable(false)
    } else {
      setIsDisable(true)
    }
  }, [rfpId])

  const [searchText, setSearchText] = useState<string>('');
  const {
    isLoading: isLoadingVendor,
    data: vendors,
    refetch: refetchVendors
  } = useQuery(['vendors', searchText], () => fetchAPIVendor(searchText));

  useEffect(() => {
    const tempVendor = vendors?.map(item => ({
      label: item.name,
      value: item.id.toString()
    }));
    if (tempVendor) setVendorName(tempVendor);
  }, [vendors])

  const { isLoading: isLoadingTargetType, data: targetTypes } = useQuery(
    ['targetTypes'],
    () => fetchAPITargetType()
  );

  useEffect(() => {
    if (!isLoadingTargetType && targetTypes) {
      const defaultTarget = targetTypes.map(item => ({
        label: item.name,
        value: item.id.toString()
      }))
      setTargetTypeName(defaultTarget);
    }
  }, [isLoadingTargetType, targetTypes]);

  const [qualificationLists, setQualificationLists] = useState<QualificationLists>(qualifications);
  const [selectedQualifications, setSelectedQualifications] = useState<any>([]);
  const [target, setTarget] = useState<ITarget>();
  const { targetingCriteria, setTargetingCriteria } = useContext(
    TargetingCriteriaContext
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTargetName, setNewTargetName] = useState('');

  const [vendorName, setVendorName] = useState<OptionType[]>([]);
  const [selectedVendor, setSelectedVendor] = React.useState<OptionType[]>([]);
  const [targetTypeName, setTargetTypeName] = useState<OptionType[]>([]);
  const [selectedTargetType, setSelectedTargetType] = useState<OptionType>();

  useEffect(() => {
    getTarget();
  }, []);

  const getTarget = () => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            setTarget(target);
            const defaultTargetType = {
              label: target.targetTypeId.label,
              value: target.targetTypeId.value.toString()
            }
            setSelectedTargetType(defaultTargetType);
            const defaultTargetName = target.name ?? ''; // Use target name if available, otherwise use an empty string
            setNewTargetName(defaultTargetName);
            const defaultVendors =
              target?.vendors?.map(item => ({
                label: item.label,
                value: item.value.toString()
              })) ?? [];
            setSelectedVendor(defaultVendors);
          }
        });
    });
  };

  useEffect(() => {
    getTarget();
    if (target && target.qualifications) {
      target.qualifications.forEach((item) => {
        moveCardHandler(item.fieldName);
      });
    }
  }, [target]);

  const removeQualification = (qualification: string) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach((country) => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId) {
        country.targets.forEach((target) => {
          if (target.id === targetId) {
            const indexToRemove = target.qualifications.findIndex((item) => item.fieldName === qualification);
            if (indexToRemove !== -1) {
              target.qualifications.splice(indexToRemove, 1);
            }
          }
        });
      }
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetIR = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!targetingCriteria) {
      return;
    }

    const ir = parseInt(event.target.value);

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.ir = ir;
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetName = (name: string) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.name = name;
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetLoi = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!targetingCriteria) {
      return;
    }

    const loi = parseInt(event.target.value);

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.loi = loi;
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetNSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!targetingCriteria) {
      return;
    }

    const nSize = parseInt(event.target.value);

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.nsize = nSize;
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetTargetTypeId = (id: OptionType) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    const defauldTarget = {
      label: id.label,
      value: parseInt(id.value)
    }

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.targetTypeId = defauldTarget;
            // target.qualifications = qualificationLists[id.value].map(item => ({
            //   fieldName: item,
            //   fieldValue: ''
            // }))
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const handleUpdateTargetVendors = (
    vendors: {
      label: string;
      value: number;
    }[]
  ) => {
    if (!targetingCriteria) {
      return;
    }

    const updatedCriteria = { ...targetingCriteria };

    updatedCriteria.rfpCountries.forEach(country => {
      if (!country.targets) {
        return;
      }
      if (country.id === countryId)
        country.targets.forEach(target => {
          if (target.id === targetId) {
            target.vendors = vendors;
          }
        });
    });

    setTargetingCriteria(updatedCriteria);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const openSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const closeSettings = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTargetTypeChange = (newValue: OptionType | null, actionMeta: ActionMeta<OptionType>) => {
    if (newValue) {
      const selectedValue = {
        label: newValue.label,
        value: newValue.value
      };
      handleUpdateTargetTargetTypeId(selectedValue);
      setSelectedTargetType(selectedValue);
    } else {
      setSelectedTargetType(undefined);
    }
  };


  const handleChangeSelect = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    const selectedValues = newValue.map(item => ({
      label: item.label,
      value: parseInt(item.value)
    }));
    setSelectedVendor(newValue as OptionType[]);
    handleUpdateTargetVendors(selectedValues);
  };

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
    refetchVendors(); // Fetch updated data based on the search text
  };

  //save reference for dragItem and dragOverItem
  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);

  //const handle drag sorting
  const handleSort = () => {
    if (selectedTargetType) {

      // Duplicate the selected target type's qualification list
      const qualificationItems = [...qualificationLists[selectedTargetType.value]];

      // Remove and save the dragged item content
      const draggedItemContent = qualificationItems.splice(dragItem.current!, 1)[0];

      // Switch the position
      qualificationItems.splice(dragOverItem.current!, 0, draggedItemContent);

      // Update the qualificationLists with the modified list for the selected target type
      setQualificationLists(prevQualificationLists => ({
        ...prevQualificationLists,
        [selectedTargetType.value]: qualificationItems
      }));
      // Reset the position refs
      // dragItem.current = null;
      // dragOverItem.current = null;
    }
  };

  const accordionProps = {
    sx: {
      pointerEvents: 'none',
      '& .MuiIconButton-root': {
        pointerEvents: 'auto'
      }
    },
    expandIcon: (
      <ExpandMoreIcon
        sx={{
          pointerEvents: 'auto'
        }}
        className={cx('green')}
      />
    )
  };

  const moveCardHandler = (name: string) => {
    if (!selectedQualifications.includes(name)) {
      setSelectedQualifications((prevState: any) => {
        const copiedStateArray = [...prevState, name];
        return copiedStateArray;
      });
    }
  };

  const moveSelectedCardHandler = useCallback((dragIndex: number, hoverIndex: number) => {
    setSelectedQualifications((prevCards: string[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    )
  }, [])

  const removeCard = useCallback((dragIndex: number) => {
    setSelectedQualifications((prevCards: string[]) => {
      const currentCard = [...prevCards];
      currentCard.splice(dragIndex, 1);
      return currentCard;
    }
    )
  }, [])

  const handleEditClick = () => {
    setIsEditingName(true);
    setNewTargetName(target?.name ? target.name : '');
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTargetName(event.target.value);
  };

  const handleSaveClick = () => {
    setIsEditingName(false);
    handleUpdateTargetName(newTargetName);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsEditingName(false);
    }, 100);
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Grid
          container
          className={cx('align-item-center')}
          style={{ marginLeft: '40px' }}
        >
          {isEditingName ? (
            <>
              <TextField
                type="text"
                value={newTargetName}
                onChange={handleNameChange}
                autoFocus
                onBlur={handleBlur}
              />
              <IconButton onClick={handleSaveClick}>
                <SaveIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography className={cx('align-item-center')}>
                {target?.name}
              </Typography>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            </>
          )}
        </Grid>
        <Grid
          marginTop='30px'
          marginLeft='0'
          container
          spacing={10}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={cx('sm-center')}
        >

          <Grid
            item
            xs={4}
            sm={8}
            md={4}
            className={cx('border', 'mb-50')}
            style={{ padding: '10px', margin: '0px 10px' }}
          >
            <Box className={cx('row', 'space-between', 'mb-20', 'h-40')}>
              <InputLabel htmlFor='expected-ir'>Expected IR (%)</InputLabel>
              <input
                type='number'
                min={0}
                defaultValue={0}
                id='projectid'
                className={cx('w-90', 'numberInput')}
                name='inputIR'
                value={target?.ir}
                onChange={handleUpdateTargetIR}
              />
            </Box>

            <Box className={cx('row', 'space-between', 'mb-20', 'h-40')}>
              <InputLabel htmlFor='expected-ir'>Survey length (min)</InputLabel>
              <input
                min={0}
                type='number'
                defaultValue={0}
                id='projectid'
                className={cx('w-90', 'numberInput')}
                name='survey'
                value={target?.loi}
                onChange={handleUpdateTargetLoi}
              />
            </Box>

            <Box className={cx('row', 'space-between', 'mb-20', 'h-40')}>
              <InputLabel htmlFor='expected-ir'>Sample size</InputLabel>
              <input
                min={0}
                type='number'
                defaultValue={0}
                id='projectid'
                className={cx('w-90', 'numberInput')}
                name='survey'
                value={target?.nsize}
                onChange={handleUpdateTargetNSize}
              />
            </Box>

            <Box className={cx('mb-20')}>
              {/* Select input for Target Type */}
              <InputLabel id='target-type-label'>Target type</InputLabel>
              <SelectReact
                name='targetType'
                value={selectedTargetType}
                options={targetTypeName}
                onChange={handleTargetTypeChange}
              />
            </Box>
            <div className={cx('multipleSelectCheckmarks', 'mb-20')}>
              <InputLabel id='target-type-label'>Vendor selection</InputLabel>
              <SelectReact
                isMulti
                isDisabled={isDisabled}
                isLoading={isLoadingVendor}
                name='vendor'
                value={selectedVendor}
                options={vendorName}
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={handleChangeSelect}
                onInputChange={handleSearchTextChange} // Add this line
              />
            </div>
            <TextField
              variant='outlined'
              fullWidth
              size='small'
              placeholder='Search criteria'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              className={cx('mb-20')}
            />
            {/* <!Qualification list left */}
            <div className={cx('p-10')}>

              <div>
                <List>
                  {selectedTargetType &&
                    qualificationLists[selectedTargetType.value].map((qualification, index) => (
                      <Qualification
                        key={qualification}
                        name={qualification}
                        setItems={moveCardHandler}
                        index={index}
                      />
                    ))}
                </List>
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={4}
            sm={8}
            md={7}
            style={{ padding: '10px', paddingTop: '0px' }}
          >
            <div>
              <div className={cx('border', 'mb-50', 'min-h-50')}>

                <Column>

                  {!selectedQualifications.length ? (<p className={cx('p-10', 'text-gray')} style={{ fontWeight: '100' }}>Please drag & drop the criteria here.</p>) :
                    (selectedQualifications.map((qualification: string, index: number) => (
                      <QualificationCard
                        key={index + 'card'}
                        id={index + 'card'}
                        removeCard={removeCard}
                        moveCard={moveSelectedCardHandler}
                        index={index}
                      >
                        <Accordion defaultExpanded={true}
                        >
                          <AccordionSummary
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            {...accordionProps}
                          >
                            <ListItem className={cx('row', 'space-between', 'underline')}>
                              <div className={cx('row', 'align-item-center')}>
                                <ListItemIcon>
                                  <DragIndicatorIcon />
                                </ListItemIcon>
                                <ListItemText primary={qualification} />
                              </div>
                              <div className={cx('row', 'align-item-center')}>
                                <IconButton onClick={openSettings}>
                                  <SettingsIcon />
                                </IconButton>
                                <IconButton onClick={() => {
                                  removeCard(index);
                                  removeQualification(qualification)
                                }}>
                                  <DeleteForeverIcon />
                                </IconButton>
                              </div>
                            </ListItem>
                          </AccordionSummary>
                          <AccordionDetails className={cx('p-unset')}>
                            <SearchComponent
                              selectedTargetType={parseInt(selectedTargetType?.value as string)}
                              qualification={qualification}
                              countryId={countryId}
                              targetId={targetId}
                              isUpdate={isDisabled}
                            />{' '}

                          </AccordionDetails>
                        </Accordion>
                      </QualificationCard>
                    )))}
                </Column>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  onClose={closeSettings}
                >
                  <FormGroup className='popover'>
                    <FormControlLabel
                      control={<Checkbox />}
                      label='SHOW NON-SELECTED ANSWERS'
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label='DISTRIBUTION'
                    />
                    <p className="small">
                      <span style={{ marginRight: '10px' }}>INCLUDE</span>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={true}
                            name='EXCLUDE'
                          />
                        }
                        label='EXCLUDE'
                      />
                    </p>
                  </FormGroup>
                </Popover>
              </div>
            </div>
          </Grid>

        </Grid>
      </DndProvider>
    </>
  );
};

export default TargetComponent;
