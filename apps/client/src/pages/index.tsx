import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return <div>index</div>;
}
