'use client';
import { getCommitDetails } from '@/lib/actions/commit';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Commit = {
  id: string;
  commit_hash: string;
  commit_message: string;
  repo_id: string | null;
  committer: string;
  committed_at: string;
  commit_summary: string;
  avatar_url?: string; // <-- Added this
};

const Page = ({ params }: { params: { repoId: string } }) => {
  const { repoId } = params;
  const [commits, setCommits] = useState<Commit[]>();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const pageNo = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    if (!userId) return;
    getCommitDetails(pageNo, repoId, userId)
      .then((response) => response.data)
      .then((data) => {
        setCommits(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNo, repoId, userId]);

  if (!userId) {
    return (
      <div className="text-center text-2xl font-semibold mt-20">
        Please login to view this page
      </div>
    );
  }

  if (!commits) {
    return (
      <div className="text-center text-lg font-medium mt-20 text-gray-500 dark:text-gray-400">
        Loading commits...
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="text-center text-2xl font-semibold mt-20">
        No commits found
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-10 max-w-4xl mx-auto px-4">
      {commits.map((commit) => (
        <div
          key={commit.id}
          className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-zinc-700 transition hover:scale-[1.01] duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {commit.commit_message}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {new Date(commit.committed_at).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            {commit.avatar_url && (
              <img
                src={commit.avatar_url}
                alt={`${commit.committer}'s avatar`}
                className="w-10 h-10 rounded-full object-cover border dark:border-zinc-700"
              />
            )}
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Committer:</strong> {commit.committer}
              </p>
              {commit.repo_id && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Repo ID: {commit.repo_id}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
            <p className="text-sm italic text-gray-700 dark:text-gray-400">
              {commit.commit_summary}
            </p>
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 break-all font-mono">
              #{commit.commit_hash}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
