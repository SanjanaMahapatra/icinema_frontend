import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../interceptor/AxiosInterceptor";
import "../../styles/ViewMovieDetails.css";
import Loader from "../loader/Loader";

type MoviesData = {
  movieId: string;
  movieName: string;
  releaseDate: string;
  genres: string[];
  censorRating: string;
  languages: string[];
  duration: string;
  rating: number;
  averageRating: number;
  description: string;
  imageUrl: string;
};

const ViewMovieDetails: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isUpcoming} = location?.state;
  const { movieId } = useParams();
  const [fetchMoviesLoader, setFetchMoviesLoader] = useState<boolean>(false);
  const [movie, setMovie] = useState<MoviesData>({
    movieId: "",
    movieName: "",
    releaseDate: "",
    genres: [],
    censorRating: "",
    languages: [],
    duration: "",
    rating: 0,
    averageRating: 0,
    description: "",
    imageUrl: "",
  });

  const fetchMovies = async () => {
    try {
      setFetchMoviesLoader(true);
      const response = await axiosInstance.get(`/moviesms/movies/${movieId}`);
      setMovie(response?.data);
      setFetchMoviesLoader(false);
    } catch (error) {
      setFetchMoviesLoader(false);
      console.log("err from client side : ", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [movieId]);

  useEffect(() => {}, []);

  const handleClick = () => {
    navigate(`/book-movie`, { state: { movie } });
  };

  return (
    <>
      {fetchMoviesLoader ? (
        <Loader />
      ) : (
        <div className="container-fluid view-movie-details">
          <section className="section-movie-content">
            <div
              className="movie-content"
              style={{
                background: `linear-gradient(90deg, rgb(26, 26, 26) 24.97%, rgb(26, 26, 26) 38.3%, rgba(26, 26, 26, 0.04) 97.47%, rgb(26, 26, 26) 100%) , url(${`/assets/${movie?.imageUrl}`})`,
              }}
            >
              <div className="movie-poster">
                {/* Image content */}

                <div className="movie-image">
                  <img
                    src={`/assets/${movie?.imageUrl}`}
                    alt={movie?.movieName}
                    className="img-fluid"
                  />
                </div>

                {/* Ratings Content */}

                <div className="movie-child-content">
                  <div className="display-5 movie-name-header">{`${movie?.movieName}`}</div>
                  <section className="movie-rating-display"></section>
                  <div className="movie-name-content">
                    <div className="facts">
                      <div className="movie-languages">
                        {movie?.languages?.map(
                          (language: string, languageId: number) => {
                            return languageId !==
                              movie?.languages?.length - 1 ? (
                              <span key={languageId}>{`${language} , `}</span>
                            ) : (
                              <span key={languageId}>{language}</span>
                            );
                          }
                        )}
                      </div>
                      <div className="movie-facts">
                        <span className="runtime">{`${
                          movie?.duration?.split(":")[0]
                        }h ${movie?.duration?.split(":")[0]}m `}</span>
                        <span className="facts-dots">•</span>
                        <span className="certification">
                          {movie?.censorRating}
                        </span>
                        <span className="facts-dots">•</span>
                        <span className="genres">
                          {movie?.genres?.map(
                            (genre: string, genreId: number) => {
                              return genreId !== movie?.genres?.length - 1 ? (
                                <span key={genreId}>{`${genre} , `}</span>
                              ) : (
                                <span key={genreId}>{genre}</span>
                              );
                            }
                          )}
                        </span>
                      </div>
                      <div className="movie-overview">
                        <div className="movie-description-content">
                          <h4 className="tagline">Overview</h4>
                          <div className="overview">
                            <p>{movie?.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="characters-list">
                      <button
                        className="btn btn-danger profile"
                        disabled={isUpcoming}
                        onClick={() => {
                          handleClick();
                        }}
                      >
                        Book My Show
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ViewMovieDetails;
