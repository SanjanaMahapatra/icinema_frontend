import React, { FC, useEffect, useState } from "react";
import "../../styles/MoviesHome.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import MovieCard from "../layout/MovieCard";
import { Movie } from "../models/Movie";
import Loader from "../loader/Loader";

interface MovieList {
  moviesList: Movie[];
  heading: string;
  route: string;
  loading: boolean; // Add loading prop
}

const MoviesHome: FC<MovieList> = ({ moviesList, heading, route, loading }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [increment, setIncrement] = useState(5);

  useEffect(() => {
    const updateIncrement = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setIncrement(5);
      } else if (width >= 992) {
        setIncrement(4);
      } else if (width >= 768) {
        setIncrement(3);
      } else {
        setIncrement(2);
      }
    };

    updateIncrement();
    window.addEventListener("resize", updateIncrement);

    return () => {
      window.removeEventListener("resize", updateIncrement);
    };
  }, []);

  const handleNext = () => {
    if (startIndex + increment < moviesList.length) {
      setStartIndex((prevIndex) => prevIndex + increment);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - increment);
    }
  };

  return (
    <>
      <div className="container position-relative">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{heading}</h2>
          <Link className="see-all" to={route}>
            See All{" "}
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ fontSize: "0.55em", paddingBottom: "0.2em" }}
            />
          </Link>
        </div>
        {loading ? (
          <Loader /> // Display Loader when loading is true
        ) : (
          <div className="movies-list">
            {startIndex > 0 && (
              <button className="arrow-icon arrow-left" onClick={handlePrev}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  style={{ color: "#ffffff" }}
                />
              </button>
            )}
            <div className="d-flex">
              {moviesList
                .slice(startIndex, startIndex + 5)
                .map((movie: Movie) => (
                  <div key={movie.movieId}>
                    <MovieCard
                      movie={movie}
                      showRating={heading === "Recommended Movies"}
                    />
                  </div>
                ))}
            </div>
            {startIndex + increment < moviesList.length && (
              <div className="arrow-icon arrow-right" onClick={handleNext}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ color: "#ffffff" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MoviesHome;
