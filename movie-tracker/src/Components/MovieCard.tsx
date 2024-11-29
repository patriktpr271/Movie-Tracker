import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Props interface for the MovieCard component.
 * 
 * @interface MovieCardProps
 * @property {number} id - The unique identifier for the movie.
 * @property {string} title - The title of the movie.
 * @property {string} poster_path - The relative path to the movie poster image.
 * @property {string} overview - A brief overview or description of the movie.
 * @property {() => void} onClick - A function that is triggered when the movie card is clicked.
 */
interface MovieCardProps {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    onClick: () => void;
}

/**
 * MovieCard component for displaying a movie's poster and title.
 * 
 * This component receives a movie's title, poster path, and other details as props
 * and displays them in a clickable card format. The card includes an image of the movie's poster
 * and its title, and it triggers the provided `onClick` function when clicked.
 * 
 * @component
 * @param {MovieCardProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered MovieCard component.
 */
const MovieCard: React.FC<MovieCardProps> = ({ title, poster_path, onClick }) => {
    return (
        // Outer Box component used for styling and layout
        <Box
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                width: 220,
                margin: 2,
                textAlign: 'center',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: 8 },
            }}
        >
            {/* Image container for the movie poster */}
            <Box sx={{ position: 'relative' }}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                    alt={title}
                    style={{
                        width: '100%',
                        borderRadius: 8

                    }}
                />             
            </Box>
            {/* Display the movie title below the poster */}
            <Typography
                variant="h6"
                sx={{
                    mt: 1,
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'var(--movie-font)',
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default MovieCard;
