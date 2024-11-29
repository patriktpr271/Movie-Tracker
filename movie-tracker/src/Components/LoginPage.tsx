// LoginPage.tsx
import { Avatar, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';

interface LoginPageProps {
    onClose: () => void; // Callback to close the login modal
    onLoginSuccess: (username: string, data: any) => void; // Callback triggered on successful login with user data
}

/**
 * LoginPage component allows users to log in by providing their username and password.
 * On successful login, it fetches the user's watchlist and reviews, then triggers a callback with the user data.
 * 
 * @param {object} props - The component's props
 * @param {function} props.onClose - Callback function to close the login modal
 * @param {function} props.onLoginSuccess - Callback function triggered when the login is successful, passing the username and user data
 * 
 * @returns {React.Element} The rendered LoginPage component
 */
const LoginPage: React.FC<LoginPageProps> = ({ onClose, onLoginSuccess }) => {
    // State to store input fields and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Handles form submission by sending login data to the API and fetching the user's watchlist and reviews.
     * If successful, triggers the `onLoginSuccess` callback with user data and closes the login modal.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const loginData = {
            identifier: username, // Maps username input to API's expected field
            password: password,
        };

        try {
            const response = await fetch('https://localhost:7093/api/ApplicationUser/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                // If login fails, throw an error with the server's response message
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Result from login API:', result);

            const userId = result.user.id; // Extract user ID for subsequent API calls

            // Fetch the user's watchlist
            const watchListResponse = await fetch(`https://localhost:7093/api/WatchList/${userId}`);
            const watchList = watchListResponse.ok ? await watchListResponse.json() : [];
            result.user.watchList = watchList;

            // Fetch the user's reviews
            const reviewsResponse = await fetch(`https://localhost:7093/api/ReviewList/user/${userId}`);
            const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];
            result.user.reviews = reviews;

            // Trigger the login success callback with user data
            onLoginSuccess(username, result.user);
            onClose();

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Login failed. Please try again.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        // Centered container for the login form
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={10} sx={{
                padding: 3,
                width: '100%',
                borderRadius: 3,
                boxShadow: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fafafa',
            }}>
                <Avatar sx={{
                    mx: 'auto',
                    bgcolor: 'secondary.main',
                    marginBottom: 2,
                    width: 56,
                    height: 56,
                }}>
                    <LockOutlinedIcon sx={{ fontSize: 30 }} />
                </Avatar>

                {/* Page title */}
                <Typography component="h1" variant="h5" sx={{ textAlign: 'center', fontWeight: 600, color: 'primary.main' }}>
                    Sign In
                </Typography>

                {/* Displays an error message if login fails */}
                {error && <Typography color="error" sx={{ marginTop: 1 }}>{error}</Typography>}

                {/* Login form */}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 2 }}>
                    {/* Username input */}
                    <TextField
                        placeholder="Enter username"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 2 }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    {/* Password input */}
                    <TextField
                        placeholder="Enter password"
                        fullWidth
                        required
                        type="password"
                        sx={{ mb: 3, border: '1px solid #ccc', borderRadius: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    {/* Submit button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 1,
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
