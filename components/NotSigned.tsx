import { ArrowRight, GitBranch, Link } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

const NotSigned = () => {
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
          
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 border-0 flex items-center gap-3 mx-auto"
          >
            <Link href='/sign-in'>
                Sign In to Continue
                <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
  )
}

export default NotSigned
