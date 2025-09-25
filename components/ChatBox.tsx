"use client";
import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Send, FileText, Code, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ChatBox = ({ repoId }: { repoId: string }) => {
  const [query, setQuery] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterEnabled, setTypewriterEnabled] = useState(true);

  const processQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/query/${repoId}?query=${encodeURIComponent(query)}`
      );
      const result = response.data;
      const data = result.data;

      setFiles(data || []);
      setOpenDialog(true);
      
      // Set the full answer
      setAnswer(result.answer || "");
      
      // Reset typewriter effect
      setDisplayedAnswer("");
      setTypewriterIndex(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to answer the query. Please try again.",{
        description: "There was an error processing your request.",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!typewriterEnabled || !answer || typewriterIndex >= answer.length) return;
    
    const timer = setTimeout(() => {
      setDisplayedAnswer(answer.substring(0, typewriterIndex + 1));
      setTypewriterIndex(prev => prev + 1);
    }, 15); // Adjust speed here (lower = faster)
    
    return () => clearTimeout(timer);
  }, [typewriterIndex, answer, typewriterEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      processQuery();
    }
  };

  // Skip typewriter animation
  const skipTypewriter = () => {
    setDisplayedAnswer(answer);
    setTypewriterIndex(answer.length);
  };

  // Toggle typewriter effect
  const toggleTypewriter = () => {
    setTypewriterEnabled(prev => !prev);
    if (!typewriterEnabled) {
      // If re-enabling, reset
      setDisplayedAnswer("");
      setTypewriterIndex(0);
    } else {
      // If disabling, show full answer
      setDisplayedAnswer(answer);
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Repository Assistant</h3>
        <p className="text-sm text-slate-500 mb-4">Ask any question about the codebase</p>
        
        <div className="relative">
          <Textarea
            value={query}
            onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) =>
              setQuery(ev.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know about this repository?"
            className="w-full bg-white border-slate-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <div className="absolute bottom-3 right-3">
            <Button 
              onClick={processQuery} 
              disabled={!query.trim() || loading}
              className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-0"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">Press Ctrl+Enter to submit</p>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="hidden">Trigger</Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-white rounded-xl shadow-xl border-0 flex flex-col">
          {files.length > 0 && (
            <>
              {/* Header - Fixed */}
              <div className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0 rounded-t-xl">
                <h2 className="text-lg font-medium">Repository Analysis</h2>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={toggleTypewriter}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300 hover:text-white"
                  >
                    {typewriterEnabled ? "Disable" : "Enable"} Typewriter
                  </Button>
                  {typewriterEnabled && typewriterIndex < answer.length && (
                    <Button
                      onClick={skipTypewriter}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300 hover:text-white"
                    >
                      Show Full Answer
                    </Button>
                  )}
                  <Button 
                    onClick={() => setOpenDialog(false)}
                    className="text-slate-300 hover:text-white rounded-full p-1 hover:bg-slate-700"
                    variant="ghost"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Main content - Scrollable */}
              <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Answer Section - Scrollable */}
                <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 min-h-0">
                  {/* Answer Header - Fixed */}
                  <div className="p-6 pb-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="text-blue-600 mr-2" size={20} />
                        <h3 className="text-slate-800 font-medium">Answer</h3>
                      </div>
                      {typewriterEnabled && (
                        <span className="text-xs text-slate-500">
                          {Math.round((typewriterIndex / Math.max(answer.length, 1)) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Answer Content - Scrollable */}
                  <div className="flex-1 p-6 pt-4 overflow-y-auto">
                    <div className="prose max-w-none">
                      <div data-color-mode="light" className="rounded-lg overflow-hidden">
                        <MDEditor.Markdown 
                          source={typewriterEnabled ? displayedAnswer : answer} 
                          style={{ 
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            minHeight: '200px',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}
                        />
                        {typewriterEnabled && typewriterIndex < answer.length && (
                          <div className="mt-2 h-4 w-4 ml-4">
                            <span className="inline-block h-4 w-1 bg-blue-500 animate-pulse"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Files Section - Scrollable */}
                <div className="w-full md:w-1/2 flex flex-col min-h-0">
                  {/* Files Header - Fixed */}
                  <div className="p-6 pb-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center">
                      <Code className="text-blue-600 mr-2" size={20} />
                      <h3 className="text-slate-800 font-medium">Source Files ({files.length})</h3>
                    </div>
                  </div>

                  {/* Files Content - Scrollable */}
                  <div className="flex-1 p-6 pt-4 min-h-0">
                    <Tabs defaultValue={files[0]?.name} className="flex flex-col h-full min-h-0">
                      {/* Tabs List - Fixed with horizontal scroll */}
                      <div className="flex-shrink-0 mb-4">
                        <TabsList className="inline-flex w-full min-w-0 bg-slate-100 p-1 rounded-lg">
                          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 max-w-full">
                            {files.map((file) => (
                              <TabsTrigger
                                key={file.name}
                                value={file.name}
                                className="px-3 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md whitespace-nowrap flex-shrink-0 min-w-0"
                                title={file.name}
                              >
                                <span className="truncate max-w-[150px]">
                                  {file.name.split('/').pop()}
                                </span>
                              </TabsTrigger>
                            ))}
                          </div>
                        </TabsList>
                      </div>

                      {/* Tab Content - Scrollable */}
                      <div className="flex-1 min-h-0 overflow-hidden">
                        {files.map((file) => (
                          <TabsContent
                            key={file.name}
                            value={file.name}
                            className="h-full flex flex-col min-h-0 rounded-lg border border-slate-200 overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden"
                          >
                            {/* File Header - Fixed */}
                            <div className="bg-slate-100 px-4 py-2 text-xs font-mono text-slate-700 border-b border-slate-200 flex-shrink-0">
                              <span className="truncate" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                            
                            {/* File Content - Scrollable */}
                            <div className="flex-1 overflow-auto bg-slate-50">
                              <pre className="p-4 text-sm min-h-full">
                                <code className="font-mono text-slate-800 whitespace-pre-wrap break-words">
                                  {file.content}
                                </code>
                              </pre>
                            </div>
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatBox;