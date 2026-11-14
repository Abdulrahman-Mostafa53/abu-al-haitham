import { useState } from "react";
import { Outlet } from "react-router-dom";
import { StudentProvider } from "../../features/student/StudentProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { PortalOutletContext } from "./portalContext";

export default function PortalLayout() {
  const [query, setQuery] = useState("");
  const ctx: PortalOutletContext = { query };

  return (
    <StudentProvider>
      <div className="grid min-h-screen split:grid-cols-[262px_1fr]">
        <Sidebar />
        <main className="min-w-0 px-4 pb-8 split:px-[34px] split:pb-11">
          <Topbar query={query} onQuery={setQuery} />
          <Outlet context={ctx} />
        </main>
      </div>
    </StudentProvider>
  );
}
