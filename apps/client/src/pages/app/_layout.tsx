import { Outlet } from "react-router-dom";

import AppSidebar from "./_components/Sidebar";

export default function _layout() {
  return (
    <AppSidebar>
      <Outlet />
    </AppSidebar>
  );
}
