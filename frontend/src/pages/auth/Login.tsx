import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@talentflow.dev");
  const [password, setPassword] = useState("Password123!");
  const demoAccounts = [
    ["Admin", "admin@talentflow.dev"],
    ["Recruiter", "recruiter@talentflow.dev"],
    ["Candidate", "candidate@talentflow.dev"]
  ];

  async function submit(event: FormEvent) {
    event.preventDefault();
    await login(email, password);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    navigate(user.role === "admin" ? "/admin" : user.role === "recruiter" ? "/recruiter" : "/candidate");
  }

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.1fr_.9fr]">
      <section className="flex flex-col justify-between bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-8">
        <div className="flex items-center gap-3 font-bold"><BriefcaseBusiness />TalentFlow</div>
        <div className="max-w-2xl pb-10">
          <h1 className="text-5xl font-bold tracking-normal">TalentFlow</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">A production-style hiring operating system for admins, recruiters, and job seekers.</p>
        </div>
      </section>
      <section className="grid place-items-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Use seeded credentials or your own account.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {demoAccounts.map(([label, account]) => (
              <button key={account} type="button" onClick={() => setEmail(account)} className="rounded-md border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-300">
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <Link className="text-primary" to="/register">Create account</Link>
            <Link className="text-primary" to="/forgot-password">Forgot password?</Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
