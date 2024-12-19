/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/ViewBookingDetails.css";
import { toast } from "react-toastify";
import axiosInstance from "../../../interceptor/AxiosInterceptor";
import { validations } from "../../../validators/Validators";
import Loader from "../../loader/Loader";

type CardDetails = {
  cardNumber: string;
  cardHolderName: string;
  cardExpiration: string;
  cvv: string;
};

type errors = {
  cardNumber: string;
  cardHolderName: string;
  cardExpiration: string;
  cvv: string;
};

type formValid = {
  cardNumber: boolean;
  cardHolderName: boolean;
  cardExpiration: boolean;
  cvv: boolean;
  btnActive: boolean;
};

const ViewBookingDetails = () => {
  const { bookingId } = useParams();
  const [_cardType, setCardType] = useState<any>("");
  const [priceDetails, setPriceDetails] = useState<any>([]);

  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardHolderName: "",
    cardExpiration: "",
    cvv: "",
  });

  const [formErrors, setFormErrors] = useState<errors>({
    cardNumber: "",
    cardHolderName: "",
    cardExpiration: "",
    cvv: "",
  });

  const [formValidity, setFormValidity] = useState<formValid>({
    cardNumber: false,
    cardHolderName: false,
    cardExpiration: false,
    cvv: false,
    btnActive: false,
  });

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [successMessage, setSuccessMessage] = useState<any>("");
  const [loader, setLoader] = useState<boolean>(false);

  const messages = {
    FIELD_REQUIRED: "This field is required",
    CARD_NUMBER_ERROR: "Enter a valid card number",
    CARD_HOLDER_NAME_ERROR: "Invalid Card Holder Name",
    CVV_ERROR: "Invalid CVV number",
    CARD_EXPIRATION_ERROR: "Invalid date format",
  };

  const fetchPriceDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/bookingms/price-details/${bookingId}`
      );
      setPriceDetails(response?.data);
    } catch (error) {
      console.log("Error while fetching price details : ", error);
    }
  };

  useEffect(() => {
    fetchPriceDetails();
  }, []);

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target;
    let exstCardData: any = { ...cardDetails };
    if (name === "cardNumber") {
      let sanitizedCardNumberValue = formatCreditCardNumber(value);
      exstCardData[name] = sanitizedCardNumberValue;
    } else if (name === "cardExpiration") {
      let sanitizedCardExpirationValue = formatCardExpirationDate(value);
      exstCardData[name] = sanitizedCardExpirationValue;
    } else {
      exstCardData[name] = value;
    }
    setCardDetails({ ...cardDetails, ...exstCardData });
    validateFields(name, value);
  };

  const validateFields = (fieldName: string, fieldValue: any) => {
    const newFormValidity = { ...formValidity };
    const newErrors = { ...formErrors };

    switch (fieldName) {
      case "cardNumber": {
        if (fieldValue === "") {
          newErrors.cardNumber = messages.FIELD_REQUIRED;
          newFormValidity.cardNumber = false;
        } else if (validations.stripeCardNumberValidation(fieldValue)) {
          newErrors.cardNumber = messages.CARD_NUMBER_ERROR;
          newFormValidity.cardNumber = false;
        } else {
          newErrors.cardNumber = "";
          newFormValidity.cardNumber = true;
        }
        break;
      }
      case "cardHolderName": {
        if (fieldValue === "") {
          newErrors.cardHolderName = messages.FIELD_REQUIRED;
          newFormValidity.cardHolderName = false;
        } else if (validations.textWithSpacesOnly(fieldValue)) {
          newErrors.cardHolderName = messages.CARD_HOLDER_NAME_ERROR;
          newFormValidity.cardHolderName = false;
        } else {
          newErrors.cardHolderName = "";
          newFormValidity.cardHolderName = true;
        }
        break;
      }
      case "cardExpiration": {
        if (fieldValue === "") {
          newErrors.cardExpiration = messages.FIELD_REQUIRED;
          newFormValidity.cardExpiration = false;
        } else if (validations.stripeCardExpiryValidation(fieldValue)) {
          newErrors.cardExpiration = messages.CARD_EXPIRATION_ERROR;
          newFormValidity.cardExpiration = false;
        } else {
          newErrors.cardExpiration = "";
          newFormValidity.cardExpiration = true;
        }
        break;
      }
      case "cvv": {
        if (fieldValue === "") {
          newErrors.cvv = messages.FIELD_REQUIRED;
          newFormValidity.cvv = false;
        } else if (validations.minLength(fieldValue)) {
          newErrors.cvv = messages.CVV_ERROR;
          newFormValidity.cvv = false;
        } else {
          newErrors.cvv = "";
          newFormValidity.cvv = true;
        }
        break;
      }
    }

    newFormValidity.btnActive =
      newFormValidity.cardNumber &&
      newFormValidity.cardHolderName &&
      newFormValidity.cardExpiration &&
      newFormValidity.cvv;
    setFormValidity({ ...newFormValidity });

    setFormErrors({ ...newErrors });
  };

  const formatCreditCardNumber = (value: string) => {
    const sanitizedValue = value?.replace(/\D/g, "");
    const formattedValue = sanitizedValue?.replace(/(\d{4})/g, "$1 ").trim();
    return formattedValue;
  };

  const formatCardExpirationDate = (value: string) => {
    const sanitizedValue = value?.replace(/D/g, "");
    const formattedValue = sanitizedValue
      .replace(/[^0-9]/g, "")
      .replace(/^([2-9])$/g, "0$1")
      .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
      .replace(/^0{1,}/g, "0")
      .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2");
    console.log("formattedValue date : => ", formattedValue);
    return formattedValue;
  };

  const handleChangeCardType = (cardType: string) => {
    setCardType(cardType);
  };

  useEffect(() => {
    if (isPaymentSuccess === true) {
      navigate(`/confirmed-booking`, { state: bookingId });
    }
    return () => {
      toast.dismiss();
    };
  }, [isPaymentSuccess, bookingId, navigate]);

  const handlePayment = async () => {
    const infoToastId = toast.info("Payment processing...");
    let paymentData = {
      bookingId: bookingId,
      cardNumber: cardDetails?.cardNumber?.split(" ")?.join(""),
      username: cardDetails?.cardHolderName,
      expiryDate: `${cardDetails?.cardExpiration?.substring(
        3
      )}/${cardDetails?.cardExpiration?.substring(0, 2)}`,
      cvv: cardDetails?.cvv,
      cardHolderName: cardDetails?.cardHolderName,
      price: priceDetails?.totalPrice,
    };

    try {
      setLoader(true);
      const response: any = await axiosInstance.post(
        `/paymentms/payment-process`,
        paymentData
      );
      setLoader(false);
      setIsPaymentSuccess(true);
      setSuccessMessage(response?.data);
      console.log(response?.data);
    } catch (error: any) {
      setLoader(false);
      toast.dismiss(infoToastId);
      setIsPaymentSuccess(false);
      console.log(error);
      setErrorMessage(error?.response?.data);
      toast.error(error?.response?.data);
    }
  };

  return (
    <>
      <div className="container-fluid payment-container">
        <div className="d-flex mt-2">
          {/* order summary details */}
          <div className="card w-25 bd-highlight shadow me-3 rounded">
            <div className="card-body">
              <div className="order-summary">
                <span className="circle-left"></span>
                <span className="circle-right"></span>
                <h5
                  className="card-title"
                  style={{ fontSize: "1em", color: "#c02c39" }}
                >
                  ORDER SUMMARY
                </h5>
                <ul className="summary-details px-1 py-2">
                  <li className="price-summary">
                    <div className="left-title">
                      <span className="ticket-category">
                        PRICE FOR BOOKED SEATS
                      </span>
                      <br />
                      <span className="screenInfo">SCREEN 1</span>
                    </div>
                    <div className="right-title">
                      <span className="price-amount">
                        Rs {priceDetails?.seatPrice}
                      </span>
                    </div>
                  </li>
                  <li className="price-summary">
                    <div className="left-title">
                      <span className="ticket-category">Convenience Fees</span>
                    </div>
                    <div className="right-title">
                      <span className="price-amount">
                        Rs {priceDetails?.convienienceFee}
                      </span>
                    </div>
                  </li>
                  <li className="price-summary">
                    <div className="left-title">
                      <span className="ticket-category">GST</span>
                    </div>
                    <div className="right-title">
                      <span className="price-amount">
                        Rs {priceDetails?.gst}
                      </span>
                    </div>
                  </li>
                  <hr />
                  <li className="price-summary">
                    <div className="left-title">
                      <span className="ticket-category">Sub Total</span>
                    </div>
                    <div className="right-title">
                      <span className="price-amount">
                        Rs {priceDetails?.totalPrice}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="total-amount-payable px-1 py-2 d-flex justify-content-between">
                <div className="left-title">
                  <span className="ticket-category px-2 py-1">
                    Amount Payable
                  </span>
                </div>
                <div className="right-title">
                  <span className="price-amount px-2 py-1">
                    Rs {priceDetails?.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* payment method details */}
          <div className="card w-75 bd-highlight shadow me-3 rounded">
            <div className="card-body">
              <div className="left-title-2">
                <ul className="summary-details">
                  <li className="payment-options">
                    <span
                      className="card-type"
                      onChange={() => {
                        handleChangeCardType("DEBIT");
                      }}
                    >
                      Debit / Credit Card
                    </span>
                  </li>
                  {/* <li className="payment-options">
                      <span
                        className="card-type"
                        onChange={() => {
                          handleChangeCardType("CREDIT");
                        }}
                      >
                        Credit Card
                      </span>
                    </li> */}
                </ul>
              </div>
              <div className="right-title-2">
                <div className="credit-card-body">
                  <div className="credit-card-body-1">
                    <h4 style={{ fontWeight: "bold", fontSize: "20px" }}>
                      Enter the card details
                    </h4>
                    <br />
                    {loader ? (
                      <Loader />
                    ) : (
                      <>
                        <div className="credit-card-child">
                          <div className="mt-0 card-no">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                              name="cardNumber"
                              id="cardNumber"
                              type="text"
                              className="card-no-1"
                              placeholder="Enter Your Card Number"
                              onChange={onChangeHandler}
                              value={cardDetails?.cardNumber}
                            />
                            {formErrors?.cardNumber && (
                              <span className="text-danger errors">
                                {formErrors.cardNumber}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 card-name">
                            <input
                              name="cardHolderName"
                              id="cardHolderName"
                              type="text"
                              className="card-no-1"
                              placeholder="Name on the card"
                              onChange={onChangeHandler}
                              value={cardDetails?.cardHolderName}
                            />
                            {formErrors?.cardHolderName && (
                              <span className="text-danger errors">
                                {formErrors.cardHolderName}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 bottom-section">
                            <div className="expiry">
                              <label htmlFor="cardExpiry">Expiry</label>
                              <span className="me-2 bottom-facts">
                                <input
                                  type="text"
                                  className="card-no-2"
                                  name="cardExpiration"
                                  id="cardExpiration"
                                  placeholder="MM/YY"
                                  onChange={onChangeHandler}
                                  value={cardDetails?.cardExpiration}
                                />
                                {formErrors?.cardExpiration && (
                                  <span className="text-danger errors">
                                    {formErrors.cardExpiration}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="cvv">
                              <label htmlFor="cardCvv">CVV</label>
                              <span className="bottom-facts">
                                <input
                                  type="password"
                                  className="card-no-2"
                                  name="cvv"
                                  id="cvv"
                                  placeholder="CVV"
                                  onChange={onChangeHandler}
                                  value={cardDetails?.cvv}
                                />
                                {formErrors?.cvv && (
                                  <span className="text-danger errors">
                                    {formErrors.cvv}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-danger px-5 py-2"
                          onClick={handlePayment}
                          disabled={!formValidity.btnActive}
                        >
                          MAKE PAYMENT
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBookingDetails;
