"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderInfo } from "../utils/api";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeComponent({ orderId }) {
  const [order, setOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;
    getOrderInfo(orderId).then(setOrder);
  }, [orderId]);

  useEffect(() => {
    if (order) {
      if (order.status === "CO" || order.status === "AC") {
        router.push("/success"); // Redirigir si el pago es exitoso
      } else if (order.status === "EX" || order.status === "OC") {
        router.push("/failure"); // Redirigir si el pago caduca o falla
      }
    }
  }, [order, router]);

  return (
    <div>
      {order ? (
        <>
          <h2>Escanea el QR para pagar</h2>
          <QRCodeCanvas value={order.qrCode} size={256} />{" "}
          {/* ✅ Usa QRCodeCanvas */}
          <p>
            Monto: {order.amount} {order.currency}
          </p>
          <p>Estado: {order.status}</p>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}
