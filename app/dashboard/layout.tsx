import Sidebar from "@/components/sidebar";

export default function DashboardLayout({children}:{children:React.ReactNode}){

    return (
      <div className="flex h-125 bg-[#0a0a0a] text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    );
}