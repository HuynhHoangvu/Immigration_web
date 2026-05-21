import React, { useState, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { studyApplicationsApi } from "@core/services/api";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCountry?: string;
  initialUniversity?: string;
  initialMajor?: string;
  initialStudyType?: string;
}

const BUDGET_OPTIONS = [
  "Dưới 100 triệu VND",
  "100 triệu - 200 triệu VND",
  "200 triệu - 500 triệu VND",
  "Trên 500 triệu VND",
];

const DEGREE_OPTIONS = [
  "Học nghề / Cao đẳng (Vocational/College)",
  "Đại học (Bachelor)",
  "Thạc sĩ / Tiến sĩ (Master/PhD)",
  "Trung học phổ thông (High School)",
  "Khác (Other)",
];

export default function StudyApplyModal({
  isOpen,
  onClose,
  initialCountry = "",
  initialUniversity = "",
  initialMajor = "",
  initialStudyType = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    targetCountry: "",
    university: "",
    major: "",
    degreeLevel: "Đại học (Bachelor)",
    budget: "100 triệu - 200 triệu VND",
    note: "",
  });

  useEffect(() => {
    if (isOpen) {
      let mappedDegree = "Đại học (Bachelor)";
      if (initialStudyType === "university") {
        mappedDegree = "Đại học (Bachelor)";
      } else if (initialStudyType === "college" || initialStudyType === "vocational") {
        mappedDegree = "Học nghề / Cao đẳng (Vocational/College)";
      }
      setForm((f) => ({
        ...f,
        targetCountry: initialCountry,
        university: initialUniversity,
        major: initialMajor,
        degreeLevel: mappedDegree,
      }));
    }
  }, [isOpen, initialCountry, initialUniversity, initialMajor, initialStudyType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!form.phone.trim()) return toast.error("Vui lòng nhập số điện thoại");
    if (!form.email.trim()) return toast.error("Vui lòng nhập email");

    setLoading(true);
    try {
      await studyApplicationsApi.create({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        targetCountry: form.targetCountry,
        university: form.university,
        major: form.major,
        degreeLevel: form.degreeLevel,
        budget: form.budget,
        note: form.note,
      });
      toast.success("Nộp đơn đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Nộp đơn thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Đăng ký Tư vấn Du học</h3>
            <p className="text-xs text-slate-500 mt-0.5">Vui lòng điền thông tin bên dưới để được hỗ trợ làm hồ sơ</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                placeholder="Ví dụ: 0987654321"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Quốc gia mong muốn
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm bg-slate-50"
                placeholder="Ví dụ: Úc, Đức, Canada..."
                value={form.targetCountry}
                onChange={(e) => setForm({ ...form, targetCountry: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Trường học (nếu có)
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm bg-slate-50"
                placeholder="Tên trường đại học/nghề"
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Ngành học quan tâm
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm bg-slate-50"
                placeholder="Ví dụ: Công nghệ thông tin, Điều dưỡng..."
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                Bậc học dự kiến
              </label>
              <select
                className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm bg-white cursor-pointer"
                value={form.degreeLevel}
                onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
              >
                {DEGREE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
              Ngân sách dự kiến (Học phí + Sinh hoạt phí / Năm)
            </label>
            <select
              className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm bg-white cursor-pointer"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1.5">
              Lời nhắn / Yêu cầu chi tiết
            </label>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-sm h-24 resize-none"
              placeholder="Nhập thêm câu hỏi, thắc mắc về học bổng, visa..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          {/* Button Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={16} /> Gửi yêu cầu đăng ký
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
