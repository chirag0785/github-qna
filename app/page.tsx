"use client";
import React, { useState, useEffect } from 'react';
import { Github, Search, Zap, Brain, Code, ArrowRight, Star, Users, GitBranch, MessageSquare, Sparkles, Bot, Database, Lock, CreditCard, Play, LayoutDashboard, DockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const GitHubQnALanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const {isLoaded,isSignedIn}=useUser();
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Natural Language Queries",
      description: "Ask questions about your code in plain English and get intelligent responses",
      gradient: "from-blue-500 to-purple-600",
      details: ["Plain English queries", "Contextual understanding", "Smart code analysis"]
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Uses vector embeddings to find the most relevant results from your codebase",
      gradient: "from-purple-500 to-pink-600",
      details: ["Vector embeddings", "Similarity matching", "Precise results"]
    },
    {
      icon: Github,
      title: "Repository Integration",
      description: "Works directly with GitHub repositories for seamless code exploration",
      gradient: "from-pink-500 to-red-500",
      details: ["Direct GitHub integration", "Real-time sync", "Multiple repos support"]
    }
  ];

  const techStack = [
    { name: "Next.js", color: "default" },
    { name: "Drizzle ORM", color: "secondary" },
    { name: "PostgreSQL", color: "default" },
    { name: "Google Gemini", color: "secondary" },
    { name: "Clerk", color: "outline" },
    { name: "Stripe", color: "outline" }
  ];

  const stats = [
    { icon: Star, value: "AI-Powered", label: "Intelligent Answers" },
    { icon: Users, value: "Vector", label: "Semantic Search" },
    { icon: GitBranch, value: "GitHub", label: "Integration" },
    { icon: Zap, value: "Fast", label: "Query Response" }
  ];

  const demoQueries = [
    "How does user authentication work in this app?",
    "Show me the database schema for users",
    "What API endpoints are available?",
    "How is error handling implemented?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 p-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Github className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              GitHub QnA
            </span>
          </div>
         <div className="flex space-x-4">
           <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
            <Link href="https://github.com/chirag0785/github-qna" target="_blank" className="flex items-center">
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </Link>
          </Button>
           <Button className="bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 border-0">
            <Link href={isLoaded && isSignedIn ? "/dashboard" : "/sign-in"} className="flex items-center">
              {
                isLoaded && isSignedIn ? (
                  <>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </>
                )
                :
                (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )
              }
            </Link>
          </Button>
         </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge variant="outline" className="mb-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
              AI-Powered Code Intelligence
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Ask Your Code
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Anything
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform how you explore code repositories. Query your GitHub repos in natural language 
              and get intelligent, contextual answers powered by AI.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-lg px-8 py-6">
                <Link href="/sign-up" className="flex items-center">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-6">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Demo Query Box */}
            <Card className="max-w-2xl mx-auto bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Bot className="h-6 w-6 text-purple-400" />
                  <CardTitle className="text-white">Try asking:</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoQueries.map((query, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg text-left text-gray-300 hover:bg-white/10 transition-colors cursor-pointer">
                    "{query}"
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card 
                  key={index} 
                  className={`text-center bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <CardContent className="p-6">
                    <IconComponent className="h-8 w-8 mx-auto mb-3 text-purple-400" />
                    <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Developers</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to understand your codebase like never before
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`bg-white/5 border-white/10 backdrop-blur-md hover:border-purple-500/50 transition-all duration-500 hover:scale-105 group ${
                  activeFeature === index ? 'ring-2 ring-purple-500/50 scale-105' : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-300">Three simple steps to unlock your code's potential</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Repository",
                description: "Link your GitHub repository and let our AI analyze your codebase"
              },
              {
                step: "2", 
                title: "Ask Questions",
                description: "Query your code in natural language - just like talking to a developer"
              },
              {
                step: "3",
                title: "Get Insights", 
                description: "Receive contextual answers with relevant code snippets and explanations"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl mb-4 text-white">{item.title}</CardTitle>
                  <CardDescription className="text-gray-300">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-8">Built with Modern Technologies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <Badge 
                key={index} 
                variant={tech.color as BadgeProps['variant']}
                className="px-6 py-3 text-base hover:scale-105 transition-transform duration-300 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Card className="bg-gradient-to-r from-purple-700/20 to-pink-800/20 border-white/10 backdrop-blur-md">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Code Exploration?
                </span>
              </h2>
              <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                Join developers who are already using AI to understand their codebases better
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-lg px-8 py-6">
                 <Link href={"/sign-up"} className="flex items-center">
                     <Lock className="h-5 w-5 mr-2" />
                      Start journey
                 </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-gray-300 text-black text-lg px-8 py-6">
                  <Link href={"https://github.com/chirag0785/github-qna"} target="_blank" className="flex items-center">
                    <DockIcon className="h-5 w-5 mr-2" />
                    View Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Github className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">GitHub QnA</span>
            </div>
            <div className="text-gray-400">
              Made with ❤️ by developer, for developers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GitHubQnALanding;