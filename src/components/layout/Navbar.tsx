import React, { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import axiosInstance from "../../interceptor/AxiosInterceptor";
import { Movie } from "../models/Movie";

const Navbar: FC<{ currentUrl: string, setShowLoginModal: (show: string) => void }> = ({ currentUrl, setShowLoginModal }) => {

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  const handleLoginClick = () => {
    setShowLoginModal("login");
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await axiosInstance.get(`/moviesms/movies`);
        setAllMovies(response.data);
      } catch (error) {
        console.error('Error fetching all movies:', error);
      }
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = allMovies.filter(movie =>
        movie?.movieName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allMovies]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = (movieid: number) => {
    setSearchTerm('');
    setSearchResults([]);
    navigate(`/movies/${movieid}`, {state: {isUpcoming : false}});
  }

  const handleRegisterClick = () => {
    setShowLoginModal("register");
  }
  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="logo">
          I-CINEMA
        </Link>
        {!currentUrl.includes("/confirm-booking") && (
          <>
            <div className="input">
              <FontAwesomeIcon icon={faSearch} className="search-icon p-2" />
              <input
                className="form-control"
                placeholder="Search for Movies, Events, Plays, Sports, and Activities"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <ul className="dropdown-menu show overflow-scroll search-result p-0">
                  {searchResults.map((result) => (
                    <li key={result.movieId} className="dropdown-item">
                    <button
                      className="dropdown-item-button py-1" 
                      onClick={() => handleSearchClick(result.movieId)}
                    >
                      {result.movieName}
                    </button>
                  </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="right-container">
              {localStorage.getItem('token') === null && <><button className="btn btn-danger cust-btn me-3" onClick={handleLoginClick}>Sign in</button>
                <button className="btn btn-danger cust-btn" onClick={handleRegisterClick}>Sign up</button></>}
              {localStorage.getItem('token') !== null && <button className="btn btn-danger cust-btn me-2" onClick={() => { localStorage.removeItem('token'); navigate("/home"); }}>Sign out</button>}
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
