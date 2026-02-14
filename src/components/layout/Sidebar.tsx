import { NavLink } from "react-router-dom";
import { Home, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="flex w-56 flex-col bg-neutral-900 text-white">
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-tight">Elixir</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-black text-white"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
            }`
          }
        >
          <Home className="h-5 w-5 shrink-0" />
          Início
        </NavLink>
      </nav>
      <div className="border-t border-neutral-800 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
