import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Represents the structure of a User object.
 * 
 * @interface User
 * @property {string} id - The unique identifier for the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} name - The full name of the user.
 * @property {number} watchedMoviesCount - The number of movies the user has watched.
 * @property {number} reviewsCount - The number of reviews the user has written.
 * @property {string[]} watchList - A list of movie IDs the user intends to watch.
 * @property {string[]} reviews - A list of review IDs written by the user.
 */
interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    watchedMoviesCount: number;
    reviewsCount: number;
    watchList: string[];  
    reviews: string[]; 
}

/**
 * The context type for managing the user state and providing access to the user data.
 * 
 * @interface UserContextType
 * @property {User | null} user - The current user object or null if no user is logged in.
 * @property {function} setUser - A function to update the user state and persist it in localStorage.
 */
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provides the UserContext to its children components.
 * This component is responsible for managing the user state and persisting it in localStorage.
 * 
 * @component
 * @param {object} props - The properties of the UserProvider component.
 * @param {React.ReactNode} props.children - The child components that will consume the UserContext.
 * @returns {React.ReactElement} The rendered UserProvider component with the UserContext provider.
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);

      /**
     * Function to update both the user state and persist the user data in localStorage.
     * 
     * @param {User | null} user - The user object to set, or null to clear the user data.
     */
    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
/**
 * Custom hook to access the user data and setUser function from the UserContext.
 * This hook must be used within a UserProvider, otherwise it will throw an error.
 * 
 * @returns {UserContextType} The user context with user data and the setUser function.
 * @throws {Error} Will throw an error if used outside of a UserProvider.
 */
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
