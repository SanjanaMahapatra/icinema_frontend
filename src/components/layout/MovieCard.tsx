import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../models/Movie";
import "../../styles/MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
}

const MovieCard: FC<MovieCardProps> = ({ movie, showRating=true }) => {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.movieId}`} state={{isUpcoming : !showRating}} style={{ textDecoration: "none" }}>
        <div className="img-class">
          <img
            src={`/assets/${movie?.imageUrl}`}
            alt={movie?.movieName}
            className="image"
          />
          {showRating && <div className="rating">
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "rgb(220, 53, 88)",
                fontSize: "0.9em",
                marginLeft: "1em",
                marginRight: "0.5em",
              }}
            />
            {movie?.rating}/10
          </div>}
        </div>
        <div className="movie-info">
          <div className="movie-title">{movie?.movieName}</div>
          <div className="movie-genre">{movie.genre?.join("/")}</div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
