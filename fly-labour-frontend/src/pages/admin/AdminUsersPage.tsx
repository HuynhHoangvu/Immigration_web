import { useEffect, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  X,
  CheckCircle,
  Plus,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";
import type { User } from "@/types";
import { usersApi } from "@/services/api";

type EditForm = {
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
};
type AddForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

const EMPTY_EDIT: EditForm = {
  fullName: "",
  phone: "",
  role: "user",
  isActive: true,
};
const EMPTY_ADD: AddForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
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
      toast.error("Vui l�ng nh?p h? t�n");
      return;
    }
    setSaving(true);
    try {
      await usersApi.updateAdmin(editModal.id, editForm);
      toast.success("�� c?p nh?t t�i kho?n");
      setEditModal(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "C?p nh?t th?t b?i");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.remove(id);
      toast.success("�� x�a t�i kho?n");
      setDeleting(null);
      loadUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "X�a th?t b?i");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await usersApi.toggleActive(id);
      setUsers((us) =>
        us.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
      toast.success("�� c?p nh?t tr?ng th�i t�i kho?n");
    } catch {
      toast.error("C?p nh?t th?t b?i");
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Qu?n l� Kh�ch h�ng</h1>
          <p className="text-brand-muted text-sm">
            {users.length} t�i kho?n � {users.filter((u) => u.isActive).length}{" "}
            dang ho?t d?ng
          </p>
        </div>
      </div>

      <div className="card-dark p-4">
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 py-2 text-sm h-10"
            placeholder="T�m t�n, email..."
          />
        </div>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-dark/50">
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Ngu?i d�ng
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">
                  S? �T
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">
                  Vai tr�
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden lg:table-cell">
                  Ng�y dang k�
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Tr?ng th�i
                </th>
                <th className="text-right px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Thao t�c
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-brand-muted text-sm"
                  >
                    �ang t?i...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-brand-muted text-sm"
                  >
                    Kh�ng t�m th?y ngu?i d�ng
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold shrink-0"
                          style={{
                            background:
                              user.role === "admin"
                                ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                                : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {user.fullName}
                          </p>
                          <p className="text-brand-muted text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-900 text-sm">
                      {user.phone || "�"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.role === "admin" ? "text-brand-gold bg-brand-gold/10 border-brand-gold/20" : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10"}`}
                      >
                        {user.role === "admin" ? "?? Admin" : "?? User"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-brand-muted text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.isActive ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-red-400 bg-red-400/10 border-red-400/20"}`}
                      >
                        {user.isActive ? "Ho?t d?ng" : "�� kh�a"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => toggleActive(user.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${user.isActive ? "text-brand-muted hover:text-red-400 hover:bg-red-500/10" : "text-brand-muted hover:text-green-400 hover:bg-green-500/10"}`}
                          >
                            {user.isActive ? (
                              <Lock size={13} />
                            ) : (
                              <Unlock size={13} />
                            )}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleting(user.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={13} />
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

      {/* -- Edit Modal -- */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditModal(null)}
          />
          <div className="relative bg-brand-card border border-brand-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <h2 className="font-semibold text-white">
                ?? Ch?nh s?a t�i kho?n
              </h2>
              <button onClick={() => setEditModal(null)}>
                <X size={18} className="text-brand-muted hover:text-white" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-brand-dark rounded-xl">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 text-sm font-bold shrink-0"
                  style={{
                    background:
                      editModal.role === "admin"
                        ? "linear-gradient(135deg,#e4a808,#fdd52f)"
                        : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  }}
                >
                  {editModal.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {editModal.fullName}
                  </p>
                  <p className="text-brand-muted text-xs">{editModal.email}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  H? t�n *
                </label>
                <input
                  value={editForm.fullName}
                  onChange={setEF("fullName")}
                  className="input-dark"
                  placeholder="H? v� t�n"
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  S? di?n tho?i
                </label>
                <input
                  value={editForm.phone}
                  onChange={setEF("phone")}
                  className="input-dark"
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  Vai tr�
                </label>
                <select
                  value={editForm.role}
                  onChange={setEF("role")}
                  className="input-dark"
                >
                  <option value="user">?? User</option>
                  <option value="admin">?? Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-sm text-white">
                  T�i kho?n dang ho?t d?ng
                </span>
              </label>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  <CheckCircle size={15} />{" "}
                  {saving ? "�ang luu..." : "Luu thay d?i"}
                </button>
                <button
                  onClick={() => setEditModal(null)}
                  className="btn-outline px-6"
                >
                  H?y
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- Confirm Delete -- */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          />
          <div className="relative bg-brand-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">???</p>
            <h3 className="text-white font-semibold mb-2">
              X�c nh?n x�a t�i kho?n?
            </h3>
            <p className="text-brand-muted text-sm mb-5">
              T�i kho?n v� to�n b? d? li?u li�n quan s? b? x�a vinh vi?n.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleting)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
              >
                X�a
              </button>
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 btn-outline py-2.5 text-sm"
              >
                H?y
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
