"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { repoAddSchema } from "@/schemas/repoAddSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/UserStore";
import { useProjectStore } from "@/store/ProjectStore";

const Page = () => {
  const [uploadingRepo, setUploadingRepo] = useState(false);
  const user=useUserStore();
  const router = useRouter();
  const project=useProjectStore();
  const form = useForm<z.infer<typeof repoAddSchema>>({
    resolver: zodResolver(repoAddSchema),
    defaultValues: {
      repoUrl: "",
      repoName: "",
      personalAccessToken: "",
      branch: "master",
    },
  });

  const onSubmit = async (data: z.infer<typeof repoAddSchema>) => {
    if(user.credits<50){
      toast.error("Not enough credits. Please purchase more credits to add a new repository.");
      form.reset();
      return;
    }
    setUploadingRepo(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-repo`,
        data
      );
      toast.success("Repository added successfully");
      user.updateUser({
        ...user,
        credits: user.credits - 50,
        repos: [...user.repos, {id:response.data.repoId,name:data.repoName,repo_url:data.repoUrl}]
      })
      project.updateProject({
        id:response.data.repoId,
        name: response.data.repoName,
      })
      router.replace('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error("Error adding repository", {
        description:
          "Please check the repository details and try again. If the repo is private, ensure that the personal access token is correct.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setUploadingRepo(false);
    }
  };

  return (
    <div className="h-full bg-indigo-200 dark:bg-slate-800 flex items-center justify-center">
      <div className="max-w-3xl w-full p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          Add New Repository
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-repo"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalAccessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Access Token</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your personal access token if the repo is private"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="master"
                      {...field}
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={uploadingRepo}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
            >
              {uploadingRepo && <Loader2 className="h-5 w-5 animate-spin" />}
              {uploadingRepo ? "Adding Repository..." : "Submit"}
            </Button>

            {uploadingRepo && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
                This may take a few moments depending on the repository size.
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
