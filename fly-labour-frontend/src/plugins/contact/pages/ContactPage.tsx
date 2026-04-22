import { useState } from "react";
import { useT } from "@/core/hooks/useT";
import { contactApi } from "@/core/services/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { t } = useT();
  const c = t("contact");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await contactApi.send(form);
      toast.success(c.success || "Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error(c.error || "Gửi thất bại, vui lòng thử lại");
    } finally {
      setSending(false);
    }
  };

  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-100 dark:bg-[#1e1e1e] border border-transparent dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold focus:ring-1 focus:ring-amber-400 dark:focus:ring-brand-gold outline-none transition-all";

  const fields = [
    { label: c.name,  key: "name",  type: "text",  placeholder: c.namePlaceholder,  required: true },
    { label: c.email, key: "email", type: "email", placeholder: "email@example.com", required: true },
    { label: c.phone, key: "phone", type: "tel",   placeholder: c.phonePlaceholder,  required: false },
  ] as const;

  return (
    <div className="min-h-screen pt-28 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title text-slate-900 dark:text-white transition-colors mb-4">
          {c.title} <span className="gradient-text">{c.titleGradient}</span>
        </h1>
        <p className="text-slate-800 dark:text-gray-200 transition-colors mb-8">{c.subtitle}</p>

        <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none p-8 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm((fm) => ({ ...fm, [f.key]: e.target.value }))}
                  className={`${inputClasses} h-12`}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                {c.message}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((fm) => ({ ...fm, message: e.target.value }))}
                className={`${inputClasses} h-28 py-3 resize-none`}
                placeholder={c.messagePlaceholder}
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-medium mt-2"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
