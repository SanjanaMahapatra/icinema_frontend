import moment from "moment";
type Validations = {
  stripeCardNumberValidation(cardNumber : string): boolean;
  stripeCardExpiryValidation(value:string) : boolean;
  textWithSpacesOnly(value:string) : boolean;
  minLength(value:string) : boolean;
}


export const validations: Validations= {

  stripeCardNumberValidation: (cardNumber:string):boolean => {
    if (cardNumber.replace(/[^\d]/g, "").match(/^[1-6][0-9]{2,}$/)) {
      if (cardNumber) {
        return cardNumber &&
          /^[1-6]{1}[0-9]{15,16}$/i.test(
            cardNumber.replace(/[^\d]/g, "").trim()
          )
          ? false
          : true
      }
    }

    return true
  },


  stripeCardExpiryValidation: (value:string) => {
    if (value) {
      if (/^(0[1-9]|1[0-2])\/[0-9]{2}$/i.test(value.trim())) {
        let today = new Date();
        let CurrentDate = moment(
          new Date(
            today.getFullYear() +
              "-" +
              (today.getMonth() + 1) +
              "-" +
              new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
          )
        );
        let visaValue = value.split("/");
        let visaDate = new Date(parseInt("20"+visaValue[1]), parseInt(visaValue[0]), 0);
        return CurrentDate < moment(visaDate)
          ? false
          : true
      } else {
        return true;
      }
    }
    return true;
  },

  textWithSpacesOnly: (value:string) => {
    if (value) {
      if (/^[a-zA-Z ]*$/i.test(value)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  
  minLength : (value:string) => {
    return value && (value.length === 3) ? false : true;
  }
}
