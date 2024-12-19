import React, { FC } from 'react'
import MovieList from './MovieList';

const UpcomingMovies: FC = () => {
  return (
    <MovieList fromUpcoming={true}/>
  )
}

export default UpcomingMovies;
