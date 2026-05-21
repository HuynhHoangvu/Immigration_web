import { useEffect, useState } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Search,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  X,
  CheckCircle,
  User as UserIcon,
  ShieldCheck,
  Building2,
  Loader2,
} from "lucide-react";
import { formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import type { User } from "@core/types";
import { usersApi } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminUsersPage.module.scss";

type EditForm = {
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
};

const EMPTY_EDIT: EditForm = {
  fullName: "",
  phone: "",
  role: "user",
  isActive: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    usersApi
      .getAll({ search, limit: 100 })
      .then((r) => setUsers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const openEdit = (u: User) => {
    setEditForm({
      fullName: u.fullName,
      phone: u.phone || "",
      role: u.role,
      isActive: u.isActive,
    });
    setEditModal(u);
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    if (!editForm.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    setSaving(true);
    try {
      await usersApi.updateAdmin(editModal.id, editForm);
      toast.success("Đã cập nhật tài khoản");
      setEditModal(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.remove(id);
      toast.success("Đã xóa tài khoản");
      setDeleting(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await usersApi.toggleActive(id);
      setUsers((us) =>
        us.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
      toast.success("Đã cập nhật trạng thái tài khoản");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const setEF =
    (k: keyof EditForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm((f) => ({ ...f, [k]: e.target.value }));

  const roleChipClass = (role: string) => {
    if (role === "admin") return s.chipAdmin;
    if (role === "employer") return s.chipEmployer;
    return s.chipUser;
  };

  const avatarClass = (role: string) => {
    if (role === "admin") return s.avatarAdmin;
    if (role === "employer") return s.avatarEmployer;
    return s.avatarUser;
  };

  return (
    <div className={s.page}>
      <div className={s.headRow}>
        <div>
          <h1 className={s.title}>Quản lý Người dùng</h1>
          <p className={s.subtitle}>
            {users.length} tài khoản hệ thống ·{" "}
            <span className={s.subActive}>
              {users.filter((u) => u.isActive).length} đang hoạt động
            </span>
          </p>
        </div>
      </div>

      <div className={clsx(s.card, s.toolbar)}>
        <div className={s.searchWrap}>
          <Search size={16} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={s.searchInput}
            placeholder="Tìm theo tên, email người dùng..."
          />
        </div>
      </div>

      <div className={clsx(s.card, "overflow-hidden")}>
        <div className={clsx(s.tableWrap, "custom-scrollbar")}>
          <table className={s.table}>
            <thead>
              <tr className={clsx(s.theadRow, "fl-surface-muted-50")}>
                <th className={s.th}>Người dùng</th>
                <th className={clsx(s.th, s.thMd)}>Số điện thoại</th>
                <th className={clsx(s.th, s.thSm)}>Vai trò</th>
                <th className={clsx(s.th, s.thLg)}>Ngày tham gia</th>
                <th className={s.th}>Trạng thái</th>
                <th className={clsx(s.th, s.thRight)}>Thao tác</th>
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className={s.loadingCell}>
                      <Loader2 className={clsx(s.loader, s.spin)} />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={s.emptyCell}>
                    Không tìm thấy người dùng nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className={s.trHover}>
                    <td className={s.td}>
                      <div className={s.userRow}>
                        <div className={clsx(s.avatar, avatarClass(user.role))}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div className={s.userMain}>
                          <p className={s.userName}>{user.fullName}</p>
                          <p className={s.userMail}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={clsx(s.td, s.tdMd, s.phone)}>
                      {user.phone || "—"}
                    </td>
                    <td className={clsx(s.td, s.tdSm)}>
                      <span className={clsx(s.chip, roleChipClass(user.role))}>
                        {user.role === "admin" ? (
                          <ShieldCheck size={10} />
                        ) : user.role === "employer" ? (
                          <Building2 size={10} />
                        ) : (
                          <UserIcon size={10} />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className={clsx(s.td, s.tdLg, s.date)}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td className={s.td}>
                      <span
                        className={clsx(
                          s.chip,
                          user.isActive ? s.chipActive : s.chipLocked,
                        )}
                      >
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className={clsx(s.td, s.tdRight)}>
                      <div className={s.actions}>
                        <button
                          onClick={() => openEdit(user)}
                          title="Chỉnh sửa"
                          className={clsx(s.iconBtn, s.editBtn)}
                        >
                          <Pencil size={16} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => toggleActive(user.id)}
                            title={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
                            className={clsx(
                              s.iconBtn,
                              user.isActive ? s.lockBtn : s.unlockBtn,
                            )}
                          >
                            {user.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleting(user.id)}
                            title="Xóa vĩnh viễn"
                            className={clsx(s.iconBtn, s.deleteBtn)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal && (
        <div className={clsx(s.modalOverlay, "animate-in fade-in duration-200")}>
          <div className={s.modalCard}>
            <div className={s.modalHead}>
              <h2 className={s.modalTitle}>
                <Pencil size={18} className={s.iconAmber} />
                Chỉnh sửa tài khoản
              </h2>
              <button onClick={() => setEditModal(null)} className={s.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={s.modalBody}>
              <div className={s.profileCard}>
                <div className={clsx(s.avatarLg, avatarClass(editModal.role))}>
                  {editModal.fullName.charAt(0)}
                </div>
                <div className={s.profileMain}>
                  <p className={s.profileName}>{editModal.fullName}</p>
                  <p className={s.profileMail}>{editModal.email}</p>
                </div>
              </div>

              <div className={s.form}>
                <div className={s.field}>
                  <label className={s.label}>Họ và tên *</label>
                  <input
                    value={editForm.fullName}
                    onChange={setEF("fullName")}
                    className={s.input}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Số điện thoại</label>
                  <input
                    value={editForm.phone}
                    onChange={setEF("phone")}
                    className={s.input}
                    placeholder="09xx xxx xxx"
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Phân quyền vai trò</label>
                  <select
                    value={editForm.role}
                    onChange={setEF("role")}
                    className={clsx(s.input, "appearance-none font-bold")}
                  >
                    <option value="user" className="font-bold">
                      👤 User (Ứng viên)
                    </option>
                    <option value="employer" className="font-bold">
                      🏢 Employer (Nhà tuyển dụng)
                    </option>
                    <option value="admin" className="font-bold">
                      🛡️ Admin (Quản trị viên)
                    </option>
                  </select>
                </div>

                <div className={s.toggleWrap}>
                  <label className={s.toggleLabel}>
                    <div
                      className={clsx(
                        s.toggleTrack,
                        editForm.isActive ? s.toggleOn : s.toggleOff,
                      )}
                    >
                      <div
                        className={clsx(
                          s.toggleThumb,
                          editForm.isActive ? s.thumbOn : s.thumbOff,
                        )}
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          isActive: e.target.checked,
                        }))
                      }
                      className={s.hidden}
                    />
                    <span className={s.toggleText}>Trạng thái hoạt động</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={clsx(s.modalFoot, "fl-surface-muted-50")}>
              <button onClick={() => setEditModal(null)} className={s.cancelBtn}>
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className={clsx("btn-primary", s.saveBtn)}
              >
                {saving ? (
                  <Loader2 size={16} className={s.spin} />
                ) : (
                  <CheckCircle size={16} />
                )}
                Cập nhật tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn tài khoản người dùng và toàn bộ dữ liệu lịch sử liên quan. Bạn chắc chắn chứ?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
