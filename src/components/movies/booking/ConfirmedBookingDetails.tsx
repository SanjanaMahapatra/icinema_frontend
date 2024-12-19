import React, { useEffect, useState } from "react";
import "../../../styles/ConfirmedBooking.css";
import { useLocation } from "react-router-dom";
import {toast} from 'react-toastify';
import axiosInstance from "../../../interceptor/AxiosInterceptor";
import Loader from "../../loader/Loader";

const ConfirmedBookingDetails = () => {
  const location = useLocation();
  const [receiptDetails, setReceiptDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFinalPriceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/bookingms/all-booking-details/${location?.state}`
      );
      setReceiptDetails(response?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error in fetching the final price details : ", error);
      toast.error("Error fetching final price details!")
    }
  };

  useEffect(() => {
    fetchFinalPriceDetails();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container-fluid confirmed-booking-container pt-5">
          <div className="card w-25 bd-highlight shadow mb-5 rounded confirmed-booking">
            <div className="card-body">
              <div className="d-flex details-summary">
                <span className="circle-left-confirmed-booking"></span>
                <span className="circle-right-confirmed-booking"></span>
                <h5
                  className="card-title"
                  style={{ fontSize: "1em", color: "#c02c39", height: "100%" }}
                >
                  <img
                    src={`/assets/${receiptDetails?.imageUrl}`}
                    className="confirmed-booking-movie-img mt-3 me-2 img-fluid"
                    alt={receiptDetails?.movieName}
                  />
                </h5>
                <ul className="summary-details px-1 py-2">
                  <li className="confirmed-movie-summary">
                    <div className="left-title">
                      <span className="confirmed-movie-name">
                        {receiptDetails?.movieName}
                        <span className="confirmed-movie-genre-language">
                          {" "}
                          (Hindi) (A)
                        </span>
                      </span>
                      <br />
                      <br />
                      <span className="confirmed-movie-details">Hindi</span>
                      <br />
                      <span className="confirmed-movie-details">
                        {receiptDetails?.showDate} | {receiptDetails?.showTime}{" "}
                        09:30AM
                      </span>
                      <br />
                      <span className="confirmed-movie-details">
                        {receiptDetails?.theatreName}
                      </span>
                    </div>
                  </li>
                  <li className="confirmed-top-btn px-2 py-1">
                    Like, Share & Subscribe
                  </li>
                  <li className="confirmed-booking-details">
                    <div className="left-title">
                      <span className="ticket-category">
                        {receiptDetails?.selectedSeats?.length} Ticket(s)
                      </span>
                      <br />
                      <span className="price-amount">
                        SELECTED SEATS :{" "}
                        {receiptDetails?.selectedSeats?.join(",")}
                      </span>
                      <br />
                      <span className="price-amount">
                        BOOKING ID : W377PYM{receiptDetails?.bookingId}
                      </span>
                    </div>
                  </li>
                  <li className="confirmed-top-btn px-2 py-1">
                    Cancellation not available for this venue
                  </li>
                </ul>
              </div>
              <div className="total-amount-payable px-1 py-2 d-flex justify-content-between">
                <div className="left-title">
                  <span className="ticket-category px-2 py-1">
                    Total Amount
                  </span>
                </div>
                <div className="right-title">
                  <span className="price-amount px-2 py-1">
                    Rs {receiptDetails?.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmedBookingDetails;
