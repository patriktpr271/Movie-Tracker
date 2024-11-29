import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import React from "react";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import Sidebar from './Sidebar';
import IconButton from './IconButton';

// Define the props for the Header component
interface HeaderProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onCategoryChange: (category: string) => void;
}

/**
 * Header component that displays the navigation bar with user authentication buttons,
 * a sidebar for category selection, and an app title.
 * 
 * This component conditionally renders login/register buttons when the user is not logged in,
 * and a profile button when the user is logged in.
 * It also allows for category changes through the Sidebar component.
 * 
 * @param {Object} props - The props for the Header component.
 * @param {Function} props.onLoginClick - Callback function to handle login button click.
 * @param {Function} props.onRegisterClick - Callback function to handle register button click.
 * @param {Function} props.onCategoryChange - Callback function to handle category change from Sidebar.
 * 
 * @returns {JSX.Element} The rendered Header component.
 */
const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick, onCategoryChange }) => {
    const { user } = useUser(); // Get the current user from the UserContext
    const navigate = useNavigate(); // Hook for navigation

    const handleProfileClick = () => {
        if (user) {
            navigate('/profile', { state: { user } });  // Navigate to the profile page
        }
    };

    return (
        <React.Fragment>
            {/* AppBar component from MUI to create the header bar */}
            <AppBar>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                     {/* Sidebar component for category selection */}
                    <Sidebar onCategoryChange={onCategoryChange} />
                    {/* App Title */}
                    <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Movie Tracker
                    </Typography>
                    {/* User Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {user ? (
                            // Profile button if user is logged in
                            <IconButton
                                icon={AccountCircle}
                                label="Profile"
                                onClick={handleProfileClick}
                            />
                        ) : (
                            <>
                             {/* Register button if user is not logged in */}
                                <IconButton
                                    icon={HowToRegIcon}
                                    label="Register"
                                    onClick={onRegisterClick}                                
                                />
                                 {/* Login button if user is not logged in */}
                                <IconButton
                                    icon={LoginIcon}
                                    label="Login"
                                    onClick={onLoginClick}
                                />
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default Header;
