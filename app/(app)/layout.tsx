import { Inter } from "next/font/google";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "App Page",
  description: "Page with Sidebar",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen flex`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        
        <main className="flex-1">
          {children}
        </main>

        <Toaster closeButton={true} duration={3000} position="bottom-right" />
      </SidebarProvider>
    </div>
  );
}
