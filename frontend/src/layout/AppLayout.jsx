import { Outlet } from "react-router-dom";
import BottomNav from "../components/navigation/BottomNav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="flex-1 w-full pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

export default AppLayout;