import axios from "axios";

const API_URL = "https://payments.pre-bnvo.com/api/v1";
const DEVICE_ID = "ec1504d3-33c8-40cc-94e7-c52c90e345ef"; // Reemplaza con tu ID

export const getCurrencies = async () => {
  const response = await axios.get(`${API_URL}/currencies`, {
    headers: { "X-Device-Id": DEVICE_ID },
  });
  return response.data;
};

export const createOrder = async (amount, concept, currency) => {
  console.log("Enviando datos:", amount, concept, currency);

  const payload = {
    expected_output_amount: parseFloat(amount), // Monto en fiat
    input_currency: currency, // Criptomoneda seleccionada
    merchant_urlko: "https://tu-sitio.com/pago-fallido",
    merchant_urlok: "https://tu-sitio.com/pago-exitoso",
    merchant_url_standby: "https://tu-sitio.com/espera",
    notes: concept, // Concepto del pago
    fiat: "EUR",
    language: "ES",
  };

  const response = await axios.post(`${API_URL}/orders/`, payload, {
    headers: { "X-Device-Id": DEVICE_ID },
  });

  return response.data;
};

export const getOrderInfo = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/info/${orderId}`, {
    headers: { "X-Device-Id": DEVICE_ID },
  });
  return response.data;
};
