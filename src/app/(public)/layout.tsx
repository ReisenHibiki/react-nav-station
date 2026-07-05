import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen flex bg-slate-50">
      <div className="hidden sm:block sm:w-64 h-screen">
        <Navbar />
      </div>

      <div className="flex-1">
        {children}
        <Footer />
      </div>
    </div>
  );
}