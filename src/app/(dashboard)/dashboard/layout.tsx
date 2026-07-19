"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { useState } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open,setOpen]=useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 relative">
      <div className={`${open ? '' : 'hidden'} sm:block sm:w-64 h-screen shrink-0 fixed z-10`}>
        <DashboardSidebar onMenuClick={()=>setOpen(!open)}/>
      </div>

      <div className="flex-1">
        <Topbar onMenuClick={()=>setOpen(!open)}/>
        {children}
      </div>
    </div>
  );
}