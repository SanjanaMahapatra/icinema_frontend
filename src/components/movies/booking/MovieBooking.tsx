import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/MovieBooking.css";
import axiosInstance from "../../../interceptor/AxiosInterceptor";
import Loader from "../../loader/Loader";

type Shows = {
  showDate: number;
  theatreId: number;
  showTime: string;
  availableSeats: number;
};

type TheatresList = {
  theatreId: number;
  theatreName: string;
  location: string;
  totalSeats: number;
  showDate: string;
  movieId: number;
  shows: Shows[];
};

type ShowDates = {
  day: string;
  date: string;
  month: string;
  isSelected: boolean;
  string_date_format: string;
};

const initialTheatresList: TheatresList = {
  theatreId: 0,
  theatreName: "",
  location: "",
  totalSeats: 0,
  showDate: "",
  movieId: 0,
  shows: [{ showDate: 0, theatreId: 0, showTime: "", availableSeats: 0 }],
};

const MovieBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theatresList, setTheatresList] = useState<TheatresList[]>([
    initialTheatresList,
  ]);
  const [isShowTheatre, setIsShowTheatre] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<any>("");

  const [showDates, setShowDates] = useState<ShowDates[]>([]);
  const [selectedDate, setSelectedDate] = useState<ShowDates>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!location?.state) {
      navigate(`/movies`);
    }
  }, [location?.state, navigate]);

  useEffect(() => {
    let todayDate = new Date();
    let currentDate = todayDate?.toJSON().slice(0, 10);
    showTheatresListBasedOnShowDate(currentDate);
    setTheShowDates(6);
  }, []);

  const setTheShowDates = (noOfDaysToAdd: number) => {
    let currentDate = new Date();
    let resultShowDates: ShowDates[] = [];
    let showDate: ShowDates = {
      date: "",
      day: "",
      month: "",
      isSelected: false,
      string_date_format: "",
    };
    for (let x = 0; x < noOfDaysToAdd; x++) {
      let addDate = new Date();
      addDate.setDate(currentDate.getDate() + x);
      showDate = {
        day: addDate.toLocaleString("default", { weekday: "short" }),
        month: addDate.toLocaleString("default", { month: "short" }),
        date: addDate.toLocaleString("default", { day: "2-digit" }),
        isSelected: x === 0 ? true : false,
        string_date_format: addDate?.toJSON().slice(0, 10),
      };
      if (x === 0) setSelectedDate(showDate);
      resultShowDates?.push(showDate);
    }
    setShowDates([...resultShowDates]);
  };

  const showTheatresListBasedOnShowDate = async (date: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("movieId", location?.state?.movie?.movieId);
      params.append("showDate", date);
      const response = await axiosInstance.get(
        `/theatrems/theatre?${params?.toString()}`
      );
      setTheatresList(response?.data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("Error fetching the theatres list : ", error);
      setTheatresList([]);
      setErrorMsg(error?.response?.data?.errorMessage);
    }
  };

  useEffect(() => {
    if (theatresList?.length > 0 && theatresList !== null) {
      setIsShowTheatre(true);
    } else {
      setIsShowTheatre(false);
    }
  }, [theatresList]);

  const timeFormatter = (showTime: string) => {
    let resultantTime: string = "";
    const times = showTime?.split(":");
    let [hr, min]: any = [...times];
    if (hr > "12") {
      resultantTime = `${hr - 12}:${min} PM`;
    } else if (hr < "12") {
      resultantTime = `${hr}:${min} AM`;
    } else {
      resultantTime = `${hr}:${min} PM`;
    }
    return resultantTime;
  };

  const handleDateClick = (dateIndx: number) => {
    let exstDates: ShowDates[] = [...showDates];
    let dateSelected: ShowDates = exstDates[dateIndx];
    let isAlreadyDateSelected = exstDates?.findIndex(
      (date: ShowDates) => date?.isSelected === true
    );
    dateSelected.isSelected = !dateSelected.isSelected;
    if (isAlreadyDateSelected > -1) {
      exstDates[isAlreadyDateSelected].isSelected = false;
    }
    setShowDates([...exstDates]);
    setSelectedDate(exstDates[dateIndx]);
    showTheatresListBasedOnShowDate(exstDates[dateIndx]?.string_date_format);
  };

  const handleNavigateToSeatLayout = (
    selectedTheaterId: number,
    selectedShowId: number,
    theatreName: string,
    showTiming: string
  ) => {
    navigate(
      `/seat-layout/${location?.state?.movie?.movieId}/${selectedTheaterId}/${selectedShowId}`,
      {
        state: {
          movieName: location?.state?.movie?.movieName,
          theatreName: theatreName,
          showTime: timeFormatter(showTiming),
          showDate: selectedDate,
        },
      }
    );
  };

  const isDisabled = (showTime: string): boolean => {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let currHr: string = "";
    let currMM: string = "";
    currHr = hh < 10 ? "0" + hh : hh?.toString();
    currMM = mm < 10 ? "0" + mm : mm?.toString();
    let currentTime: string = "";
    currentTime = currHr + ":" + currMM;
    let modifiedShowTime = showTime?.substring(0, 5);
    return currentTime > modifiedShowTime;
  };

  return (
    <>
      <section className="movie-timings-details">
        <div className="display-4 theatre-movie-name">
          {location?.state?.movie?.movieName}
        </div>
        <div className="theatre-movie-facts">
          <span className="movie-censor-rating">
            {location?.state?.movie?.censorRating}
          </span>
          <span className="genre-tags">
            {location?.state?.movie?.genres?.map(
              (g: string, gIndex: number) => {
                return (
                  <span key={gIndex} className="genre">
                    {" "}
                    {g}
                  </span>
                );
              }
            )}
          </span>
        </div>
        <div className="show-dates-slicker">
          <div className="show-dates-container">
            <div className="dates-wrapper">
              <ul className="show-date">
                {showDates?.map((showDate: ShowDates, dateIndx: number) => {
                  return (
                    <button
                      className={` show-date-detail px-3 py-0 ${
                        showDate?.isSelected ? "color-change" : ""
                      } `}
                      key={dateIndx}
                      onClick={() => {
                        handleDateClick(dateIndx);
                      }}
                    >
                      <li className="day">{showDate?.day}</li>
                      <li className="date">{showDate?.date}</li>
                      <li className="month">{showDate?.month}</li>
                    </button>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="movie-theatres-details">
          <div className="container-fluid overflow-scroll">
            <ul className="theatres">
              {isShowTheatre ? (
                <>
                  {theatresList?.map(
                    (theatres: TheatresList, tIndx: number) => {
                      return (
                        <li key={tIndx} className="theatre-row">
                          {/* theatre name details */}
                          <div className="theatre-info">
                            <div className="theatre-details">
                              <div className="theatre-name-details">
                                <div className="theatre-name">
                                  {theatres?.theatreName}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* theatre show times list */}
                          <div className="theatre-show-times-list">
                            <div className="showtime-button-container">
                              {theatres?.shows?.map(
                                (shows: any, showId: any) => {
                                  return (
                                    <>
                                      <button
                                        key={showId}
                                        className={`btn btn-outline-success ${!isDisabled(shows?.showTime) ? 'shows-showtime-container' : 'shows-showtime-container-disabled'}`}
                                        // className={` ${isDisabled(shows?.showTime) ? 'shows-showtime-container-disabled' : 'shows-showtime-container'} `}
                                        disabled={isDisabled(shows?.showTime)}
                                        onClick={() => {
                                          handleNavigateToSeatLayout(
                                            theatres.theatreId,
                                            shows.showId,
                                            theatres.theatreName,
                                            shows.showTime
                                          );
                                        }}
                                      >
                                        <span className="shows-showtime">
                                          {timeFormatter(shows?.showTime)}
                                        </span>
                                      </button>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
                </>
              ) : (
                <li className="theatre-row">
                  <div className="theatre-info">
                    <div className="theatre-details">
                      <div className="theatre-name-details">
                        <div className="theatre-name">
                          {errorMsg || "No Theatre Details Found!!"}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

export default MovieBooking;
