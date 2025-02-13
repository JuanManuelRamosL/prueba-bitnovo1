"use client"; // Necesario en componentes que usan hooks

import { useRouter } from "next/router"; // Usa next/router en lugar de next/navigation
import { useEffect, useState } from "react";
import { getOrderInfo } from "../../utils/api"; // Asegúrate de que la ruta sea correcta
import { QRCodeCanvas } from "qrcode.react";
import { ethers } from "ethers";
import styles from "../../styles/QRPage.module.css"; // Importa el archivo CSS
import CountdownTimer from "@/components/timer";
import { ClipboardCopy, Copy, Stopwatch, Timer } from "lucide-react";

export default function QRPage() {
  const router = useRouter(); // Obtén el router de Next.js
  const { id } = router.query; // Accede al parámetro dinámico 'id' desde router.query
  const [order, setOrder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qr"); // Estado para controlar la opción de pago

  // Obtener la información de la orden
  useEffect(() => {
    if (!id) return;
    getOrderInfo(id).then((data) => {
      if (data && data.length > 0) {
        console.log(data);
        setOrder(data[0]); // Extrae el primer elemento del array
        // Crear WebSocket al obtener la orden
        const socketConnection = new WebSocket(
          `wss://payments.pre-bnvo.com/ws/${data[0].identifier}`
        );
        setSocket(socketConnection);
      }
    });
  }, [id]);

  // Escuchar los mensajes del WebSocket
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message && message.status) {
          setOrder((prevOrder) => ({
            ...prevOrder,
            status: message.status,
          }));
        }
      };

      // Limpiar el socket al desmontar el componente
      return () => {
        socket.close();
      };
    }
  }, [socket]);

  // Redirigir según el estado de la orden
  useEffect(() => {
    if (order) {
      if (order.status === "CO" || order.status === "AC") {
        router.push("/success");
      } else if (order.status === "EX" || order.status === "OC") {
        router.push("/failure");
      }
    }
  }, [order, router]);

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    console.log("MetaMask está instalado");
  } else {
    console.log("MetaMask no está instalado");
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask no está instalado.");
        throw new Error("MetaMask no está instalado.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // Asegúrate de que ethers está importado correctamente.
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      console.log("Cuenta conectada:", accounts[0]);
      return { provider, signer, account: accounts[0] };
    } catch (error) {
      console.error("Error al conectar MetaMask:", error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Texto copiado"))
      .catch((err) => console.error("Error al copiar: ", err));
  };

  const sendPayment = async () => {
    try {
      const { provider, signer } = await connectWallet();

      if (!provider || !signer) {
        throw new Error("No se pudo obtener el proveedor o el signer.");
      }

      const tx = await signer.sendTransaction({
        to: "0x1234567890abcdef1234567890abcdef12345678", // Dirección de destino
        value: ethers.parseEther("0.01"), // Monto en ETH
      });

      console.log("Transacción enviada:", tx);
    } catch (error) {
      console.error("Error al enviar pago:", error.message);

      if (error.code === -32000 || error.code === "INSUFFICIENT_FUNDS") {
        console.warn("Fondos insuficientes. Redirigiendo...");
        router.push("/failure"); // Redirige a la pantalla de fallo
      }
    }
  };

  if (!order) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  return (
    <div className={styles.containerGeneral}>
      <div className={styles.containerResumen}>
        <div className={styles.containerTitleResumenPedido}>
          <h2 className={styles.title}>Resumen del pedido</h2>
        </div>
        <div className={styles.containerInfoResumen}>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Importe: </span>
            <span className={styles.spanText}>
              <b>
                {order.fiat_amount} {order.fiat}
              </b>
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Moneda Seleccionada: </span>
            <span className={styles.spanText}>
              <b>{order.currency_id}</b>
            </span>
          </div>
          <div className={styles.summaryItemEspecial}>
            <span className={styles.spanText}>Comercio: </span>
            <span className={styles.spanText}>
              <b>{order.merchant_device || "Comercio no especificado"}</b>
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Fecha: </span>
            <span className={styles.spanText}>
              <b>
                {new Date(order.created_at).toLocaleDateString()}{" "}
                {new Date(order.created_at).toLocaleTimeString()}
              </b>
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.spanText}>Concepto: </span>
            <span className={styles.spanText}>
              <b>{order.notes || "Sin concepto"}</b>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.containerRealizarPago}>
        <div className={styles.containerTitleResumenPago}>
          <h2 className={styles.title}>Realiza el Pago</h2>
        </div>
        <div className={styles.containerInfoPago}>
          <div className={styles.cryptoInfo}>
            <span>
              <Timer size={24} strokeWidth={2} className={styles.reloj} />
              {"      "}
              <CountdownTimer expiredTime={order.expired_time} />
            </span>
          </div>
          <div className={styles.paymentOptions}>
            <button
              className={`${styles.option} ${
                paymentMethod === "qr" ? styles.active : ""
              }`}
              onClick={() => setPaymentMethod("qr")}
            >
              SmarLQR
            </button>
            <button
              className={`${styles.option} ${
                paymentMethod === "web3" ? styles.active : ""
              }`}
              onClick={() => setPaymentMethod("web3")}
            >
              Web3
            </button>
          </div>

          {paymentMethod === "qr" && (
            <div className={styles.qrContainer}>
              <QRCodeCanvas
                value={`bitcoin:${order.address}?amount=${order.crypto_amount}`}
                size={120}
                className={styles.qrCode}
              />
              {/* <p>Escanea el QR para realizar el pago.</p> */}
            </div>
          )}

          {paymentMethod === "web3" && (
            <div className={styles.web3Container}>
              <button onClick={sendPayment} className={styles.web3Button}>
                <img
                  src="https://www.carlosmaiz.com/wp-content/uploads/2024/11/MetaMask.png"
                  alt="MetaMask"
                  className={styles.metaMaskIcon}
                />{" "}
              </button>
            </div>
          )}

          <div className={styles.cryptoInfo}>
            <span>
              Envío:{" "}
              <b>
                {order.crypto_amount} {order.currency_id}
              </b>
              <Copy
                className={styles.copyIcon}
                size={18}
                onClick={() =>
                  copyToClipboard(`${order.crypto_amount} ${order.currency_id}`)
                }
              />
            </span>
            <span>
              {order.address}
              <Copy
                className={styles.copyIcon}
                size={18}
                onClick={() => copyToClipboard(order.address)}
              />
            </span>
            {order.tag_memo && (
              <span>
                Tag/Memo: {order.tag_memo}
                <Copy
                  className={styles.copyIcon}
                  size={18}
                  onClick={() => copyToClipboard(order.tag_memo)}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
