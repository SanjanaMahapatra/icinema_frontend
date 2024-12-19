import React, { useState, useEffect } from "react";
import {
  AVAILABLE_SEAT_OPTIONS,
  SEAT_IMAGE_URL,
} from "../../constants/Constants";
import "../../styles/Seats.css";
import SeatMatrix from "./SeatMatrix";
import axiosInstance from "../../interceptor/AxiosInterceptor";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";


interface BookedData {
  bookedSeats: string[];
  bookedGoldCnt: number;
  bookedClassicCnt: number;
}

const Seats = () => {
  const { selectedSeatsCount, setSelectedSeatsCount } = useAuth();
  const {theatreId, showId} = useParams();
  const [bookedData, setBookedData] = useState<BookedData>({bookedSeats: [], bookedGoldCnt: 0, bookedClassicCnt: 0});
  const {btnref, setSelectedShowDetails} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //modal open on component load
    if(!location?.state){
      navigate("/movies")
    }
    else if(btnref.current){
      btnref.current.click();
      setSelectedShowDetails(location.state);
    }
    fetchSeatsData();
    console.log("location state", location.state);
  }, []);

  // Fetch seats data from the server
  const fetchSeatsData = async () => {
    try{
      const seatResponse = await axiosInstance.get(`/seatingms/booked-seats/${theatreId}/${showId}`);
      setBookedData(seatResponse.data);
    }
    catch(error){
      console.log(error);
    }
  };

  return (
    <>
      <button
        ref={btnref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      ></button>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{height: "100vh"}}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title" id="staticBackdropLabel">
                How Many Seats?
              </div>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={`/assets/${SEAT_IMAGE_URL[selectedSeatsCount - 1]}`}
                  alt={`Seat ${selectedSeatsCount}`}
                  style={{ height: "10em" }}
                />
              </div>
              <div className="d-flex justify-content-center">
                {AVAILABLE_SEAT_OPTIONS.map((number) => (
                  <div
                    className="mx-3 p-1 seat-num"
                    key={number}
                    onClick={() => setSelectedSeatsCount(number)}
                    style={{
                      backgroundColor:
                      selectedSeatsCount === number ? "#f23354" : "white",
                      color: selectedSeatsCount === number ? "#fafafa" : "black",
                    }}
                  >
                    <span key={number} className="mx-2">
                      {number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer mx-4" style={{justifyContent: "center"}}>
                <div className="seat-info m-3">
                  <div className="seat-type">GOLD</div>
                  <div className="seat-price p-2">Rs. 250</div>
                  {bookedData.bookedGoldCnt < 10 ? (
                    <div className="seat-status available">Available</div>
                  ) : (
                    <div className="seat-status filling-fast">Filling Fast</div>
                  )}
                </div>
                <div className="seat-info m-3">
                  <div className="seat-type">CLASSIC</div>
                  <div className="seat-price p-2">Rs. 150</div>
                  {bookedData.bookedClassicCnt < 100 ? (
                    <div className="seat-status available">Available</div>
                  ) : (
                    <div className="seat-status filling-fast">Filling Fast</div>
                  )}
                </div>
              <div className="w-100">
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  style={{ backgroundColor: "#f23354" }}
                  data-bs-dismiss="modal"
                >
                  Select Seats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SeatMatrix count={selectedSeatsCount} bookedSeats={bookedData.bookedSeats} />
    </>
  );
};

export default Seats;
