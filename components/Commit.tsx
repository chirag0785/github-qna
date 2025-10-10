import type { CommitType } from "@/lib/types";
import { Clock } from "lucide-react";

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
const Commit = ({ commit }: { commit: CommitType }) => {
  return (
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
  );
};

export default Commit;
