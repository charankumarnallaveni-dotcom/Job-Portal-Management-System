import { FormEvent, useState } from "react";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setSent(true);
  }
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Reset password</h1>
        {sent ? <p className="mt-4 text-sm text-emerald-600">If the account exists, reset instructions were sent.</p> : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button className="w-full">Send reset email</Button>
          </form>
        )}
      </Card>
    </main>
  );
}
