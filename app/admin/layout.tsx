import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Si pas connecté, on laisse le contenu se rendre tel quel
  // (la page login gère son propre rendu sans sidebar)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <AdminSidebar user={session} />
      <div className="flex-1 p-8 bg-creme">{children}</div>
    </div>
  );
}
