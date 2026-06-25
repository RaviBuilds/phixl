import Sidebar from "@/components/sidebar";

export default function DashboardLayout({children}:{children:React.ReactNode}){

    return (
      <div className="flex flex-col md:flex-row min-h-screen text-neutral-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    );
}