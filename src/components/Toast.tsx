import { useEffect } from "react";
import { LuCircleCheck, LuCircleX, LuInfo, LuX } from "react-icons/lu";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const iconByType = {
  success: <LuCircleCheck size={20} />,
  error: <LuCircleX size={20} />,
  info: <LuInfo size={20} />,
};

const bgByType = {
  success: "bg-success",
  error: "bg-danger",
  info: "bg-primary",
};

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`toast align-items-center text-white ${bgByType[type]} border-0 show position-fixed`}
      style={{ bottom: 20, right: 20, zIndex: 9999, minWidth: 280 }}
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body d-flex align-items-center gap-2">
          {iconByType[type]}
          {message}
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <LuX size={16} />
        </button>
      </div>
    </div>
  );
}