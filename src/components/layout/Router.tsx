import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ViewMovieDetails from "../movies/ViewMovieDetails";
import MovieBooking from "../movies/booking/MovieBooking";
import MovieList from "../movies/MovieList";
import UpcomingMovies from "../movies/UpcomingMovies";
import Seats from "../seats/Seats";
import ViewBookingDetails from "../movies/booking/ViewBookingDetails";
import ConfirmedBookingDetails from "../movies/booking/ConfirmedBookingDetails";
import PrivateRoute from "./PrivateRoute";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:movieId" element={<ViewMovieDetails />} />
        <Route path="/upcoming-movies" element={<UpcomingMovies />} />
        <Route path="/book-movie" element={<PrivateRoute element={<MovieBooking />} />} />
        <Route path="/seat-layout/:movieId/:theatreId/:showId" element={<PrivateRoute element={<Seats />} />} />
        <Route path="/view-booking-details/:bookingId" element={<PrivateRoute element={<ViewBookingDetails />} />} />
        <Route path="/confirmed-booking" element={<PrivateRoute element={<ConfirmedBookingDetails />} />} />
      </Routes>
    </>
  );
};

export default Router;
