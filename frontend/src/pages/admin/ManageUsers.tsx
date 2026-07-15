import { useEffect, useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { User } from "../../types";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data.data)).catch(() => setUsers([]));
  }, []);

  async function toggleStatus(user: User) {
    const status = user.status === "suspended" ? "active" : "suspended";
    await api.patch(`/admin/users/${user.id}/status`, { status });
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status } : item));
  }

  async function deleteUser(userId: number) {
    await api.delete(`/admin/users/${userId}`);
    setUsers((current) => current.filter((user) => user.id !== userId));
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Users</h1>
        <Button variant="secondary">Export CSV</Button>
      </div>
      <div className="mt-5 overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
            <tr><th className="p-3">User</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-3"><p className="font-medium">{user.name}</p><p className="text-slate-500">{user.email}</p></td>
                <td className="capitalize">{user.role}</td>
                <td><Badge>{user.status}</Badge></td>
                <td className="flex gap-2 py-3">
                  <Button variant="secondary" onClick={() => toggleStatus(user)}><ShieldCheck className="h-4 w-4" />Toggle</Button>
                  <Button variant="danger" onClick={() => deleteUser(user.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
