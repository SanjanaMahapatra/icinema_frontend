import React, { FC, useEffect, useState } from "react";
import "../../styles/MovieList.css";
import MovieCard from "../layout/MovieCard";
import { languages, genres, ratings } from "../../constants/Constants";
import axiosInstance from "../../interceptor/AxiosInterceptor";
import Loader from "../loader/Loader";

interface Movie {
  movieId: number;
  title: string;
  genre: string[];
  poster: string;
  movieName?: string;
  imageUrl?: string;
}

const MovieList: FC<{ fromUpcoming?: boolean }> = ({
  fromUpcoming = false,
}) => {
  const [allMoviesList, setAllMoviesList] = useState<Movie[]>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setShowLoader(true);
      setAllMoviesList([]);
      try {
        const params = new URLSearchParams();

        if (selectedLanguage) params.append("language", selectedLanguage);
        if (selectedGenre.length > 0)
          selectedGenre.forEach((genre) => params.append("genre", genre));
        if (selectedRating) params.append("rating", selectedRating);

        const { data } = await axiosInstance.get(
          `/moviesms/${fromUpcoming ? 'upcoming-movies' : 'movies'}?${params.toString()}`
        );
        setAllMoviesList(data);
        setShowLoader(false);
      } catch (error) {
        setShowLoader(false);
        console.error("Error fetching movies:", error);
      }
    };

    fetchData();
  }, [selectedLanguage, selectedGenre, selectedRating, fromUpcoming]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedGenre((prevGenres) =>
      checked
        ? [...prevGenres, value]
        : prevGenres.filter((genre) => genre !== value)
    );
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRating(e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Filter Sidebar */}
        <div className="card col-md-3 shadow p-0 my-3 ms-3 me-5" style={{ height: "25rem" }}>
          <div className="card-body filter-card">
            <div
              className="accordion accordion-flush"
              id="accordionFlushExample"
            >
              {/* Language Filter */}
              <div className="accordion-item">
                <div className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed pb-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Languages
                  </button>
                </div>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                >
                  <div className="accordion-body pt-0">
                    {languages.map((language) => (
                      <div className="form-check" key={language}>
                        <input
                          type="radio"
                          className="form-check-input"
                          id={language}
                          name="language"
                          value={language}
                          onChange={handleLanguageChange}
                        />
                        <label htmlFor={language} className="form-check-label">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Genre Filter */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingTwo">
                  <button
                    className="accordion-button collapsed pb-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    Genres
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwo"
                >
                  <div className="accordion-body pt-0">
                    {genres.map((genre) => (
                      <div className="form-check" key={genre}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={genre}
                          value={genre}
                          onChange={handleGenreChange}
                        />
                        <label htmlFor={genre} className="form-check-label">
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              {!fromUpcoming && (
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button
                      className="accordion-button collapsed pb-2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      Rating
                    </button>
                  </h2>
                  <div
                    id="flush-collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                  >
                    <div className="accordion-body pt-0">
                      {ratings.map((rate) => (
                        <div className="form-check" key={rate}>
                          <input
                            type="radio"
                            className="form-check-input"
                            id={rate}
                            name="rating"
                            value={rate}
                            onChange={handleRatingChange}
                          />
                          <label htmlFor={rate} className="form-check-label">
                            {rate + "+"}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Cards Display */}
        <div
          className="card col-md-8 shadow overflow-scroll m-3"
          style={{ height: "490px" }}
        >
          <div
            className="card-body d-flex justify-content-center align-items-center"
          >
            {showLoader ? (
              <Loader />
            ) : (
              <div className="row">
                {allMoviesList?.length !== 0 ? (
                  allMoviesList?.map((movie) => (
                    <div className="col-lg-4 col-sm-6 mb-4" key={movie.movieId}>
                      <MovieCard movie={movie} showRating={!fromUpcoming} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted my-4">No movies found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
