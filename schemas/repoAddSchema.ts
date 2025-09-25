import * as z from 'zod';
export const repoAddSchema = z.object({
  repoUrl: z.string().min(1, { message: "Repository URL is required" }),
  repoName: z.string().min(1, { message: "Repository name is required" }),
  personalAccessToken: z.string().optional(),
  branch: z.string().optional(),
});