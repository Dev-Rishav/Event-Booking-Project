
import paypal from 'paypal-rest-sdk';

paypal.configure({
  mode: "sandbox",
  // client_id: "AfJNYV8fPGVUG2ly51jSLruzcmj-wMljfhHE1u-3dON1E83xJbwF0baFDRj1_c8OwOntRXFOgQq3dp88",
  // client_secret: "EFgA05rwrO9ITCKa4O_ABBX7jPgSFkT9lo4LEFyuwR4VfJNLlSEYERf5tj6C2tOX0vsD621zqEOEgyOi",
  client_id: "AaDD2atOGsm2xKfuk36t4BQl4BU55iOfPrSiczAev-xUrbx7QvdFxPDrNtVj7QFTrP4jIBcnBmfDpvl_",
  client_secret: "EHhFNYYx540WYUUN77HVtsdRqakj9vwVjjdfBxsz37_2Co3YuXt-SvdyP_pn1t2-BWyuC-TVKzKjSwWn",
});

export default paypal;
