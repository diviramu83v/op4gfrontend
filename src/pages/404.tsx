import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 100px)',
      }}
    >
      <Typography variant="h1" fontWeight='bold' style={{lineHeight: '5rem', color: "#8B8C89"}}>
        404
      </Typography>
      <Typography variant="h6" fontWeight="100" color="grey" style={{fontSize: '1rem'}}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" style={{
        backgroundColor: "#6096BA",
        marginTop: "18px"
      }}  href="/supply-requests">Back Home</Button>
    </Box>
    </>
  );
}