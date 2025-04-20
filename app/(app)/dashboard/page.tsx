"use client";
import { useUserStore } from '@/store/UserStore';
import { useUser } from '@clerk/nextjs';
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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
  const user = useUserStore((state) => state);
  const { isSignedIn, isLoaded } = useUser();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      user.getUser();
    }
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Simulate loading state
    setTimeout(() => setLoading(false), 500);
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl mb-8">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
            <GitBranch size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Welcome to RepoMind</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mb-8">
          Your intelligent repository assistant. Sign in to access your projects, ask questions about your code, and manage your repositories.
        </p>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg text-lg font-medium">
          <Link href="/sign-in">Sign In to Continue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              {greeting}, {user.name} 👋
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Here's what's happening with your repositories today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/project/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Projects
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    {user.repos.length}
                  </h3>
                </div>
                <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-900/20">
                  <FolderGit2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Questions Asked
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    48
                  </h3>
                </div>
                <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-900/20">
                  <MessageCircleQuestion className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Meetings
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    3
                  </h3>
                </div>
                <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20">
                  <Presentation className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Activity
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    14
                  </h3>
                </div>
                <div className="rounded-full p-2 bg-green-50 dark:bg-green-900/20">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
              <Code className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
              Your Projects
            </h2>
            {user.repos.length > 0 && (
              <Link 
                href="/projects" 
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : user.repos.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full mb-4">
                  <FolderGit2 size={32} className="text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                  You have no projects yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                  Connect your first GitHub repository to start exploring with RepoMind's intelligent assistance.
                </p>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/project/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.repos.map((repo) => (
                <Link key={repo.id} href={`/project/${repo.id}`}>
                  <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                          {repo.name}
                        </CardTitle>
                        <div className="rounded-full p-1.5 bg-slate-100 dark:bg-slate-700">
                          <GitBranch className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>
                      <CardDescription className="text-slate-500 dark:text-slate-400">
                        Last updated {Math.floor(Math.random() * 7) + 1} days ago
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <Code className="h-4 w-4 mr-1" />
                          <span>{Math.floor(Math.random() * 90) + 10} files</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <MessageCircleQuestion className="h-4 w-4 mr-1" />
                          <span>{Math.floor(Math.random() * 30)} queries</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ID: {repo.id.substring(0, 8)}...
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  <Link href="/ask-question" className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-900/20">
                      <MessageCircleQuestion className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                        Ask a Question
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Query your codebase with AI
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  
                  <Link href="/meetings" className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20">
                      <Presentation className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                        Go to Meetings
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        View your scheduled code reviews
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  
                  <Link href="/project/new" className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="rounded-full p-2 bg-green-50 dark:bg-green-900/20">
                      <PlusCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                        Create New Project
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Connect a GitHub repository
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="rounded-full p-1.5 bg-blue-50 dark:bg-blue-900/20 h-min">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        You asked a question about your <span className="font-medium">API routes</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="rounded-full p-1.5 bg-indigo-50 dark:bg-indigo-900/20 h-min">
                      <GitBranch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        New repository <span className="font-medium">connected</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Yesterday
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="rounded-full p-1.5 bg-amber-50 dark:bg-amber-900/20 h-min">
                      <Presentation className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        Code review meeting <span className="font-medium">scheduled</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 px-4 pb-4">
                <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;