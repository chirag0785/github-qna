export type CommitType = {
    id: string;
    commit_hash: string;
    commit_message: string;
    repo_id: string | null;
    committer: string;
    committed_at: string;
    commit_summary: string;
    avatar_url?: string;
};