"use client";
import { useState, useEffect } from "react";
import { getCurrencies } from "../utils/api";
import { ChevronDown, ChevronRight } from "lucide-react";
//import "./CryptoSelector.css"; // Importamos los estilos

export default function CryptoSelector({ onSelect, amount }) {
  const [currencies, setCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  // Filtra las criptomonedas basadas en el importe y la búsqueda
  const filteredCurrencies = currencies.filter((cur) => {
    const isWithinRange =
      parseFloat(amount) >= parseFloat(cur.min_amount) &&
      parseFloat(amount) <= parseFloat(cur.max_amount);
    const matchesSearch = cur.name.toLowerCase().includes(search.toLowerCase());
    return isWithinRange && matchesSearch;
  });

  return (
    <div className="crypto-selector">
      <div className="selector-box" onClick={() => setOpen(!open)}>
        {selected ? (
          <div className="selected">
            <img src={selected.image} alt={selected.name} />
            <span>
              {selected.name} ({selected.symbol})
            </span>
          </div>
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              width: "100%",
            }}
          >
            Seleccionar criptomoneda <ChevronDown size={16} />
          </span>
        )}
      </div>

      {open && (
        <div className="dropdown">
          <input
            type="text"
            placeholder=" Buscar..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="crypto-list">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((cur) => (
                <li
                  key={cur.symbol}
                  className={`crypto-item ${
                    selected?.symbol === cur.symbol ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelected(cur);
                    onSelect(cur.symbol);
                    setOpen(false);
                  }}
                >
                  <img src={cur.image} alt={cur.name} className="crypto-icon" />
                  <div className="crypto-info">
                    <span className="crypto-name">{cur.name}</span>
                    <span className="crypto-symbol">{cur.symbol}</span>
                  </div>
                  {selected?.symbol === cur.symbol && (
                    <span className="check-icon">✔</span>
                  )}
                  {selected?.symbol != cur.symbol && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        width: "100%",
                      }}
                    >
                      Seleccionar criptomoneda <ChevronRight size={16} />
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="crypto-item no-results">
                No hay criptomonedas disponibles para este importe.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
