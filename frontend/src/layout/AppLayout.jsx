import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <div className="flex-1 w-full pb-16">
        <Outlet />
      </div>

      <BottomNav />

    </div>
  );
}

export default AppLayout;