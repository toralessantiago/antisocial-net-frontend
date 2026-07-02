import { LuCheck, LuX } from "react-icons/lu";
import type { ToastType } from "../hooks/useToast";

interface Props {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: Props) {
  return (
    <div className={`toast-custom toast-${type}`} role="alert">
      <span className="toast-icon">
        {type === "success" ? <LuCheck /> : <LuX />}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar">
        <LuX size={16} />
      </button>
    </div>
  );
}
