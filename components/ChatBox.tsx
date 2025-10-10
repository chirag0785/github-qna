"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import {
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/UserStore";
import { askQuestion, saveQuestionAnswer } from "@/lib/actions/repo";
import { readStreamableValue } from "ai/rsc";
import {AnswerDialogForQuery} from "./AnswerDialog";

const ChatBox = ({ repoId }: { repoId: string }) => {
  const [query, setQuery] = useState<string>("");
  const [answerSaved, setAnswerSaved] = useState(false);
  const [files, setFiles] = useState<
    { name: string; content: string; summary: string }[]
  >([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const user = useUserStore();

  const processQuery = async () => {
    if (!query.trim()) return;

    if (user.credits < 5) {
      toast.error(
        "Not enough credits. Please purchase more credits to ask queries."
      );
      setQuery("");
      return;
    }
    setLoading(true);
    try {
      const { response, referencedFiles } = await askQuestion(
        query,
        repoId,
        user.id
      );
      setFiles(referencedFiles);
      setOpenDialog(true);
      for await (const delta of readStreamableValue(response)) {
        if (delta) {
          setAnswer((ans) => ans + delta);
        }
      }
      user.updateUser({
        ...user,
        credits: user.credits - 5,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to answer the query. Please try again.", {
        description: "There was an error processing your request.",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = async () => {
    setLoading(true);
    try {
      await saveQuestionAnswer(repoId,user.id,user.profile_img,query,answer,files);
      setAnswerSaved(true);
      toast.success("Answer saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Answer can't be saved right now. Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Repository Assistant
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Ask any question about the codebase
        </p>

        <div className="relative">
          <Textarea
            value={query}
            onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) =>
              setQuery(ev.target.value)
            }
            placeholder="What would you like to know about this repository?"
            className="w-full bg-white border-slate-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <div className="absolute bottom-3 right-3">
            <Button
              onClick={processQuery}
              disabled={!query.trim() || loading}
              className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-0"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnswerDialogForQuery
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setQuery={setQuery}
        answer={answer}
        answerSaved={answerSaved}
        files={files}
        loading={loading}
        saveAnswer={saveAnswer}      
      />
    </div>
  );
};

export default ChatBox;
