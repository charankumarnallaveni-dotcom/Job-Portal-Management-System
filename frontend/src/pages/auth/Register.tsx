import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";
import { Role } from "../../types";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("candidate");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await register({ ...form, role });
    navigate(role === "admin" ? "/admin" : role === "recruiter" ? "/recruiter" : "/candidate");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl font-bold">Create TalentFlow account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="h-10 w-full rounded-md border border-slate-200 px-3 dark:border-slate-700 dark:bg-slate-950" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="candidate">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <Button className="w-full">Register</Button>
        </form>
      </Card>
    </main>
  );
}
