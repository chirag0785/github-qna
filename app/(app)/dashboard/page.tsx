"use client"
import { useUserStore } from '@/store/UserStore'
import { MessageCircleQuestion, PlusCircle, Presentation } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  const user=useUserStore((state)=> state);
  return (
    <div className="p-6 space-y-8">
    {/* Welcome Message */}
    <div className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
      Welcome back, {user.name} 👋
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link href="/ask-question">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer flex items-center gap-3">
          <MessageCircleQuestion className="text-blue-600 dark:text-blue-300" />
          <span className="font-medium text-gray-800 dark:text-gray-100">Ask a Question</span>
        </div>
      </Link>
      <Link href="/meetings">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition cursor-pointer flex items-center gap-3">
          <Presentation className="text-green-600 dark:text-green-300" />
          <span className="font-medium text-gray-800 dark:text-gray-100">Go to Meetings</span>
        </div>
      </Link>
      <Link href="/create-project">
        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-800 transition cursor-pointer flex items-center gap-3">
          <PlusCircle className="text-purple-600 dark:text-purple-300" />
          <span className="font-medium text-gray-800 dark:text-gray-100">Create New Project</span>
        </div>
      </Link>
    </div>

    {/* User's Projects */}
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Projects</h2>
      {user.repos.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You have no projects yet.</p>
      ) : (
        <ul className="space-y-2">
          {user.repos.map((repo) => (
            <Link href={`/project/${repo.id}`}>
              <li
              key={repo.id}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm"
            >
              {repo.name}
            </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  </div>
  )
}

export default Page