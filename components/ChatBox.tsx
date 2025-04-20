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
import { Send, FileText, Code, Loader2 } from "lucide-react";

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
          <div className="absolute">
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
          <button className="hidden">Trigger</button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl w-full max-h-screen overflow-hidden p-0 bg-white rounded-xl shadow-xl border-0">
          {files.length > 0 && (
            <div className="flex flex-col h-[80vh]">
              {/* Header */}
              <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-medium">Repository Analysis</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleTypewriter}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300 hover:text-white"
                  >
                    {typewriterEnabled ? "Disable" : "Enable"} Typewriter
                  </button>
                  {typewriterEnabled && typewriterIndex < answer.length && (
                    <button
                      onClick={skipTypewriter}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300 hover:text-white"
                    >
                      Show Full Answer
                    </button>
                  )}
                  <button 
                    onClick={() => setOpenDialog(false)}
                    className="text-slate-300 hover:text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* Answer Section with fixed markdown styling */}
                <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="text-blue-600 mr-2" size={20} />
                      <h3 className="text-slate-800 font-medium">Answer</h3>
                    </div>
                    <div className="flex items-center">
                      {typewriterEnabled && (
                        <span className="text-xs text-slate-500">
                          {Math.round((typewriterIndex / Math.max(answer.length, 1)) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <div data-color-mode="light" className="rounded-lg overflow-hidden">
                      <MDEditor.Markdown 
                        source={typewriterEnabled ? displayedAnswer : answer} 
                        style={{ 
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          minHeight: '200px'
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

                {/* Files Section */}
                <div className="w-full md:w-1/2 p-6 overflow-hidden flex flex-col">
                  <div className="flex items-center mb-4">
                    <Code className="text-blue-600 mr-2" size={20} />
                    <h3 className="text-slate-800 font-medium">Source Files</h3>
                  </div>
                  
                  <Tabs defaultValue={files[0]?.name} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="flex overflow-x-auto mb-2 bg-slate-100 p-1 rounded-lg">
                      {files.map((file) => (
                        <TabsTrigger
                          key={file.name}
                          value={file.name}
                          className="px-3 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
                        >
                          {file.name.split('/').pop()}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex-1 overflow-hidden">
                      {files.map((file) => (
                        <TabsContent
                          key={file.name}
                          value={file.name}
                          className="h-full overflow-hidden rounded-lg border border-slate-200"
                        >
                          <div className="bg-slate-100 px-4 py-2 text-xs font-mono text-slate-700 border-b border-slate-200">
                            {file.name}
                          </div>
                          <pre className="bg-slate-50 p-4 h-full overflow-y-auto text-sm">
                            <code className="font-mono text-slate-800">{file.content}</code>
                          </pre>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatBox;