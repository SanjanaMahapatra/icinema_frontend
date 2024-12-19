import React, { FC, useState } from "react";
import "../../styles/SeatMatrix.css";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../interceptor/AxiosInterceptor";

interface seatMatrixProps {
  count: number;
  bookedSeats: string[];
}

const SeatMatrix: FC<seatMatrixProps> = ({count, bookedSeats}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { movieId, theatreId, showId } = useParams<{ movieId: string; theatreId: string; showId: string }>();
  const navigate = useNavigate();
  const rows = "HGFEDCBA".split("");
  const columns = Array.from({ length: 20 }, (_, i) => i + 1);

  const toggleSeatSelection = (seat: string) => {
    setSelectedSeats((prevSelectedSeats: string[]) => {
      if (prevSelectedSeats?.includes(seat)) {
        return prevSelectedSeats.filter((s) => s !== seat);
      } else {
        const newSelectedSeats = [...prevSelectedSeats, seat];
        if (newSelectedSeats.length > count) {
          newSelectedSeats.shift(); 
        }
        return newSelectedSeats;
      }
    });
  };

  const handleBooking = async () => {
    try {
      const response = await axiosInstance.post("/bookingms/add-booking", {
        selectedSeats,
        movieId,
        theatreId,
        showId,
      });
      navigate(`/view-booking-details/${response.data}`);
    } catch (error) {
      console.error("Error booking seats:", error);
    }
  };

  return (
    <div className="card shadow mt-4" style={{ minWidth: "55em" }}>
      <div className="card-body overflow-scroll">
        <div className="layout">
          <div className="price-label pb-2 mb-2">Rs. 250 Gold</div>
          <div className="d-flex gold-row">
            <div className="d-flex my-1 align-items-center">
              <div className="row-label ps-1" style={{ marginRight: "5em" }}>
                {"I"}
              </div>
              {columns.map((column) => (
                <div
                  key={column}
                  className={`btn btn-outline-success seat ${
                    selectedSeats?.includes(`I${column}`) ? "selected" : ""
                  }${bookedSeats?.includes(`I${column}`) ? "disabled" : ""}`}
                  onClick={() => toggleSeatSelection(`I${column}`)}
                >
                  {column}
                </div>
              ))}
            </div>
          </div>
          <div className="price-label pb-2 mt-4">Rs. 150 Classic</div>
          <div className="seat-matrix my-2">
            {rows.map((row) => (
              <div key={row} className="d-flex my-1 align-items-center">
                <div className="row-label">{row}</div>
                {columns.map((column) => (
                  <div
                    key={column}
                    className={`btn btn-outline-success seat ${
                        selectedSeats?.includes(`${row}${column}`) ? "selected" : ""
                      }${bookedSeats?.includes(`${row}${column}`) ? "disabled" : ""}`}
                    onClick={() => toggleSeatSelection(`${row}${column}`)}
                    style={{ marginRight: column === 10 ? "3em" : "1em" }}
                  >
                    {column}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-center my-4">
          <img src="/assets/screen.svg" alt="Screen" />
        </div>
        {selectedSeats.length === count && <div className="d-flex justify-content-center book-btn">
          <button className="btn btn-primary" 
          style={{border: "none", backgroundColor: "rgb(242, 51, 84)", width: "40%"}}
          onClick={handleBooking}>Pay</button>
        </div>}
      </div>
    </div>
  );
};

export default SeatMatrix;
