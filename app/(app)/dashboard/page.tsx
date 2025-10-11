"use client";
import { useUserStore } from "@/store/UserStore";
import { useUser } from "@clerk/nextjs";
import type { CommitType } from "@/lib/types";
import {
  Sparkles,
  FileCode,
  GitCommit,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateFirstTimeUserFlag } from "@/lib/actions/user";
import { useProjectStore } from "@/store/ProjectStore";
import NoProjectSelected from "@/components/NoProjectSelected";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import { Button } from "@/components/ui/button";
import { getCommitDetails } from "@/lib/actions/commit";
import { Skeleton } from "@/components/ui/skeleton";
import NotSigned from "@/components/NotSigned";
import Loading from "@/components/Loading";
import Commit from "@/components/Commit";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/lib/actions/repo";
import TeamMembers from "@/components/TeamMembers";
import InviteTeamMember from "@/components/InviteTeamMember";

const ProjectPageSkeleton = () => {
  return (
    <div className="mb-8">
      <header className="mb-10">
        <div className="flex items-center mb-2">
          <Skeleton className="w-6 h-6 rounded mr-2" />
          <Skeleton className="h-8 w-48 rounded" />
        </div>
        <Skeleton className="h-4 w-64 rounded" />
      </header>

      <div className="mb-12 rounded-2xl">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>

      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="border-l-4 border-indigo-600 dark:border-indigo-500 p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                  <div className="flex items-center mt-4 mb-4">
                    <div className="flex items-center mr-6">
                      <Skeleton className="w-8 h-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const user = useUserStore((state) => state);
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const project=useProjectStore();

  const [commits, setCommits] = useState<CommitType[]>();
  const [error, setError] = useState<string>();
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const pageNo = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const pathname = usePathname();

  const teamMembersQuery=useQuery({
    queryKey: ['teamMembers',project.id],
    queryFn: ()=> getTeamMembers(project.id),
    enabled: !!project.id
  })

  // Handle page navigation
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      //it means user is signed in and clerk is loaded
      user.getUser();
    }
    if (clerkUser && clerkUser.publicMetadata.firstTimeUser) {
      //show a toast that welcome to the app and 100 free credits credited to get started
      toast.custom(
        () => (
          <div className="w-[90vw] md:w-[40rem] bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <strong className="text-lg">
                Welcome to RepoMind, {clerkUser.firstName || "User"}!
              </strong>
            </div>
            <p className="text-sm">
              🎉 You've been credited with <strong>100 free credits</strong> to
              get started.
            </p>
            <p className="text-sm">
              🚀 Explore your repositories, ask questions about your code, and
              make your coding journey effortless.
            </p>
            <p className="text-xs opacity-80">Happy coding! 💡</p>
          </div>
        ),
        {
          duration: 8000,
          position: "top-center",
        }
      );

      //set first time user to false in the metadata
      updateFirstTimeUserFlag();
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Simulate loading state
    setTimeout(() => setLoading(false), 500);
  }, [isSignedIn, isLoaded, clerkUser]);

  useEffect(() => {
    if (!user.id || !project.id || user.id.length==0 || project.id.length==0){
      return;
    }
    setLoading(true);
    getCommitDetails(pageNo, project.id, user.id)
      .then((response: any) => {
        setCommits(response.data);
        // Assuming the API returns total pages info - adjust as needed
        setTotalPages(response.totalPages || 1);
      })
      .catch((err) => {
        console.error("Error fetching commits:", err);
        setError(err.message);
        toast.error("Failed to fetch commits. Please try again.", {
          description: err.message,
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageNo,project.id,user.id]);

  
  if (!isLoaded) {
    return <Loading/>
  }

  if (!isSignedIn) {
    return <NotSigned/>
  }
  if(!project.id || project.id.length==0){
    //select a project or create a new project to continue
     return <NoProjectSelected/>
  }

  if (loading) {
    return <ProjectPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-1 rounded-full mb-6">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Error fetching the commits, refresh the page.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <header className="mb-12">
          <div className="flex flex-col gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full px-6 py-3 mb-4 shadow-lg">
                <Sparkles className="text-amber-500" size={20} />
                <span className="text-gray-700 font-medium">{greeting}!</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Welcome back, {user.name} 
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {`Here's what's happening with your repository today.`}
              </p>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileCode
                className="text-indigo-600 dark:text-indigo-400 mr-2"
                size={24}
              />
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Repository Explorer
              </h1>
            </div>
            <div className="flex gap-x-1 items-center justify-between">
              <InviteTeamMember projectId={project.id}/>
              {teamMembersQuery?.data && <TeamMembers members={teamMembersQuery.data} maxVisible={3}/>}
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            View commit history and query the codebase using natural language
          </p>
        </header>

        {/* ChatBox Component */}
        <div className="mb-12 transition-all duration-300 hover:shadow-xl rounded-2xl">
          <ChatBox repoId={project.id} />
        </div>
      </div>

      {/* Commits Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
            <GitCommit
              className="mr-2 text-indigo-600 dark:text-indigo-400"
              size={20}
            />
            Commit History
          </h2>
          {commits && commits.length > 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {commits.length} commit{commits.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {commits && commits.length > 0 ? (
          <div className="space-y-6">
            {commits.map((commit) => (
              <Commit key={commit.id} commit={commit}/>
            ))}

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                  <Button
                    onClick={() => navigateToPage(Math.max(1, pageNo - 1))}
                    disabled={pageNo <= 1}
                    className="p-2 rounded-md disabled:opacity-50 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 disabled:hover:text-slate-500 disabled:dark:hover:text-slate-400"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <div className="px-4 py-1 font-medium text-sm text-slate-700 dark:text-slate-300">
                    Page {pageNo} of {totalPages}
                  </div>
                  <Button
                    onClick={() =>
                      navigateToPage(Math.min(totalPages, pageNo + 1))
                    }
                    disabled={pageNo >= totalPages}
                    className="p-2 rounded-md disabled:opacity-50 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 disabled:hover:text-slate-500 disabled:dark:hover:text-slate-400"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-16 text-center border border-slate-200 dark:border-slate-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 mb-4">
              <GitCommit size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No Commits Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are no commits available for this repository yet.
            </p>
          </div>
        )}
      </div>
    </div>
      </div>
    </div>
  );
};

export default Page;