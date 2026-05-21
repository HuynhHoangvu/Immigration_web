import { useState } from "react";
import { useT } from "@core/hooks/useT";
import { contactApi } from "@core/services/api";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./ContactPage.module.scss";

export default function ContactPage() {
  const { t } = useT();
  const c = t("contact");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await contactApi.send(form);
      toast.success(
        c.success ||
          "Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.",
      );
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error(c.error || "Gửi thất bại, vui lòng thử lại");
    } finally {
      setSending(false);
    }
  };

  const fields = [
    {
      label: c.name,
      key: "name",
      type: "text",
      placeholder: c.namePlaceholder,
      required: true,
    },
    {
      label: c.email,
      key: "email",
      type: "email",
      placeholder: "email@example.com",
      required: true,
    },
    {
      label: c.phone,
      key: "phone",
      type: "tel",
      placeholder: c.phonePlaceholder,
      required: false,
    },
  ] as const;

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <h1 className={clsx("section-title", s.title)}>
          {c.title} <span className="gradient-text">{c.titleGradient}</span>
        </h1>
        <p className={s.subtitle}>{c.subtitle}</p>

        <div className={s.card}>
          <form onSubmit={handleSubmit} className={s.form}>
            {fields.map((f) => (
              <div key={f.key}>
                <label className={s.label}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((fm) => ({ ...fm, [f.key]: e.target.value }))
                  }
                  className={clsx(s.input, s.inputH12)}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              </div>
            ))}

            <div>
              <label className={s.label}>{c.message}</label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((fm) => ({ ...fm, message: e.target.value }))
                }
                className={clsx(s.input, s.textarea)}
                placeholder={c.messagePlaceholder}
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={clsx("btn-primary", s.submit)}
            >
              {sending ? (
                <>
                  <span className={s.spinner} />
                  {c.sending || "Đang gửi..."}
                </>
              ) : (
                c.send
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
