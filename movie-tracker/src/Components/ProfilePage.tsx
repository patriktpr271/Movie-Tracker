import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    TextField,
    Rating,
    SelectChangeEvent,
} from '@mui/material';
import { useUser } from '../Contexts/UserContext';

/**
 * Represents the structure of a WatchListItem object.
 * @typedef {Object} WatchListItem
 * @property {number} movieId - The ID of the movie in the watchlist.
 * @property {boolean} isWatched - Indicates whether the movie has been watched.
 */
interface WatchListItem {
    movieId: number;
    isWatched: boolean;
}

/**
 * Represents the structure of a ReviewListItem object.
 * @typedef {Object} ReviewListItem
 * @property {number} movieId - The ID of the movie being reviewed.
 * @property {string} content - The content of the user's review.
 * @property {number} rating - The rating given by the user.
 */
interface ReviewListItem {
    movieId: number;
    content: string;
    rating: number;
}

/**
 * Represents the details of a movie.
 * @typedef {Object} MovieDetails
 * @property {string} title - The title of the movie.
 * @property {string} overview - A brief overview of the movie.
 * @property {string} poster_path - The path to the movie's poster image.
 */
interface MovieDetails {
    title: string;
    overview: string;
    poster_path: string;
}

/**
 * ProfilePage is the page that displays the user's profile, including their watchlist
 * and review list. It allows users to update their watchlist status and edit/delete reviews.
 * It fetches the user's watchlist, review list, and movie details from the backend and
 * external movie API.
 * 
 * @returns {JSX.Element} The profile page JSX element.
 */
