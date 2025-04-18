"use client";
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChatBox = ({ repoId }: { repoId: string }) => {
  const [query, setQuery] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [files, setFiles] = useState<{
    name: string;
    description: string;
    content: string;
  }[]>([]);
  const triggerRef = useRef<any>();

  const processQuery = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/query/${repoId}?query=${query}`
      );
      const result = response.data;
      const data = result.data;

      setFiles(data);

      if (triggerRef.current) {
        triggerRef.current.click();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) =>
          setQuery(ev.target.value)
        }
        placeholder="Type any question you have for the repo like where I am doing this or that"
        className="w-full"
      />

      <Button onClick={processQuery} disabled={!query.trim()}>
        Submit
      </Button>

      {files && files.length > 0 && (
        <Dialog>
          <DialogTrigger className="hidden" ref={triggerRef}>
            Open
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl p-6 mx-auto my-4 rounded-lg bg-white shadow-lg">
            <Tabs defaultValue={files[0].name} className="w-full">
              <TabsList className="flex justify-start space-x-2">
                {files.map((file) => (
                  <TabsTrigger
                    key={file.name}
                    value={file.name}
                    className="p-2 text-sm font-medium"
                  >
                    {file.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {files.map((file) => (
                <TabsContent
                  key={file.name}
                  value={file.name}
                  className="mt-4 overflow-y-auto max-h-[400px] p-4 bg-gray-50 rounded-md"
                >
                  <p className="mb-2 text-sm text-muted-foreground">{file.description}</p>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md overflow-auto">
                    {file.content}
                  </pre>
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatBox;
