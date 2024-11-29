import React from 'react';
import { Box, Button } from '@mui/material';

/**
 * Props interface to define the expected properties for the Pagination component.
 * 
 * @interface PaginationProps
 * @property {number} totalPages - The total number of pages available for pagination.
 * @property {number} currentPage - The current active page number.
 * @property {(page: number) => void} onPageChange - A callback function triggered when a page button is clicked. 
 * The function receives the selected page number as its argument.
 */
interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void; // Callback function triggered when a page is clicked
}

/**
 * Pagination component that displays page buttons for navigating through multiple pages.
 * 
 * This component takes `totalPages`, `currentPage`, and `onPageChange` as props. 
 * It renders a button for each page from 1 to `totalPages`, with the current page highlighted 
 * using a 'contained' button style, and other pages using an 'outlined' style. 
 * When a page button is clicked, the `onPageChange` callback is triggered with the selected page.
 * 
 * @component 
 * @param {PaginationProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered Pagination component.
 */
const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
    // Create an array of page numbers from 1 to totalPages
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            {/* Map through the pages array to create a button for each page */}
            {pages.map((page) => (
                <Button
                    key={page}
                    variant={page === currentPage ? 'contained' : 'outlined'}
                    onClick={() => onPageChange(page)}
                    sx={{ margin: '0 4px' }}
                >
                    {page}
                </Button>
            ))}
        </Box>
    );
};

export default Pagination;



