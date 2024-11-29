import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * Interface representing the structure of a review.
 * 
 * @interface Review
 * @property {string} userId - The unique identifier of the user who wrote the review.
 * @property {string} username - The name of the user who wrote the review.
 * @property {string} reviewText - The content of the review.
 * @property {number} rating - The rating given by the user (e.g., 1-5 stars).
 * @property {string} timestamp - The timestamp when the review was created.
 */
interface Review {
    userId: string;
    username: string;
    reviewText: string;
    rating: number;
    timestamp: string;
}

/**
 * Props for the MovieReviews component.
 * 
 * @interface MovieReviewsProps
 * @property {number} movieId - The unique identifier for the movie whose reviews are being fetched.
 */
interface MovieReviewsProps {
    movieId: number;
}

/**
 * MovieReviews component that fetches and displays reviews for a given movie.
 * 
 * This component accepts a `movieId` as a prop and fetches reviews for that movie 
 * from an API. It displays the reviews in a scrollable box, showing each review's 
 * username, content, rating, and timestamp. A loading spinner is shown while data 
 * is being fetched, and error messages are displayed if the fetch fails.
 * 
 * @component 
 * @param {MovieReviewsProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered MovieReviews component.
 */
const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

      /**
     * Fetches reviews from the API when the component mounts or the movieId changes.
     * Sets loading state to true while fetching, and updates the reviews state 
     * upon successful fetch. Handles error messages and updates the error state 
     * in case of failure.
     */
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://localhost:7093/api/ReviewList/movie/${movieId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.message) {
                        // If the API returns a message indicating no reviews are found
                        setError(data.message);
                    } else {
                        // If reviews are found, format the data into the required structure
                        const formattedReviews = data.map((review: any) => ({
                            userId: review.reviewListOwnerId,
                            username: review.username,
                            reviewText: review.content,
                            rating: review.rating,
                            timestamp: review.createdAt,
                        }));
                        setReviews(formattedReviews);
                    }
                } else {
                    // Handle non-200 HTTP status codes
                    setError("Failed to fetch reviews. Please try again later.");
                }
            } catch (err) {
                // Handle network or server errors
                setError("Failed to connect to the server. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [movieId]); // Dependency array ensures the function runs when movieId changes

    // Show a loading spinner while fetching data
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="body1" color="primary" textAlign="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                marginTop: 2,
                bgcolor: "background.paper",
            }}
        >
            {reviews.map((review, index) => (
                <Box
                    key={index}
                    sx={{
                        borderBottom: "1px solid #eee",
                        paddingBottom: 2,
                        marginBottom: 2,
                        "&:last-child": { borderBottom: "none" },
                    }}
                >
                    {/* Display the reviewer's username */}
                    <Typography variant="subtitle2" color="primary" sx={{ fontFamily: "var(--review-font)" }}>
                        {review.username}
                    </Typography>
                    {/* Display the review text */}
                    <Typography sx={{ marginTop: 1, color: 'black', fontFamily: "var(--review-font)" }}>
                        {review.reviewText}
                    </Typography>
                    {/* Display the rating and timestamp */}
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: "var(--review-font)" }}>
                        Rating: {review.rating} ★
                    </Typography>
                    <Box/> {/* Adds vertical space between the two lines */}
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: "var(--review-font)" }}>
                        {new Date(review.timestamp).toLocaleString()}
                    </Typography>

                </Box>
            ))}
        </Box>
    );
};

export default MovieReviews;
