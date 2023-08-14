import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { postLoginAPI } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#6096BA',
        },
        secondary: {
            main: '#F00',
        },
    },
});

interface UserInput {
    employee: {
        email: string;
        password: string;
    };
}

const Login = () => {
    const router = useRouter();
    const [showError, setShowError] = useState<Boolean>(false);

    const mutation = useMutation(postLoginAPI, {
        onSuccess: (data) => {
            if (data.success) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.payload))
                router.push('/supply-requests');
            } else {
                setShowError(true);
            }
        },
        onError: data => {
            setShowError(true);
        }
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const user: UserInput = {
            employee: {
                email: email,
                password: password,
            },
        };

        if (email && typeof email === 'string' && password && typeof password === 'string') {
            mutation.mutate(user)
        } else {
            // Handle invalid email or password
            // For example, you can set an error state and display an error message to the user
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container
                component='main'
                maxWidth='xs'
            >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        alt='Logo'
                        width='90'
                        src={require('../../../public/op4g-logo-color.svg')}
                    />
                    <Typography variant="body2" style={{ color: '#999', marginTop: '16px' }}>
                        (User: chris@op4g.com, password: 123456)
                    </Typography>
                    <Box
                        component='form'
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                        />
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                        />
                        {showError && <Typography variant="body2" color="secondary" gutterBottom>
                            We do not recognize the email or password
                        </Typography>}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value='remember'
                                    color='primary'
                                />
                            }
                            label='Remember me'
                        />

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}
                            color="primary"
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
