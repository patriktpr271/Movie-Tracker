import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField, Rating } from "@mui/material";
import MovieReviews from "./MovieReviews";

/**
 * Props for the MovieDetailModal component.
 * 
 * @interface MovieDetailModalProps
 * @property {boolean} open - Whether the modal is open or not.
 * @property {() => void} onClose - Function to close the modal.
 * @property {string} title - The title of the movie.
 * @property {string} poster_path - The relative path to the movie's poster image.
 * @property {string} overview - The overview or description of the movie.
 * @property {string} additionalData - Any additional data to display about the movie.
 * @property {() => void} handleWatchlist - Function to handle adding the movie to the watchlist.
 * @property {number} movieId - The ID of the movie.
 * @property {string} userId - The ID of the user submitting the review.
 */
interface MovieDetailModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    poster_path: string;
    overview: string;
    additionalData: string;
    handleWatchlist: () => void;
    movieId: number;
    userId: string;
}

/**
 * Modal component that displays movie details with options to add a review and add the movie to the watchlist.
 * 
 * @component
 * @param {MovieDetailModalProps} props - The properties passed to the modal component.
 * @returns {JSX.Element} The rendered MovieDetailModal component.
 */
const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
    open,
    onClose,
    title,
    poster_path,
    overview,
    additionalData,
    handleWatchlist,
    movieId,
    userId,
}) => {
    const [review, setReview] = useState(""); // State to store the review text
    const [rating, setRating] = useState<number | null>(null); // State to track the selected rating

    /**
    * Handles the submission of the review.
    * Validates the input and sends the review data to the backend API.
    */
    const handleSubmitReview = async () => {
        if (!review.trim()) {
            alert("Review cannot be empty.");
            return;
        }

        if (rating === null) {
            alert("Please provide a rating.");
            return;
        }

        try {
            // API call to submit the review
            const response = await fetch(`https://localhost:7093/api/ReviewList/AddReview`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    movieId: movieId,
                    reviewText: review,
                    rating: rating
                }),
            });

            if (response.ok) {
                alert("Review submitted successfully!");
                setReview("");
                setRating(null);
            } else {
                const errorMessage = await response.text();
                alert(`Failed to submit review: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An error occurred while submitting the review.");
        }
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: "65vw",
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    display: "flex",
                    alignItems: "stretch",
                    flexDirection: "row",
                    transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
            >
                {/* Movie poster with hover scaling effect */}
                <img
                    src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                    alt={title}
                    style={{
                        width: "30%",
                        maxWidth: 500,
                        borderRadius: 8,
                        marginRight: 20,
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                        {/* Movie title */}
                        <Typography
                            variant="h4"
                            sx={{
                                marginBottom: 1,
                                color: "primary.main",
                                fontWeight: 600,
                                fontFamily: '"Bebas Neue"'
                            }}
                        >
                            {title}
                        </Typography>
                        {/* Movie overview */}
                        <Typography
                            variant="body1"
                            sx={{
                                marginBottom: 2,
                                color: "text.primary",
                                lineHeight: 1.5,
                                fontFamily: "var(--movie-font)"
                            }}
                        >
                            {overview}
                        </Typography>

                        {additionalData && (
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: 2,
                                }}
                            >
                                {additionalData}
                            </Typography>
                        )}
                    </Box>

                    {/* Component to display existing reviews for the movie */}
                    <MovieReviews movieId={movieId} />

                    {/* Review input and rating */}
                    <Box sx={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
                        <Rating
                            name="movie-rating"
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                            precision={0.5}
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            label="Leave a review"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            sx={{ marginTop: 2, borderRadius: 2, backgroundColor: "#f5f5f5" }}
                        />
                        <Box sx={{ display: "flex", gap: 2, marginTop: 2, justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleWatchlist}
                                sx={{
                                    borderRadius: 2,
                                    paddingX: 3,
                                    paddingY: 1.5,
                                    textTransform: "none",
                                }}
                            >
                                Add to Watchlist
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmitReview}
                                sx={{
                                    borderRadius: 2,
                                    paddingX: 3,
                                    paddingY: 1.5,
                                    textTransform: "none",
                                }}
                            >
                                Submit Review
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default MovieDetailModal;
