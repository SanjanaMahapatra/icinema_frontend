import { FC, useEffect, useState } from "react";
import Carousel from "./carousel/Carousel";
import MoviesHome from "../movies/MoviesHome";
import axiosInstance from "../../interceptor/AxiosInterceptor";

const Home: FC = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const recommendedHeading = "Recommended Movies";
  const upcomingHeading = "Upcoming Movies";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingRecommended(true);
    setLoadingUpcoming(true);
    try {
      const recommendedMoviesResponse = await axiosInstance.get(
        "/moviesms/recommended-movies"
      );
      setRecommendedMovies(recommendedMoviesResponse.data);
      setLoadingRecommended(false);
      const upcomingMoviesResponse = await axiosInstance.get(
        "/moviesms/upcoming-latest-movies"
      );
      setUpcomingMovies(upcomingMoviesResponse.data);
      setLoadingUpcoming(false);
    } catch (error) {
      console.log("Error fetching data", error);
      setLoadingRecommended(false);
      setLoadingUpcoming(false);
    }
  };

  return (
    <>
      <Carousel />
      <div className="mt-5">
        <MoviesHome
          heading={recommendedHeading}
          moviesList={recommendedMovies}
          route={"/movies"}
          loading={loadingRecommended}
        />
      </div>
      <div className="my-5">
        <MoviesHome
          heading={upcomingHeading}
          moviesList={upcomingMovies}
          route={"/upcoming-movies"}
          loading={loadingUpcoming}
        />
      </div>
    </>
  );
};

export default Home;
