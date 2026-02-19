import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, LogOut, Menu, X } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <header className="flex items-center justify-between bg-neutral-900 px-4 py-3 text-white md:hidden">
        <h1 className="text-lg font-semibold tracking-tight">Elixir</h1>
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 text-neutral-200 hover:bg-neutral-800 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-neutral-900 text-white transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-semibold tracking-tight">Elixir</h1>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeDrawer}
            className="rounded-md p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 px-3">
          <NavLink
            to="/"
            onClick={closeDrawer}
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
        <div className="p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
