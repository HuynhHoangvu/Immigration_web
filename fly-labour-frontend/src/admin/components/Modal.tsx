import { X } from "lucide-react";
import clsx from "clsx";
import s from "./Modal.module.scss";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: s.sizeSm,
  md: s.sizeMd,
  lg: s.sizeLg,
  xl: s.sizeXl,
};

export default function Modal({
  title,
  onClose,
  children,
  size = "xl",
}: ModalProps) {
  return (
    <div className={s.overlay}>
      <div className={clsx("modal-overlay", s.backdrop)} onClick={onClose} />
      <div
        className={clsx(
          "modal-content",
          "custom-scrollbar",
          s.content,
          SIZE_MAP[size],
        )}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={16} />
          </button>
        </div>
        <div className={s.body}>{children}</div>
      </div>
    </div>
  );
}
