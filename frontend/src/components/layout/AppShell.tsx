import { BriefcaseBusiness, Building2, LayoutDashboard, LogOut, LucideIcon, Moon, Search, Sun, UserRoundCog } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

export function AppShell() {
  const { user, logout, dark, toggleDark } = useAuth();
  const navigate = useNavigate();
  const links: Array<[string, string, LucideIcon]> = user?.role === "admin"
    ? [["/admin", "Dashboard", LayoutDashboard], ["/admin/users", "Users", UserRoundCog]]
    : user?.role === "recruiter"
      ? [["/recruiter", "Dashboard", LayoutDashboard], ["/recruiter/applications", "Pipeline", BriefcaseBusiness]]
      : [["/candidate", "Dashboard", LayoutDashboard], ["/jobs", "Find Jobs", Search], ["/candidate/applications", "Applications", Building2]];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">TalentFlow</p>
            <p className="text-xs text-slate-500">Job Portal Suite</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {links.map(([href, label, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-primary dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 lg:px-8">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="font-semibold">{user?.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={toggleDark} aria-label="Toggle theme">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
            <Button variant="secondary" onClick={() => { logout(); navigate("/login"); }}><LogOut className="h-4 w-4" />Logout</Button>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
