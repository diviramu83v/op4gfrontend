import { Box, Link, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { VariantType, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import NoRecord from '@/components/no-record/Norecord';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { LandingPageExternalItem } from '@/models/partner-portal.model';
import { fetchAPILandingExternal, putSubmitBid } from '../../api/Rfp';
import Loading from '../../components/loading/Loading';
import style from './LandingE.module.scss';


const cx = classNames.bind(style);



const LandingE = () => {
  const router = useRouter();
  const param = router.query.vendor;
  const [vendorID, setVendorID] = useState<number>();
  const [disableList, setDisableList] = useState<number[]>([])
  

  useEffect(() => {
    setVendorID(parseInt(param as string, 10))
  }, [param])

  const [userID, setUserID] = useState<number>()

  useEffect(() => {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      setUserID(parseInt(userData.id));
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickSuccess = (variant: VariantType) => {
    enqueueSnackbar('Submited successfully!', {
      variant,
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };

  const mutation = useMutation(putSubmitBid, {
    onSuccess: data => {
      if (data.success) {
        handleClickSuccess('success')
      } else {
        handleClickSuccess('error')
      }
    }
  });

  const columns: GridColDef[] = [
    {
      field: 'rfpId',
      headerName: 'RfpId',
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/new-supply-request?rfpId=${params.value?.toString()}`}
          underline='none'
        >
          {params.value?.toString()}
        </Link>
      ),
      width: 90,
      headerClassName: style.bold,
    },
    {
      field: 'projectName',
      headerName: 'Project Name',
      headerClassName: style.bold,
      width: 400
    },
    {
      field: 'totalNSize',
      headerName: 'Total N',
      headerAlign: 'center',
      headerClassName: style.bold,
      type: 'number',
      align: 'center',
      width: 150
    },
    {
      field: 'bidDueDate',
      headerName: 'Bid Due Date',
      headerClassName: style.bold,
      headerAlign: 'center',
      align: 'center',
      width: 150
    },
    {
      field: 'rfpIdSubmit',
      headerName: '',
      headerClassName: style.bold,
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className='d-flex jt-center'>
          <button
            className={cx('btn')}
            disabled={disableList.includes(params.value)}
            onClick={() => {
              mutation.mutate(parseInt(params.value?.toString()));
            }}
          >
            <Box className={cx('color-white')}>Submit Bid</Box>
          </button>
        </div>
      )
    }
  ];

  const [tempData, setTempData] = useState<LandingPageExternalItem[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const {
    isLoading: isLoadingExternal,
    isError: isErrorLandingExternal,
    data: landing_externals
  } = useQuery(['landing-externals', pageNumber, vendorID], () =>
    fetchAPILandingExternal(vendorID!, pageNumber)
  );

  useEffect(() => {
    if (!isLoadingExternal && landing_externals) {
      if (landing_externals.success) {
        const data = landing_externals.payload.items.rfpList.map((item, index) => ({
          id: index + 1,
          rfpIdSubmit: item.rfpId,
          ...item,
          bidDueDate: formatDate(item.bidDueDate),
          isOpen: true
        }));
        setTempData(data);
        setMaxPage(
          landing_externals.payload.total <= 10
            ? 1
            : Math.ceil(landing_externals.payload.total / 10)
        );
      }
    }
  }, [isLoadingExternal, landing_externals]);

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  const CustomPagination = () => {

    const handlePrevClick = () => {
      setPageNumber(old => Math.max(old - 1, 0))
    };

    const handleNextClick = () => {
      setPageNumber(old => Math.max(old + 1, 0))
    };

    const startRecord = (pageNumber - 1) * 10 + 1;
    const endRecord = Math.min(pageNumber * 10, landing_externals?.payload.total || 0);

    return (
      <Box display='flex' alignItems='center' justifyContent='center'>
        <div className={cx('paging-number')}>
          {startRecord} - {endRecord} of {landing_externals?.payload.total}
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
      <Box className={cx('container', 'm-24')}>
        <Box className={cx('max-width-1200', 'mr-bottom-30')}>
          <Box className={cx('fs-23', 'color-808080', 'mr-top-20')}>
            Welcome {landing_externals?.payload.items?.name}
            <br />
            <Box className={cx('fs-23', 'color-808080', 'mr-top-20')}>
              A list of your Bid requests are below!
            </Box>
          </Box>
        </Box>

        <Box className={cx('container', 'mr-top-40', 'ox-auto')}>
          {isErrorLandingExternal ? (
            <Typography variant='body1'>Server side error</Typography>
          ) : (
            <>
              {!isLoadingExternal ? (
                <Box width='100%' maxWidth='945px' mx='auto'>
                  {tempData.length > 0 ? (
                    <DataGrid
                      rows={tempData}
                      columns={columns}
                      onCellClick={(params: GridCellParams) => {
                        setDisableList((prevValue) => { 
                          if(params.colDef.field != 'rfpIdSubmit') return prevValue;
                          return prevValue.includes(params.row.rfpId) ? prevValue :  [...prevValue, params.row.rfpId]
                        });
                        return true
                      }}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 10 }
                        }
                      }}
                      pageSizeOptions={[10]}
                      rowCount={landing_externals.payload.total}
                      components={{
                        Pagination: CustomPagination,
                      }}
                    />
                  ) : (
                    <NoRecord />
                  )}
                </Box>
              ) : (
                <Box>
                  <Loading />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LandingE;
