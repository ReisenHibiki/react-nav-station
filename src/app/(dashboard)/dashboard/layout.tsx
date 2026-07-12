import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden sm:block sm:w-64 h-screen shrink-0">
        <DashboardSidebar />
      </div>

      <div className="flex-1">
        <Topbar/>
        {children}
      </div>
    </div>
  );
}