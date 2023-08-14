import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import style from './Response.module.scss';
import { useQuery } from '@tanstack/react-query';
import { fetchAPIResult } from '@/api/Rfp';
import { useRouter } from 'next/router';
import Loading from '@/components/loading/Loading';
import ResponseTable from './responsetable';

const cx = classNames.bind(style);

const Response = () => {
  const router = useRouter();
  const param = router.query.rfpid;
  const [rfpid, setrfpid] = useState<number>();

  useEffect(() => {
    setrfpid(parseInt(param as string, 10))
  }, [param])
  const {
    isLoading,
    data: results,
    refetch
  } = useQuery(['results', rfpid], () => fetchAPIResult(rfpid!), {
    onSuccess: data => { console.log(data) }
  });

  function formatDateToYearsMonthsDays(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
  }

  const bidHashtag = results?.payload.wo;
  const projectName = results?.payload.projectName;
  const dateBid = results?.payload.bidDueDate;
  const bidDueDe = formatDateToYearsMonthsDays(dateBid!)
  const rfpCountries = results?.payload.rfpCountries;
  
  return (
    <> {isLoading ? <Box width='100%' style={{paddingTop: '40px'}}><Loading /></Box> : (
      <Box width='100%'>
        <Box
          width='90%'
          maxWidth='1200px'
          display='column'
          alignItems='flex-start'
          mx='auto'
        >
          <Box
            fontSize='20px'
            padding='30px 10px 30px 10px'
            color='gray'
          >
            Please provide your feasibility and CPI in the requested fields below
          </Box>
          <Box
            display='flex'
            fontSize='18px'
            padding='10px 10px 10px 10px'
          >
            <Box
              paddingRight='20px'
              fontWeight='bold'
            >
              Bid #{' '}
            </Box>
            <Link
              href='#'
              underline='none'
            >
              {bidHashtag}
            </Link>
          </Box>
          <Box
            display='flex'
            fontSize='18px'
            padding='10px 10px 10px 10px'
          >
            <Box
              paddingRight='20px'
              fontWeight='bold'
            >
              Project Name{' '}
            </Box>
            <Box>{projectName}</Box>
          </Box>
          <Box
            display='flex'
            fontSize='18px'
            padding='10px 10px 30px 10px'
          >
            <Box
              paddingRight='20px'
              fontWeight='bold'
            >
              Bid Due Date
            </Box>
            <Box>{bidDueDe}</Box>
          </Box>
        </Box>
        <Box
          maxWidth='1200px'
          width='90%'
          display='column'
          alignItems='center'
          mx='auto'
          sx={{
            '& .bg-gray': {
              background: 'gray'
            }
          }}
        >
          {rfpCountries &&
            rfpCountries.map((country, index) => (
              <Accordion key={index} defaultExpanded={true}>
                <AccordionSummary
                  expandIcon={<RemoveCircleOutlineIcon style={{ color: 'white' }} />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                  className={cx('bg-blue')}
                >
                  <Typography fontWeight='bold' color='white'>
                    {country.countryName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails aria-expanded='true'>
                  {country.targets.map(item => (
                    <>
                      <ResponseTable  rfpid={rfpid} fieldName={item.fields} rfpTarget={item} />
                    </>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Box>)}
    </>
  );
};

export default Response;
