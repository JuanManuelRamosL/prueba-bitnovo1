"use client";

import { useState } from "react";
import { createOrder } from "../utils/api";
import { useRouter } from "next/navigation";
import CryptoSelector from "./criptoSelector";
import "./payment.css";

export default function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [currency, setCurrency] = useState("");
  const router = useRouter();

  const isFormValid = amount && concept && currency;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await createOrder(amount, concept, currency);
      router.push(`/qr/${order.identifier}`);
    } catch (error) {
      console.error(
        "Error creando el pago:",
        error.response?.data || error.message
      );
      alert("Hubo un error al crear el pago. Revisa la consola.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h1>Crear Pago</h1>
      <div className="form-group">
        <label>Importe a pagar</label>
        <input
          type="number"
          placeholder="  Añade importe a pagar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Seleccionar moneda</label>
        <CryptoSelector
          onSelect={setCurrency}
          amount={amount}
          className="crypto-selector"
        />
      </div>
      <div className="form-group">
        <label>Concepto</label>
        <input
          type="text"
          placeholder="  Añade descripción del pago"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={!isFormValid} className="submit-button">
        Continuar
      </button>
    </form>
  );
}
