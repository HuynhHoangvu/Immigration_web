import { useState, useEffect } from 'react'
import { Save, Building2, Globe, Phone, Mail, User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { usersApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function EmployerProfilePage() {
  const { user, setUser } = useAuthStore()

  const [info, setInfo] = useState({
    fullName:           user?.fullName || '',
    phone:              user?.phone || '',
    companyName:        user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    website:            user?.website || '',
  })
  const [savingInfo, setSavingInfo] = useState(false)

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPw, setSavingPw] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (user) {
      setInfo({
        fullName:           user.fullName || '',
        phone:              user.phone || '',
        companyName:        user.companyName || '',
        companyDescription: user.companyDescription || '',
        website:            user.website || '',
      })
    }
  }, [user])

  const handleSaveInfo = async () => {
    if (!info.fullName.trim() || !info.companyName.trim()) {
      toast.error('Vui lòng điền họ tên và tên công ty'); return
    }
    setSavingInfo(true)
    try {
      const res = await usersApi.updateMe(info)
      setUser(res.data)
      toast.success('Đã lưu thông tin công ty')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lưu thất bại')
    } finally {
      setSavingInfo(false)
    }
  }

  const handleChangePw = async () => {
    if (!pw.currentPassword || !pw.newPassword || !pw.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu'); return
    }
    if (pw.newPassword.length < 8) {
      toast.error('Mật khẩu mới tối thiểu 8 ký tự'); return
    }
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp'); return
    }
    setSavingPw(true)
    try {
      await usersApi.changePassword(pw)
      toast.success('Đổi mật khẩu thành công')
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setSavingPw(false)
    }
  }

  const fi = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInfo(prev => ({ ...prev, [k]: e.target.value }))
  const fp = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white">Hồ sơ Doanh nghiệp</h1>
        <p className="text-brand-muted text-sm mt-1">Cập nhật thông tin công ty để thu hút ứng viên chất lượng hơn.</p>
      </div>

      {/* Company info card */}
      <div className="card-dark p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={17} className="text-brand-gold" />
          <h2 className="font-semibold text-white">Thông tin công ty</h2>
        </div>

        {/* Avatar placeholder — company initial */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl shrink-0"
            style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}
          >
            {(info.companyName || info.fullName || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{info.companyName || '—'}</p>
            <p className="text-brand-muted text-xs flex items-center gap-1 mt-0.5">
              <Mail size={11} /> {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-brand-muted mb-1.5 flex items-center gap-1.5 block">
              <User size={11} /> Người đại diện *
            </label>
            <input value={info.fullName} onChange={fi('fullName')} className="input-dark" placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1.5 flex items-center gap-1.5 block">
              <Phone size={11} /> Số điện thoại
            </label>
            <input value={info.phone} onChange={fi('phone')} className="input-dark" placeholder="0901 234 567" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-brand-muted mb-1.5 flex items-center gap-1.5 block">
              <Building2 size={11} /> Tên công ty *
            </label>
            <input value={info.companyName} onChange={fi('companyName')} className="input-dark" placeholder="Công ty TNHH ABC" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-brand-muted mb-1.5 flex items-center gap-1.5 block">
              <Globe size={11} /> Website
            </label>
            <input value={info.website} onChange={fi('website')} className="input-dark" placeholder="https://congty.com.vn" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-brand-muted mb-1.5 block">Giới thiệu công ty</label>
            <textarea
              value={info.companyDescription}
              onChange={fi('companyDescription')}
              rows={4}
              className="input-dark resize-none"
              placeholder="Mô tả ngắn về công ty, lĩnh vực hoạt động, văn hóa làm việc... Thông tin này giúp ứng viên hiểu rõ hơn về doanh nghiệp của bạn."
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSaveInfo}
            disabled={savingInfo}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            {savingInfo
              ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Đang lưu...</>
              : <><Save size={15} /> Lưu thông tin</>
            }
          </button>
        </div>
      </div>

      {/* Account info (read-only) */}
      <div className="card-dark p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={17} className="text-green-400" />
          <h2 className="font-semibold text-white">Thông tin tài khoản</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-brand-border">
            <span className="text-brand-muted">Email đăng nhập</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-brand-border">
            <span className="text-brand-muted">Loại tài khoản</span>
            <span className="text-brand-gold font-medium">Nhà tuyển dụng</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-brand-muted">Trạng thái</span>
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="card-dark p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={17} className="text-brand-gold" />
          <h2 className="font-semibold text-white">Đổi mật khẩu</h2>
        </div>

        {[
          { key: 'currentPassword', label: 'Mật khẩu hiện tại' },
          { key: 'newPassword',     label: 'Mật khẩu mới (tối thiểu 8 ký tự)' },
          { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs text-brand-muted mb-1.5 block">{f.label}</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pw[f.key as keyof typeof pw]}
                onChange={fp(f.key)}
                className="input-dark pr-10"
                placeholder="••••••••"
              />
              {f.key === 'currentPassword' && (
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleChangePw}
            disabled={savingPw}
            className="btn-outline flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            {savingPw
              ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Đang đổi...</>
              : <><Lock size={15} /> Đổi mật khẩu</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