const ProfilePage: React.FC = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [watchList, setWatchList] = useState<WatchListItem[] | null>(null);
    const [reviewList, setReviewList] = useState<ReviewListItem[] | null>(null);
    const [movieDetails, setMovieDetails] = useState<Record<number, MovieDetails>>({});
    const [loading, setLoading] = useState(true);
    const [selectedWatchMovie, setSelectedWatchMovie] = useState<number | null>(null);
    const [selectedReviewMovie, setSelectedReviewMovie] = useState<number | null>(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

     /**
     * Fetches the user's watchlist and review list from the backend API.
     * This function runs when the component mounts or when the user changes.
     */
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [watchListResponse, reviewListResponse] = await Promise.all([
                    fetch(`https://localhost:7093/api/WatchList/${user.id}`),
                    fetch(`https://localhost:7093/api/ReviewList/user/${user.id}`),
                ]);

                if (watchListResponse.ok) {
                    const watchListData = await watchListResponse.json();
                    setWatchList(watchListData);
                }

                if (reviewListResponse.ok) {
                    const reviewListData = await reviewListResponse.json();
                    setReviewList(reviewListData);
                }
            } catch (error) {
                console.error('Error fetching lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

        /**
     * Fetches movie details (e.g., title, overview, poster) from an external API.
     * This function runs when the watchlist or review list changes, and it updates
     * the movie details state.
     * 
     * @param {number} movieId - The ID of the movie whose details are being fetched.
     */
    useEffect(() => {
        const fetchMovieDetails = async (movieId: number) => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=6816c4a43c7689de5349fd72378347e3`
                );
                if (response.ok) {
                    const data = await response.json();
                    setMovieDetails((prev) => ({
                        ...prev,
                        [movieId]: data,
                    }));
                }
            } catch (error) {
                console.error(`Failed to fetch details for movie ID ${movieId}:`, error);
            }
        };

        const movieIds = new Set<number>();
        watchList?.forEach((item) => movieIds.add(item.movieId));
        reviewList?.forEach((item) => movieIds.add(item.movieId));

        movieIds.forEach((id) => {
            if (!movieDetails[id]) {
                fetchMovieDetails(id);
            }
        });
    }, [watchList, reviewList, movieDetails]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

      /**
     * Handles the selection of a movie from the watchlist dropdown.
     * 
     * @param {SelectChangeEvent<string>} event - The change event triggered by selecting a movie.
     */
    const handleWatchMovieSelect = (event: SelectChangeEvent<string>) => {
        const selectedMovieId = event.target.value === "" ? null : Number(event.target.value);
        setSelectedWatchMovie(selectedMovieId);
    };

     /**
     * Handles the selection of a movie from the review list dropdown.
     * 
     * @param {SelectChangeEvent<string>} event - The change event triggered by selecting a movie.
     */
    const handleReviewMovieSelect = (event: SelectChangeEvent<string>) => {
        const selectedMovieId = event.target.value === "" ? null : Number(event.target.value);
        setSelectedReviewMovie(selectedMovieId);
    };

     /**
     * Marks a movie as watched in the user's watchlist.
     * 
     * @param {number} movieId - The ID of the movie to be marked as watched.
     */
    const handleMarkAsWatched = async (movieId: number) => {
        if (!user) return;

        try {
            const response = await fetch(`https://localhost:7093/api/WatchList/${movieId}?userId=${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Marked as watched');
                setWatchList((prevWatchList) =>
                    prevWatchList?.map((item) =>
                        item.movieId === movieId ? { ...item, isWatched: true } : item
                    ) || null
                );
            } else {
                console.error('Failed to mark movie as watched:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking movie as watched:', error);
        }
    };

     /**
     * Edits an existing review for a selected movie.
     * 
     * @param {number} movieId - The ID of the movie for which the review is being edited.
     */
    const handleEditReview = async (movieId: number) => {
        if (!review.trim()) {
            alert("Review cannot be empty.");
            return;
        }

        if (rating === null) {
            alert("Please provide a rating.");
            return;
        }

        try {
            const response = await fetch(`https://localhost:7093/api/ReviewList/EditReview`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.id,
                    movieId: movieId,
                    reviewText: review,
                    rating: rating
                }),
            });

            if (response.ok) {
                alert("Review updated successfully!");
                setReview("");
                setRating(0);
            } else {
                const errorMessage = await response.text();
                alert(`Failed to update review: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error updating review:", error);
            alert("An error occurred while updating the review.");
        }
    };



      /**
     * Deletes a review for a selected movie.
     * 
     * @param {number} movieId - The ID of the movie for which the review is being deleted.
     */
    const handleDeleteReview = async (movieId: number) => {
        if (!user) return;

        try {
            const response = await fetch(`https://localhost:7093/api/ReviewList/DeleteReview`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    movieId,
                }),
            });

            if (response.ok) {
                alert('Review deleted successfully');
                setReviewList((prevReviewList) =>
                    prevReviewList?.filter((item) => item.movieId !== movieId) || null
                );
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    if (!user) {
        return <Typography variant="h6">No user is logged in</Typography>;
    }

    if (loading) {
        return <CircularProgress />;
    }

    const handleRatingChange = (newValue: number | null) => {
        setRating(newValue ?? 0);
        if (!review) {
            const existingReview = reviewList?.find((item) => item.movieId === selectedReviewMovie);
            setReview(existingReview?.content || '');
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.name}
            </Typography>

            <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ marginBottom: 4 }}>
                Logout
            </Button>

            <Box sx={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                <FormControl fullWidth>
                    <InputLabel sx={{ color: 'primary.main' }}>Select a Watchlist Movie</InputLabel>
                    <Select
                        value={selectedWatchMovie ? selectedWatchMovie.toString() : ''}
                        onChange={handleWatchMovieSelect}
                        sx={{
                            backgroundColor: "var(--background)",
                            '&.Mui-focused': {
                                backgroundColor: 'var(--background)',
                            },
                            '&:hover .MuiFilledInput-underline:before': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            '&.Mui-focused .MuiFilledInput-underline:after': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            '&.MuiFilledInput-root:before': {
                                borderBottom: "4px solid transparent",
                            },
                            '&.MuiFilledInput-root:hover:before': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            "& .css-lohd6h-MuiSvgIcon-root-MuiSelect-icon": {
                                color: "var(--text)"
                            },
                            color: "var(--text)",
                            fontWeight: "bold"
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: '#242424;',
                                    color: 'primary.main',
                                    "& .Mui-selected": {
                                        backgroundColor: "var(--background)"
                                    },
                                    "& .Mui-selected:hover": {
                                        backgroundColor: "var(--backgrounDisabled)"
                                    }
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Movie</em>
                        </MenuItem>
                        {watchList?.map((item) => (
                            <MenuItem key={item.movieId} value={item.movieId}>
                                {movieDetails[item.movieId]?.title || `Movie ID: ${item.movieId}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel sx={{ color: 'primary.main' }} >Select a Reviewed Movie</InputLabel>
                    <Select
                        value={selectedReviewMovie ? selectedReviewMovie.toString() : ''}
                        onChange={handleReviewMovieSelect}
                        sx={{
                            backgroundColor: "var(--background)",
                            '&.Mui-focused': {
                                backgroundColor: 'var(--background)',
                            },
                            '&:hover .MuiFilledInput-underline:before': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            '&.Mui-focused .MuiFilledInput-underline:after': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            '&.MuiFilledInput-root:before': {
                                borderBottom: "4px solid transparent",
                            },
                            '&.MuiFilledInput-root:hover:before': {
                                borderBottom: "4px solid var(--primary)"
                            },
                            "& .css-lohd6h-MuiSvgIcon-root-MuiSelect-icon": {
                                color: "var(--text)"
                            },
                            color: "var(--text)",
                            fontWeight: "bold"
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: '#242424;',
                                    color: 'primary.main',
                                    "& .Mui-selected": {
                                        backgroundColor: "var(--background)"
                                    },
                                    "& .Mui-selected:hover": {
                                        backgroundColor: "var(--backgrounDisabled)"
                                    }
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Movie</em>
                        </MenuItem>
                        {reviewList?.map((item) => (
                            <MenuItem key={item.movieId} value={item.movieId}>
                                {movieDetails[item.movieId]?.title || `Movie ID: ${item.movieId}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {selectedWatchMovie && movieDetails[selectedWatchMovie] && (
                    <Card sx={{ maxWidth: 500 }}>
                        <CardMedia
                            component="img"
                            image={`https://image.tmdb.org/t/p/w500${movieDetails[selectedWatchMovie].poster_path}`}
                            alt={movieDetails[selectedWatchMovie].title}
                        />
                        <CardContent>
                            <Typography sx={{ fontFamily: "var(--movie-font)" }} variant="h5">{movieDetails[selectedWatchMovie].title}</Typography>
                            <Typography sx={{ fontFamily: "var(--review-font)" }} variant="body1">{movieDetails[selectedWatchMovie].overview}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={() => handleMarkAsWatched(selectedWatchMovie)}
                                variant="contained"
                                disabled={watchList?.find((item) => item.movieId === selectedWatchMovie)?.isWatched}
                            >
                                {watchList?.find((item) => item.movieId === selectedWatchMovie)?.isWatched
                                    ? 'Already Watched'
                                    : 'Mark as Watched'}
                            </Button>
                        </CardActions>
                    </Card>
                )}

                {selectedReviewMovie && movieDetails[selectedReviewMovie] && (
                    <Card sx={{ maxWidth: 500, marginLeft: 4 }}>
                        <CardMedia
                            component="img"
                            image={`https://image.tmdb.org/t/p/w500${movieDetails[selectedReviewMovie].poster_path}`}
                            alt={movieDetails[selectedReviewMovie].title}
                        />
                        <CardContent>
                            <Typography variant="h5" sx={{fontFamily: "var(--movie-font)"}}>{movieDetails[selectedReviewMovie].title}</Typography>

                            <Rating
                                defaultValue={reviewList?.find((item) => item.movieId === selectedReviewMovie)?.rating || 0}
                                onChange={(event, newValue) => handleRatingChange(newValue)}
                            />

                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                defaultValue={reviewList?.find((item) => item.movieId === selectedReviewMovie)?.content || ''}
                                onChange={(e) => setReview(e.target.value)}
                                sx={{ fontFamily: "var(--review-font)", marginTop: 2 }}
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={() =>
                                    handleEditReview(selectedReviewMovie)
                                }
                                variant="contained"
                            >
                                Update Review
                            </Button>
                            <Button
                                onClick={() => handleDeleteReview(selectedReviewMovie)}
                                variant="contained"
                                color="error"
                            >
                                Delete Review
                            </Button>
                        </CardActions>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default ProfilePage;
