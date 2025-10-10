"use client";
import ChatBox from "@/components/ChatBox";
import Loading from "@/components/Loading";
import NoProjectSelected from "@/components/NoProjectSelected";
import QACard from "@/components/QACard";
import { getQuestionAnswers } from "@/lib/actions/repo";
import { useProjectStore } from "@/store/ProjectStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type File = {
  name: string;
  content: string;
  summary: string;
};

const Page = () => {
  const project = useProjectStore();

  const {
    data: qsAnswers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questionAnswers"],
    queryFn: async () => {
      if (!project.id || project.id.length == 0) return [];
      const response = await getQuestionAnswers(project.id);
      return response.data;
    },
    enabled: !!project.id,
  });

  if (!project.id || project.id.length == 0) {
    return <NoProjectSelected />;
  }

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Q&A Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-[52px]">
            Ask questions and get intelligent answers about your codebase
          </p>
        </div>

        {/* ChatBox Section */}
        <div className="mb-8">
          <ChatBox repoId={project.id} />
        </div>

        {/* Questions & Answers Section */}
        <div className="space-y-4">
          {/* Section Header */}
          {qsAnswers && qsAnswers.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Conversations
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {qsAnswers.length}
                </span>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 flex items-center gap-2">
                <span>View All</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* QA Cards */}
          {qsAnswers && qsAnswers.length > 0 ? (
            qsAnswers.map((qa, index) => (
              <div 
                key={index}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <QACard
                  answer={qa.answer}
                  files={qa.filesReferenced as File[]}
                  createdAt={qa.createdAt}
                  profileImg={qa.profile_img}
                  question={qa.question}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No questions yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start a conversation by asking a question about your codebase in the chat box above
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
                <span>Get started</span>
                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Page;