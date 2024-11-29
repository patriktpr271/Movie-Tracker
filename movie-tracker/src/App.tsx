import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import Header from './Components/Header';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import Movie from './Components/Movie';
import { useUser } from './Contexts/UserContext';
import ProfilePage from './Components/ProfilePage';
import Footer from './Components/Footer';

const App = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const handleLoginOpen = () => setLoginOpen(true);
    const handleLoginClose = () => setLoginOpen(false);
    const handleRegisterOpen = () => setRegisterOpen(true);
    const handleRegisterClose = () => setRegisterOpen(false);

    const [selectedCategory, setSelectedCategory] = useState("Popular"); // Kategória állapot

    const { setUser } = useUser();

    const handleLoginSuccess = (username: string, data: any) => {
        setUser(data); // Ensure `data` has the correct structure
        console.log('Setting user in context:', data); // Add this line
        handleLoginClose();
    };

    return (
        <>
            <Header
                onLoginClick={handleLoginOpen}
                onRegisterClick={handleRegisterOpen}
                onCategoryChange={setSelectedCategory} 
                
            />
            <Box
                sx={{
                    marginTop: '64px',
                    padding: 2,
                    minHeight: '100vh',
                }}
            >
                {/* Add a container with padding */}
                <Box
                    sx={{
                        maxWidth: '1500px', 
                        margin: '0 auto', 
                        padding: '0 16px',
                    }}
                >
                    <Routes>
                    <Route  path="/" 
                            element={<Movie selectedCategory={selectedCategory} />} 
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </Box>
            </Box>
            <Footer />
            <Modal open={loginOpen} onClose={handleLoginClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <LoginPage onClose={handleLoginClose} onLoginSuccess={handleLoginSuccess} />
                </Box>
            </Modal>
            <Modal open={registerOpen} onClose={handleRegisterClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <RegisterPage onClose={handleRegisterClose} />
                </Box>
            </Modal>
        </>
    );
};

export default App;
