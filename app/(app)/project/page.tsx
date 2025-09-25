"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getCommitDetails } from "@/lib/actions/commit";
import ChatBox from "@/components/ChatBox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileCode,
  Clock,
  Users,
  GitCommit,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Commit = {
  id: string;
  commit_hash: string;
  commit_message: string;
  repo_id: string | null;
  committer: string;
  committed_at: string;
  commit_summary: string;
  avatar_url?: string;
};

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
  const [commits, setCommits] = useState<Commit[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [totalPages, setTotalPages] = useState(1);
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repoId");
  const pageNo = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!userId || !repoId) return;

    setLoading(true);
    getCommitDetails(pageNo, repoId, userId)
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
  }, [pageNo, repoId, userId]);

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle page navigation
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!repoId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
          <div className="relative bg-white dark:bg-slate-900 p-4 rounded-full shadow-lg flex items-center justify-center">
            <FileCode
              size={36}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
          No Repository Selected
        </h2>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
          Please select a repository to view its commits and use the chat
          assistant.
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1 rounded-full mb-6">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-full">
            <Users size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Authentication Required
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          Please log in to view repository commits and use the chat assistant.
        </p>
      </div>
    );
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
          Error fetching the commits
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">{error}</p>
        <Button
          onClick={() => {
            router.replace(`${pathname}?repoId=${repoId}&page=${pageNo}`);
          }}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <header className="mb-10">
          <div className="flex items-center mb-2">
            <FileCode
              className="text-indigo-600 dark:text-indigo-400 mr-2"
              size={24}
            />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Repository Explorer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            View commit history and query the codebase using natural language
          </p>
        </header>

        {/* ChatBox Component */}
        <div className="mb-12 transition-all duration-300 hover:shadow-xl rounded-2xl">
          <ChatBox repoId={repoId} />
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
              <div
                key={commit.id}
                className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]"
              >
                <div className="border-l-4 border-indigo-600 dark:border-indigo-500 p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                        {commit.commit_message}
                      </h3>

                      <div className="flex items-center mt-4 mb-4">
                        <div className="flex items-center mr-6">
                          {commit.avatar_url ? (
                            <img
                              src={commit.avatar_url}
                              alt={`${commit.committer}'s avatar`}
                              className="w-8 h-8 rounded-full mr-2 border-2 border-white dark:border-slate-700 shadow-sm"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium mr-2">
                              {commit.committer.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {commit.committer}
                          </span>
                        </div>

                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                          <Clock size={14} className="mr-1" />
                          {formatDate(commit.committed_at)}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-md">
                      <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                        {commit.commit_hash.substring(0, 8)}
                      </code>
                    </div>
                  </div>

                  <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {commit.commit_summary}
                    </p>
                  </div>
                </div>
              </div>
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
  );
};

export default Page;
