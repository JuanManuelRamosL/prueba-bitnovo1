"use client";
import React from "react";
import "./fail.css"; // Importa el archivo CSS

export default function Failed() {
  return (
    <div className="failed-container">
      <div className="container-image">
        <svg
          width="30%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="svg"
        >
          <path
            d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1>¡Pago cancelado!</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Laoreet blondit auctor et varius
        dolor elit facilis! enim. Nulla ut ut eu nunc.
      </p>
      <button onClick={() => (window.location.href = "/")}>
        Crear nuevo pago
      </button>
    </div>
  );
}
