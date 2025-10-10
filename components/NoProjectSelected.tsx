"use client";

import { FolderGit2, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NoProjectSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 mb-6">
        <FolderGit2 size={36} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        No Project Selected
      </h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
        Select a project from your sidebar, or create a new one to start exploring your repository insights.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Link
          href="/project/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <PlusCircle size={18} />
          Create New Project
        </Link>
      </div>
    </div>
  );
}
