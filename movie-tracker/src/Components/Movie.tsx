import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieDetailModal from "./MovideDetailsModal";
import Pagination from "./Pagination";
import { useUser } from '../Contexts/UserContext';

//Movie constans
const TOTAL_MOVIES = 240;
const API_KEY = "&api_key=6816c4a43c7689de5349fd72378347e3";
const BASE_URL = "https://api.themoviedb.org/3";
const MOVIES_PER_PAGE = 20;

interface MovieProps {
    selectedCategory: string;
}

/**
 * Movie component for displaying movies from an external API with pagination and movie details.
 * 
 * @param {MovieProps} props - The component's props.
 * @returns {JSX.Element} The rendered Movie component.
 */
const Movie: React.FC<MovieProps> = ({ selectedCategory }) => {
    // State to hold the list of movies fetched from the API
    const [movieList, setMovieList] = useState<
        { id: number; title: string; poster_path: string; overview: string }[]
    >([]);

    // Access the user context for user-related data
    const { user } = useUser();

    // State to handle the currently selected movie for the modal
    const [selectedMovie, setSelectedMovie] = useState<{
        id: number;
        title: string;
        poster_path: string;
        overview: string;
    } | null>(null);

    // State to manage the modal visibility
    const [modalOpen, setModalOpen] = useState(false);

      /**
     * Generates the URL for the TMDB API based on the selected category and page number.
     * 
     * @param {string} category - The category of movies to fetch (e.g., "Action").
     * @param {number} page - The current page number for pagination.
     * @returns {string} The generated API URL for fetching movies.
     */
    const generateUrl = (category: string, page: number) => {
        let endpoint = "/discover/movie?sort_by=popularity.desc";
        if (category === "Action") endpoint = "/discover/movie?with_genres=28";
        else if (category === "Drama") endpoint = "/discover/movie?with_genres=18";
        else if (category === "Fantasy") endpoint = "/discover/movie?with_genres=14";
        else if (category === "Horror") endpoint = "/discover/movie?with_genres=27";
        else if (category === "Comedy") endpoint = "/discover/movie?with_genres=35";
        else if (category === "Documentary") endpoint = "/discover/movie?with_genres=99";
        return BASE_URL + endpoint + API_KEY + "&page=" + page;
    };

    // State to hold the user's watchlist (local state for client-side management)
    const [watchlist, setWatchlist] = useState<string[]>([]);

    // State to track the current page for pagination
    const [currentPage, setCurrentPage] = useState(1);

     /**
     * Fetches movies from the TMDB API based on the selected category and page.
     * 
     * @param {number} page - The current page number for pagination.
     * @returns {Promise<void>} A promise that resolves when the movies are fetched and set in state.
     */
    const getMovies = async (page: number) => {
        try {
            const url = generateUrl(selectedCategory, page);
            const response = await fetch(url);
            const data = await response.json();

            setMovieList(data.results); // Update movie list state with fetched results
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };

    // Effect to fetch movies when the selected category changes
    useEffect(() => {
        getMovies(1); // Fetch movies for the first page
        setCurrentPage(1); // Reset pagination to the first page
    }, [selectedCategory]);

        /**
     * Opens the movie detail modal and sets the selected movie.
     * 
     * @param {object} movie - The movie object to display in the modal.
     * @param {number} movie.id - The ID of the movie.
     * @param {string} movie.title - The title of the movie.
     * @param {string} movie.poster_path - The poster image path of the movie.
     * @param {string} movie.overview - The overview of the movie.
     */
    const handleOpenModal = (movie: {
        id: number;
        title: string;
        poster_path: string;
        overview: string;
    }) => {
        setSelectedMovie(movie);
        setModalOpen(true);
    };

    // Function to close the modal and clear the selected movie
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedMovie(null);
    };

     /**
     * Adds a movie to the user's watchlist if not already present.
     * 
     * @param {number} movieId - The ID of the movie to add to the watchlist.
     * @param {string} movieTitle - The title of the movie to add to the watchlist.
     */
    const handleAddToWatchlist = async (movieId: number, movieTitle: string) => {
        if (!user?.watchList.includes(movieTitle)) {
            setWatchlist([...watchlist, movieTitle]); // Update local watchlist state
            console.log(`${movieId} added to watchlist.`);

            try {
                // Send a request to the backend API to add the movie to the user's watchlist
                const response = await fetch(
                    `https://localhost:7093/api/WatchList/AddToWatchList?userId=${user?.id}&movieId=${movieId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to add to watchlist: ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Added to watchlist:", result);
                alert("Movie added to watchlist!");
            } catch (error) {
                console.error("Error adding to watchlist:", error);
            }
        } else {
            console.log(`${movieId} is already in the watchlist.`);
        }
    };

    // Function to handle page changes for pagination
    const handlePageChange = (page: number) => {
        getMovies(page);
        setCurrentPage(page);
    };

    return (
        <div>
            {/* Movie cards grid */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", paddingBottom: '64px' }}>
                {movieList.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster_path={movie.poster_path}
                        overview={movie.overview}
                        onClick={() => handleOpenModal(movie)}
                    />
                ))}
            </div>

            {/* Pagination controls */}
            <Pagination
                totalPages={Math.ceil(TOTAL_MOVIES / MOVIES_PER_PAGE)}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            {/* Modal for movie details */}
            {selectedMovie && (
                <MovieDetailModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title={selectedMovie.title}
                    poster_path={selectedMovie.poster_path}
                    overview={selectedMovie.overview}
                    movieId={selectedMovie.id}
                    userId={user?.id || ""}
                    additionalData={`Current reviews: ${[selectedMovie.title]?.length || 0}`}
                    handleWatchlist={() => handleAddToWatchlist(selectedMovie.id, selectedMovie.title)}
                />
            )}
        </div>
    );
}

export default Movie;
