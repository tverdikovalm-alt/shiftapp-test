import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import MobileNav from "./MobileNav";

export default function Layout() {
  const [currentMode, setCurrentMode] = useState("focus");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentMode={currentMode} onModeChange={setCurrentMode} />
      <main className="flex-1 overflow-y-auto">
        <MobileNav currentMode={currentMode} onModeChange={setCurrentMode} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet context={{ currentMode, setCurrentMode }} />
        </div>
      </main>
    </div>
  );
}
