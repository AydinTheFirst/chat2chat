import { Outlet } from "react-router-dom";

import { Providers } from "@/providers";

export default function Layout() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
