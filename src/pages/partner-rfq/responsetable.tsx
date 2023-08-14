import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { VariantType, useSnackbar } from 'notistack';
import style from './Response.module.scss';
import classNames from 'classnames/bind';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { InputValues } from '@/models/partner-portal.model';
import { putTotalResult } from '@/api/Rfp';


const cx = classNames.bind(style);

const ResponseTable = ({ fieldName, rfpTarget, rfpid }: any) => {
  const cc = JSON.parse(rfpTarget.cpiDetail).reduce((a: any, v: any, idx: any) => ({ ...a, ['cpi'+(idx+1)]: v}), {});
  const dd = JSON.parse(rfpTarget.feasibleCountDetail).reduce((b: any, d: any, idx2: any) => ({ ...b, ['totalFeasibleCount'+(idx2+1)]: d}), {});
  const ee = fieldName.reduce((a: any, v: any, idx: any) => ({ ...a, ['cpi'+(idx+1)]: 0, ['totalFeasibleCount'+(idx+1)]: 0 }), {});;
  let idCounter = 1;
  
  const [inputValues, setInputValues] = useState<InputValues>({...ee,...cc,...dd});
  const [totalFeasibleCount, setTotalFeasibleCount] = useState(0);
  const [cpi, setCPI] = useState(0);
  const [cpiDetail, setCpiDetail] = useState<number[]>([]);
  const [feasibleDetail, setFeasibleDetail] = useState<number[]>([]);
  const [targetIdForTotal, setTargetIdForTotal] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const handleClickSuccess = (variant: VariantType) => {
    enqueueSnackbar('Submited successfully!', {
      variant,
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };
  

  const mutationPut = useMutation(putTotalResult, {
    onSuccess: data => {
      if (data.success) {
        handleClickSuccess('success');
      } else {
        handleClickSuccess('error');
      }
    }
  })
 
  
  const data = fieldName.map((item: any) => ({
    id: idCounter++,
    ...item,
    targetId: rfpTarget.id,
  }));
  let feasibleList: number[] = [];
  let cpiList: number[] = [];
  const calculateTotalFeasibleCount = (rowId: number) => {
    let totalFeasible = 0;
    feasibleList = [];
    cpiList = [];
    Object.entries(inputValues).forEach(([key, value]) => {
        if (key.startsWith(`totalFeasibleCount${rowId}`)) {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            totalFeasible += parsedValue;
          }
        }
        if (key.startsWith(`totalFeasibleCount`)) {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            feasibleList.push(parsedValue);
          }
        }
        if (key.startsWith(`cpi`)) {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            cpiList.push(parsedValue);
          }
        }
      });
    return totalFeasible;
  };


  useEffect(() => {
    let total = 0;
    let totalCPI = 0.0;

    const calculateCPI = (rowId: number) => {
      let totalCPIv = 0.0;
      Object.entries(inputValues).forEach(([key, value]) => {
        if (key.startsWith(`cpi${rowId}`)) {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            totalCPIv += parsedValue;
          }
        }
      });
      return totalCPIv;
    };

   
    let targetId = '';
    data.forEach((row: any) => {
      const rowTotal = calculateTotalFeasibleCount(row.id);
      const rowTotalCPI = calculateCPI(row.id);
      total += rowTotal;
      totalCPI += rowTotalCPI;
      targetId = row.targetId;
    });
    setTotalFeasibleCount(total);
    setCPI(totalCPI);
    setTargetIdForTotal(targetId);
    setCpiDetail(cpiList)
    setFeasibleDetail(feasibleList)
  }, [inputValues, data]);

  if (!fieldName || fieldName.length === 0 || fieldName.every((item: any) => Object.keys(item).length === 0)) {
    return null;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, rowId: number) => {
    const { name, value } = event.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const field_n = fieldName.length && fieldName[0];
  const columnMapped = Object.entries(field_n).map(([key, value]) => ({
    field: key,
    renderHeader: () => <strong>{key}</strong>,
    width: 300,
    headerClassName: cx('bg-gray'),
    renderCell: (param: any) => <span>{param?.value}</span>,
  }));

  columnMapped.push({
    field: 'totalFeasibleCount',
    renderHeader: () => <strong>Total Feasible Count</strong>,
    headerClassName: cx('bg-gray'),
    renderCell: (param) => (
      <input
        style={{
          width: 80,
          height: 25,
          textAlign: 'center',
          margin: 8,
          padding: 6,
        }}
        type='number'
        min='0'
        placeholder='0'
        className={cx('numberInput')}
        name={`totalFeasibleCount${param.row.id}`}
        value={inputValues[`totalFeasibleCount${param.row.id}`] || ''}
        onChange={(event) => handleInputChange(event, param.row.id)}
        onBlur={handleBlur}
      />
    ),
    width: 200,
  });

  columnMapped.push({
    field: 'CPI',
    renderHeader: () => <strong>CPI</strong>,
    headerClassName: cx('bg-gray'),
    renderCell: (param) => (
      <input
        style={{
          width: 80,
          height: 25,
          textAlign: 'center',
          margin: 8,
          padding: 6,
        }}
        type='number'
        min='0'
        placeholder='0'
        className={cx('numberInput')}
        name={`cpi${param.row.id}`}
        value={inputValues[`cpi${param.row.id}`] || ''}
        onChange={(event) => handleInputChange(event, param.row.id)}
        onBlur={handleBlur}
      />
    ),
    width: 200,
  });

  const handleBlur = () => {
    const data = {
      rfpid,
      payload: {
        targetId: targetIdForTotal,
        cpi: cpi,
        feasibleCount: totalFeasibleCount,
        cpiDetail,
        feasibleCountDetail: feasibleDetail,
      }
    }
    mutationPut.mutate(data);
    // console.dir(data);
  }

  const datagridSx = {
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#E7ECEF",
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography fontWeight='bold'>
        Target: {rfpTarget.name}
      </Typography>
      <DataGrid
        sx={datagridSx}
        rows={data}
        columns={columnMapped}
        hideFooterPagination
        hideFooterSelectedRowCount
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-40px', marginBottom: '40px', paddingRight: '20px' }}>
        <Typography fontWeight='bold' style={{ marginRight: '30px' }}>
          Total Feasible Count: {totalFeasibleCount}
        </Typography>
        <Typography fontWeight='bold'>
          Total CPI: {cpi.toFixed(2)}
        </Typography>
      </div>
    </div>
  );
};

export default ResponseTable;