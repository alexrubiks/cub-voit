import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <div className="flex-1 w-full px-3 sm:px-4 lg:px-6">
        <Outlet />
      </div>

      <BottomNav />

    </div>
  );
}

export default AppLayout;