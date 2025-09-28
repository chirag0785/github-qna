"use client";
import { useUserStore } from "@/store/UserStore";
import { useUser } from "@clerk/nextjs";
import {
  MessageCircleQuestion,
  PlusCircle,
  Presentation,
  Code,
  GitBranch,
  BarChart3,
  Clock,
  Activity,
  FolderGit2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast, ToastT } from "sonner";
import { updateFirstTimeUserFlag } from "@/lib/actions/user";

const Page = () => {
  const user = useUserStore((state) => state);
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
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
              🎉 You’ve been credited with <strong>100 free credits</strong> to
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 flex flex-col items-center shadow-xl">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4 animate-spin"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-xl">
              <GitBranch size={64} className="text-gray-600 mx-auto mb-4" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to RepoMind
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Your intelligent repository assistant. Sign in to access your
            projects, ask questions about your code, and manage your repositories.
          </p>
          
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border-0 flex items-center gap-3 mx-auto"
          >
            Sign In to Continue
            <ArrowRight size={20} />
          </button>
        </div>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full px-6 py-3 mb-4 shadow-lg">
                <Sparkles className="text-amber-500" size={20} />
                <span className="text-gray-700 font-medium">{greeting}!</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Welcome back, {user.name} 
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Here's what's happening with your repositories today.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="border-gray-300 bg-white/80 backdrop-blur-lg hover:bg-white/90 text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border flex items-center gap-2">
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Project
              </button>
            </div>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Total Projects
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {user.repos.length}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp size={16} className="mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-100 to-blue-200">
                  <FolderGit2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Questions Asked
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">48</h3>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp size={16} className="mr-1" />
                    <span>+8% from last week</span>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-100 to-amber-200">
                  <MessageCircleQuestion className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Meetings
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">3</h3>
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Calendar size={16} className="mr-1" />
                    <span>2 upcoming</span>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-100 to-indigo-200">
                  <Presentation className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Activity Score
                  </p>
                  <h3 className="text-3xl font-bold text-gray-800">94</h3>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <Star size={16} className="mr-1" />
                    <span>Excellent</span>
                  </div>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-green-100 to-green-200">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center text-gray-800">
                <Code
                  className="mr-3 text-blue-600"
                  size={24}
                />
                Your Projects
              </h2>
              {user.repos.length > 0 && (
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg"
                  >
                    <div className="h-5 w-1/2 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : user.repos.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-xl">
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-xl opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-full">
                      <FolderGit2
                        size={48}
                        className="text-gray-500"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                    Connect your first GitHub repository to start exploring with RepoMind's intelligent assistance.
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 flex items-center gap-3">
                    <PlusCircle className="h-5 w-5" />
                    Create New Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.repos.map((repo, index) => (
                  <div key={repo.id} className="group bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {repo.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Last updated {Math.floor(Math.random() * 7) + 1} days ago
                        </p>
                      </div>
                      <div className="rounded-xl p-3 bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <GitBranch className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <Code className="h-4 w-4 mr-2" />
                        <span>{Math.floor(Math.random() * 90) + 10} files</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MessageCircleQuestion className="h-4 w-4 mr-2" />
                        <span>{Math.floor(Math.random() * 30)} queries</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        ID: {repo.id.substring(0, 8)}...
                      </span>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span className="text-sm font-medium mr-2">Open</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Zap className="text-amber-500" size={24} />
                    Quick Actions
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="group flex items-center gap-4 p-6 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    <div className="rounded-2xl p-3 bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                      <MessageCircleQuestion className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Ask a Question
                      </h4>
                      <p className="text-sm text-gray-500">
                        Query your codebase with AI
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="group flex items-center gap-4 p-6 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    <div className="rounded-2xl p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
                      <Presentation className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Go to Meetings
                      </h4>
                      <p className="text-sm text-gray-500">
                        View your scheduled code reviews
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="group flex items-center gap-4 p-6 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    <div className="rounded-2xl p-3 bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                      <PlusCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Create New Project
                      </h4>
                      <p className="text-sm text-gray-500">
                        Connect a GitHub repository
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-xl">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-green-500" size={24} />
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="rounded-xl p-2 bg-gradient-to-br from-blue-100 to-blue-200 h-min">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          You asked a question about your{" "}
                          <span className="font-semibold text-blue-600">API routes</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-xl p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 h-min">
                        <GitBranch className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          New repository{" "}
                          <span className="font-semibold text-indigo-600">connected</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Yesterday
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-xl p-2 bg-gradient-to-br from-amber-100 to-amber-200 h-min">
                        <Presentation className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          Code review meeting{" "}
                          <span className="font-semibold text-amber-600">scheduled</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          2 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button className="w-full border-gray-300 bg-white/80 hover:bg-white/90 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 px-4 py-3 border">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;