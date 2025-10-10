"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboardIcon,
  MessageCircleQuestion,
  Presentation,
  CreditCard,
  Code,
  ChevronRight,
  Braces,
  Settings,
  FolderGit2,
  Sparkles
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
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { useProjectStore } from "@/store/ProjectStore";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    description: "Overview of your repositories and activities"
  },
  {
    title: "Query Engine",
    url: "/query",
    icon: MessageCircleQuestion,
    description: "Ask questions about your repositories"
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
    description: "Schedule and manage code reviews"
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
    description: "Manage your subscription and payments"
  },
];

function AppSidebar() {
  const { isSignedIn,isLoaded, user: clerkUser } = useUser();
  const user = useUserStore((state) => state);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const project=useProjectStore();
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      user.getUser();
    }
  }, [isSignedIn, isLoaded]);

  useEffect(()=>{
    project.getProject();
  },[]);

  return (
    <Sidebar className="bg-slate-50 dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300">
      <SidebarContent className="h-full flex flex-col p-0 space-y-1">
        {/* Brand Header */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <Braces size={20} />
            </div>
            {!collapsed && (
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RepoMind
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  v2.1
                </span>
              </div>
            )}
          </Link>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronRight className={clsx("h-5 w-5 transition-transform", {
              "rotate-180": collapsed,
            })} />
          </button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-3 py-2">
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="my-1">
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          {
                            "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-500": isActive,
                            "text-slate-700 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800/50": !isActive,
                            "justify-center": collapsed,
                          }
                        )}
                        title={item.description}
                      >
                        <item.icon className={clsx("shrink-0", {
                          "h-5 w-5": !isActive,
                          "h-5 w-5 text-indigo-600 dark:text-indigo-400": isActive
                        })} />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects Section */}
        <SidebarGroup className="flex-1 overflow-hidden px-3 py-2">
          {!collapsed && (
            <div className="flex items-center justify-between px-2 mb-2">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Your Projects
              </SidebarGroupLabel>
              <Link
                href="/project/new"
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                title="Add new project"
              >
                <Sparkles size={16} />
              </Link>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-800">
                <FolderGit2 size={16} className="text-slate-500 dark:text-slate-400" />
              </div>
            </div>
          )}
          <SidebarGroupContent className="overflow-y-auto max-h-[38vh] pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <SidebarMenu>
              {user.repos.length > 0 ? (
                user.repos.map((repo) => {
                  const isActive = project.id === repo.id;
                  return (
                    <SidebarMenuItem key={repo.id} className="my-1" onClick={()=> {
                      project.updateProject({
                        id:repo.id,
                        name:repo.name,
                      })
                    }}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/dashboard`}
                          className={clsx(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                            {
                              "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-900/20 dark:text-indigo-400": isActive,
                              "text-slate-700 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800/50": !isActive,
                              "justify-center": collapsed,
                            }
                          )}
                          title={repo.name}
                        >
                          <Code className={clsx("shrink-0 h-4 w-4", {
                            "text-indigo-600 dark:text-indigo-400": isActive,
                            "text-slate-500 dark:text-slate-400": !isActive
                          })} />
                          {!collapsed && (
                            <span className="truncate">{repo.name}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className={clsx("text-center py-6", {
                  "px-4": !collapsed,
                  "px-1": collapsed
                })}>
                  {!collapsed ? (
                    <>
                      <FolderGit2 className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet</p>
                      <Link 
                        href="/project/new" 
                        className="mt-2 text-xs block text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Connect your first repository
                      </Link>
                    </>
                  ) : (
                    <FolderGit2 className="w-5 h-5 mx-auto text-slate-400 dark:text-slate-500" />
                  )}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section at Bottom */}
        <SidebarGroup className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 rounded-b-lg">
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="p-3 flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
                    }
                  }}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                      {user.name || clerkUser?.fullName || "User"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email || clerkUser?.primaryEmailAddress?.emailAddress || ""}
                    </div>
                  </div>
                )}
                {!collapsed && (
                  <Link
                    href="/settings"
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Settings"
                  >
                    <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                  </Link>
                )}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;