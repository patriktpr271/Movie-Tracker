import React from 'react';
import { Box, Typography } from '@mui/material';


/**
 * Footer component that displays a copyright notice.
 * 
 * This component is styled using Material UI's Box and Typography components. 
 * It uses the `sticky` positioning to stay at the bottom of the viewport.
 * 
 * @returns {JSX.Element} The rendered Footer component.
 * 
 * @example
 * // Usage of Footer component in a layout:
 * <Footer />
 */

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                textAlign: 'center',
                padding: '16px',
                position: 'sticky',
                bottom: 0,
                width: '100vw'
            }}
        >
            <Typography variant="body2">
                © 2024 Movie Tracker. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
