import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
