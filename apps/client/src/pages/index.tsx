import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) return;

  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  if (isLoggedIn) {
    navigate("/app");
    return;
  }

  return <div>index</div>;
}
