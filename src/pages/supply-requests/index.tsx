import fetchAPIVendor from '@/api/Vendor';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SelectReact, { ActionMeta } from 'react-select';

import { LandingInternalData, OptionType } from '@/models/supply-request.model';
import NoRecord from '@/components/no-record/Norecord';
import { fetchAPILandingInternal } from '../../api/Rfp';
import Loading from '../../components/loading/Loading';
import style from './LandingI.module.scss';


const cx = classNames.bind(style);

const LandingI = () => {
  const [tempData, setTempData] = useState<LandingInternalData[]>([]);
  const [selectVendorID, setSelectVendorID] = useState<number>(0);

  const router = useRouter();

  const handleLinkClick = () => {
    if (selectVendorID !== 0) {
      router.push(`/partner-portal?vendor=${selectVendorID}`);
    } else {
      alert('Please select vendor');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'wo',
      headerName: 'Bid #',
      headerClassName: style.bold,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/new-supply-request?rfpId=${params.value?.toString()}`}
          className={cx('link')}
        >
          {params.value?.toString()}
        </Link>
      ),
      width: 90
    },
    {
      field: 'clientName',
      headerClassName: style.bold,
      headerName: 'Account Name',
      width: 150
    },
    {
      field: 'projectName',
      headerClassName: style.bold,
      headerName: 'Project Name',
      width: 200
    },
    {
      field: 'projectManager',
      headerClassName: style.bold,
      headerName: 'Account Manager',
      width: 150
    },
    {
      field: 'vendorsInvited',
      headerName: 'Vendors Invited',
      headerClassName: style.bold,
      type: 'number',
      align: 'center',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <div
          className={cx('link', 'block')}
          onClick={() => {
            handleLinkClick();
          }}
        >
          {params.value?.toString()}
        </div>
      )
    },
    {
      field: 'vendorsResponded',
      headerName: 'Vendors Responded',
      headerClassName: style.bold,
      type: 'number',
      align: 'center',
      width: 150
    },
    {
      field: 'assignedTo',
      headerClassName: style.bold, headerName: 'Assigned To', width: 120
    },
    {
      field: 'bidDueDate',
      headerClassName: style.bold, headerName: 'Bid Due Date', width: 130
    },
    {
      field: 'distributionId',
      headerName: 'Distribution',
      headerClassName: style.bold,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/partner-rfq?rfpid=${params.value?.toString()}`}
          className={cx('link')}
        >
          {params.value?.toString()}
        </Link>
      ),
      align: 'center',
      width: 90
    }
  ];

  const [pageNumber, setPageNumber] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const fetchLandingInternal = async () => {
    setPageNumber(1);
    await refetchLandingInternal();
  };

  useEffect(() => {
    fetchLandingInternal();
  }, [selectVendorID]);

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
  }, [vendors]);

  const [vendorName, setVendorName] = useState<OptionType[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<OptionType>();
  const handleChangeSelect = (
    newValue: OptionType | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (newValue) {
      const selectedValue = {
        label: newValue.label,
        value: newValue.value
      };
      setSelectVendorID(parseInt(newValue.value));
      setSelectedVendor(selectedValue);
    } else {
      setSelectedVendor(undefined);
    }
  };

  const handleSearchTextChange = (searchText: string) => {
    setSearchText(searchText);
    refetchVendors(); // Fetch updated data based on the search text
  };

  const {
    isLoading: isLoadingInternal,
    isError: isErrorLandingInternal,
    data: landing_internals,
    refetch: refetchLandingInternal
  } = useQuery(
    ['landing-internals', pageNumber, selectVendorID],
    () => fetchAPILandingInternal(pageNumber, selectVendorID),
    {
      onSuccess: data => {
        if (data.success) {
          const newData = data.payload.items.map((item, index) => ({
            id: index + 1,
            ...item,
            distributionId: item.wo,
            bidDueDate: formatDate(item.bidDueDate)
          }));
          setTempData(newData);
          setMaxPage(data.payload.total <= 10 ? 1 : Math.ceil(data.payload.total / 10));
        }
      }
    }
  );

  useEffect(() => {
    console.log({landing_internals})
    if (landing_internals) {
      const newData = landing_internals.payload.items.map((item, index) => ({
        id: index + 1,
        ...item,
        distributionId: item.wo,
        bidDueDate: formatDate(item.bidDueDate)
      }));
      setTempData(newData);
      setMaxPage(
        landing_internals.payload.total <= 10
          ? 1
          : Math.ceil(landing_internals.payload.total / 10)
      );
    }
  }, [landing_internals]);

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  const CustomPagination = () => {
    const handlePrevClick = () => {
      setPageNumber(old => Math.max(old - 1, 0));
    };

    const handleNextClick = () => {
      setPageNumber(old => Math.max(old + 1, 0));
    };

    const startRecord = (pageNumber - 1) * 10 + 1;
    const endRecord = Math.min(pageNumber * 10, landing_internals?.payload.total || 0);

    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <div className={cx('paging-number')}>
          {startRecord} - {endRecord} of {landing_internals?.payload.total}
        </div>
        <button
          className={cx('btn-page')}
          onClick={handlePrevClick}
          disabled={pageNumber === 1}
        >
          <KeyboardArrowLeft />
        </button>
        <button
          className={cx('btn-page')}
          onClick={handleNextClick}
          disabled={pageNumber === maxPage}
        >
          <KeyboardArrowRight />
        </button>
      </Box>
    );
  };

  return (
    <>
      <Box width='100%' display='flex' flexDirection='column' alignItems='center'>
        <Box
          width='90%'
          display='flex'
          alignItems='center'
          margin='0 24px'
        >
          <Box
            fontSize='22px'
            display='flex'
          >
            <p className={cx('cl-title')}>Open Bids</p>
          </Box>
          <Box
            ml='auto'
            my='20px'
            display='flex'
            alignItems='center'
          >
            <Typography className={cx('vendorName')}>Vendor</Typography>
            <Box
              marginLeft={1}
              width={300}
              marginRight={1}
            >
              <SelectReact
                isLoading={isLoadingVendor}
                name='vendor'
                value={selectedVendor}
                options={vendorName}
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={handleChangeSelect}
                onInputChange={handleSearchTextChange}
              />
            </Box>
            <Link
              href='/new-supply-request'
              className={cx('link')}
            >
              <button className={cx('btn')}>
                <Box
                  display='flex'
                  alignItems='center'
                  m='0px'
                >
                  <AddIcon className={cx('fs-body')} />
                  New RFP
                </Box>
              </button>
            </Link>
          </Box>
        </Box>
        {isErrorLandingInternal ? (
          <Typography variant='body1'>Server side error</Typography>
        ) : (
          <>
            {!isLoadingInternal ? (
              <Box
                mx='auto'
                display='flex'
                flexWrap='wrap'
                justifyContent='center'
                margin='0 24px'
                width='100%'
                className={cx('ox-auto')}
              >
                {landing_internals?.payload.items.length ?? 0 > 0 ? (
                  <>
                    <Box width='100%' maxWidth='1215px' mx='auto'>
                      <DataGrid
                        rows={tempData}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 }
                          }
                        }}
                        pageSizeOptions={[10]}
                        rowCount={landing_internals.payload.total}
                        components={{
                          Pagination: CustomPagination
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <NoRecord />
                )}
              </Box>
            ) : (
              <Box mx='auto'>
                <Loading />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default LandingI;
