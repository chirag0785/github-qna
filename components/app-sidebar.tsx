"use client";

import {
  LayoutDashboardIcon,
  MessageCircleQuestion,
  Presentation,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "QnA",
    url: "/ask-question",
    icon: MessageCircleQuestion,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

function AppSidebar() {
  const { isSignedIn } = useUser();
  const user = useUserStore((state) => state);

  useEffect(() => {
    if (isSignedIn) {
      user.getUser();
    }
  }, [isSignedIn]);

  return (
    <Sidebar className="bg-white dark:bg-zinc-900 shadow-lg border-r border-gray-200 dark:border-zinc-800">
      <SidebarContent className="h-full flex flex-col p-4 space-y-6">
        {/* Application Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                        "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user.repos.map((repo) => (
                <SidebarMenuItem key={repo.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/project/${repo.id}`}
                      className="block truncate px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                      title={repo.name}
                    >
                      {repo.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section at Bottom */}
        <SidebarGroup className="mt-auto border-t pt-4 border-gray-200 dark:border-zinc-700">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <div className="truncate">{user.name}</div>
                <UserButton/>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
