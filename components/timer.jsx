import { useEffect, useState } from "react";

export default function CountdownTimer({ expiredTime }) {
  const calculateTimeLeft = () => {
    const expirationDate = new Date(expiredTime).getTime();
    const now = new Date().getTime();
    const difference = expirationDate - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.expired) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredTime, timeLeft]);

  return (
    <span>
      {timeLeft.expired
        ? "Expirado"
        : `${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
            .toString()
            .padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}`}
    </span>
  );
}
