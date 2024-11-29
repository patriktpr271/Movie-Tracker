import { Avatar, Box, Button, Container, Paper, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';

/**
 * Props for the RegisterPage component.
 * @interface RegisterPageProps
 * @property {() => void} onClose - A function to close the register modal after successful registration.
 */
interface RegisterPageProps {
    onClose: () => void;
}

/**
 * The RegisterPage component allows a user to register by providing their details.
 * It includes fields for name, email, username, password, and password confirmation.
 * On successful registration, the onClose function is called to close the modal.
 * 
 * @component
 * @param {RegisterPageProps} props - The props for the RegisterPage component.
 * @returns {JSX.Element} The JSX representation of the RegisterPage.
 */
const RegisterPage: React.FC<RegisterPageProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');

        /**
     * Handles form submission for user registration.
     * It sends the user data to the API for registration and handles validation errors.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {void}
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const registerData = {
            username: username,
            email: email,
            password: password,
        };

        try {
            const response = await fetch('https://localhost:7093/api/ApplicationUser/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                // Map validation errors to user-friendly messages
                const userFriendlyMessages: Record<string, string> = {
                    'Password': 'Password field cannot be empty',
                    'Username': 'Username field cannot be empty',
                    'Email': 'Email field cannot be empty',
                };

                // Create a user-friendly error message
                let errorMessage = 'There was an error with your registration. Please try again.';
                for (const field in errorData.errors) {
                    if (userFriendlyMessages[field]) {
                        errorMessage = userFriendlyMessages[field];
                        break;
                    }
                }

                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Registration Success:', result);

            onClose();

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper elevation={10} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderRadius: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', marginBottom: 2 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ textAlign: 'center', fontWeight: 600, mb: 3 }}>
                    Register
                </Typography>
                {error && (
                    <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                    <TextField
                        placeholder="Enter your full name"
                        fullWidth
                        required
                        sx={{ mb: 2 , border: '1px solid #ccc', borderRadius: 2 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        placeholder="Enter your email"
                        fullWidth
                        required
                        sx={{ mb: 2 , border: '1px solid #ccc', borderRadius: 2 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        placeholder="Enter your username"
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb: 2 , border: '1px solid #ccc', borderRadius: 2  }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        placeholder="Enter your password"
                        fullWidth
                        required
                        type="password"
                        sx={{ mb: 2 , border: '1px solid #ccc', borderRadius: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        placeholder="Confirm your password"
                        fullWidth
                        required
                        type="password"
                        sx={{ mb: 3 , border: '1px solid #ccc', borderRadius: 2 }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mb: 2,
                            padding: '12px',
                            textTransform: 'none',
                            fontSize: '16px',
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        Register
                    </Button>                   
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
