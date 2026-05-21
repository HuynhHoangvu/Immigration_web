import { Trash2 } from "lucide-react";
import clsx from "clsx";
import s from "./ConfirmDeleteModal.module.scss";

interface ConfirmDeleteModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  message = "Hành động này không thể hoàn tác.",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <div className={s.overlay}>
      <div
        className={clsx(s.backdrop, "modal-overlay")}
        onClick={onCancel}
      />
      <div
        className={clsx(
          "modal-content",
          "modal-error-content",
          s.dialog,
        )}
      >
        {/* Icon — styled, no emoji */}
        <div className="error-icon-container">
          <Trash2 size={24} />
        </div>
        <h3 className={clsx("modal-title", s.titleTight)}>Xác nhận xóa?</h3>
        <p className={clsx("modal-message", s.messageBlock)}>{message}</p>
        <div className={s.actions}>
          <button
            onClick={onConfirm}
            className={clsx("btn-danger", s.btnStretch)}
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className={clsx("btn-outline", s.btnStretch)}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
