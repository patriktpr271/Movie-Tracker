import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Movie, LocalMovies, MovieCreation, Theaters, Tv } from '@mui/icons-material'; // Add icons for categories

/**
 * Props for the Sidebar component.
 * 
 * @interface SidebarProps
 * @property {function} onCategoryChange - A callback function to be called when a category is selected.
 */
interface SidebarProps {
    onCategoryChange: (category: string) => void;
}

/**
 * Sidebar component that provides a navigation drawer for selecting movie categories
 * and navigating to the home page.
 *
 * @component
 * @param {SidebarProps} props - The properties of the Sidebar component.
 * @returns {React.ReactElement} The rendered sidebar component.
 */
export default function Sidebar({ onCategoryChange }: SidebarProps) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isMainPage = location.pathname === '/';

    const MOVIE_ARRAY = [
        { name: "Popular", icon: <Movie /> },
        { name: "Action", icon: <LocalMovies /> },
        { name: "Drama", icon: <MovieCreation /> },
        { name: "Fantasy", icon: <Theaters /> },
        { name: "Horror", icon: <Tv /> },
        { name: "Comedy", icon: <Movie /> },
        { name: "Documentary", icon: <LocalMovies /> },
    ];

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleCategoryClick = (category: string) => {
        if (isMainPage) {
            onCategoryChange(category);
            setOpen(false); // Close the drawer after selecting a category
        }
    };

    const handleHomeClick = () => {
        navigate('/'); // Navigate to the home page
        setOpen(false);
    };

    const DrawerList = (
        <Box sx={{
            width: 250, 
            bgcolor: 'background.paper', 
            display: 'flex', 
            flexDirection: 'column', 
            paddingTop: 2, 
            boxShadow: 3
        }} role="presentation">
            <List>
                <ListItem disablePadding key={"Home"}>
                    <ListItemButton onClick={handleHomeClick} sx={{
                        '&:hover': { bgcolor: 'primary.main', color: 'white' },
                        padding: '10px 20px',
                    }}>
                        <Home/>  
                        <ListItemText primary={"Home"} 
                          sx={{
                            marginLeft: 2,
                            fontWeight: '500',
                            color: 'text.primary'
                        }}/>                        
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                {MOVIE_ARRAY.map(({ name, icon }) => (
                    <ListItem key={name} disablePadding>
                        <ListItemButton
                            onClick={() => handleCategoryClick(name)}
                            disabled={!isMainPage}
                            sx={{
                                '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                                padding: '10px 20px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {icon}
                            <ListItemText
                                primary={name}
                                sx={{
                                    marginLeft: 2,
                                    fontWeight: '500',
                                    color: 'text.primary',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)} sx={{
                '&:focus': {
                    outline: 'none'
                },
                color: 'text.primary',
            }}>
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)} sx={{
                '& .MuiDrawer-paper': {
                    bgcolor: 'background.default', 
                    borderRight: 1, 
                    borderColor: 'divider',
                    paddingTop: 2,
                }
            }}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
