import { Braces, Code, DownloadIcon, FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import MDEditor from "@uiw/react-md-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
const AnswerDialogForQuery = ({
  openDialog,
  setOpenDialog,
  files,
  loading,
  answerSaved,
  setQuery,
  answer,
  saveAnswer,
}: {
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  files: {
    name: string;
    content: string;
    summary: string;
  }[];
  loading: boolean;
  answerSaved: boolean;
  setQuery: (query: string) => void;
  answer: string;
  saveAnswer: () => {};
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="hidden">Trigger</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-white rounded-xl shadow-xl border-0 flex flex-col">
        {files.length > 0 && (
          <>
            {/* Header - Fixed */}
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0 rounded-t-xl">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                <Braces size={20} />
              </div>
              <Button
                disabled={loading || answerSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors 
              ${
                loading || answerSaved
                  ? "cursor-not-allowed bg-gray-300"
                  : "cursor-pointer bg-blue-600 hover:bg-blue-700"
              } 
              text-white font-medium`}
                onClick={saveAnswer}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                <DownloadIcon size={16} />
                <span>{answerSaved ? "Answer Saved" : "Save Answer"}</span>
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    setQuery("");
                  }}
                  className="text-slate-300 hover:text-white rounded-full p-1 hover:bg-slate-700"
                  variant="ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
                  </div>
                </div>

                {/* Answer Content - Scrollable */}
                <div className="flex-1 p-6 pt-4 overflow-y-auto">
                  <div className="prose max-w-none">
                    <div
                      data-color-mode="light"
                      className="rounded-lg overflow-hidden"
                    >
                      <MDEditor.Markdown
                        source={answer}
                        style={{
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          minHeight: "200px",
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      />
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
                    <h3 className="text-slate-800 font-medium">
                      Source Files ({files.length})
                    </h3>
                  </div>
                </div>

                {/* Files Content - Scrollable */}
                <div className="flex-1 p-6 pt-4 min-h-0">
                  <Tabs
                    defaultValue={files[0]?.name}
                    className="flex flex-col h-full min-h-0"
                  >
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
                                {file.name.split("/").pop()}
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
  );
};
const AnswerDialogForCard = ({
  openDialog,
  setOpenDialog,
  files,
  answer,
}: {
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  files: {
    name: string;
    content: string;
    summary: string;
  }[];
  answer: string;
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="hidden">Trigger</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-white rounded-xl shadow-xl border-0 flex flex-col">
        {files.length > 0 && (
          <>
            {/* Header - Fixed */}
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0 rounded-t-xl">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                <Braces size={20} />
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                  }}
                  className="text-slate-300 hover:text-white rounded-full p-1 hover:bg-slate-700"
                  variant="ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
                  </div>
                </div>

                {/* Answer Content - Scrollable */}
                <div className="flex-1 p-6 pt-4 overflow-y-auto">
                  <div className="prose max-w-none">
                    <div
                      data-color-mode="light"
                      className="rounded-lg overflow-hidden"
                    >
                      <MDEditor.Markdown
                        source={answer}
                        style={{
                          padding: "16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          minHeight: "200px",
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      />
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
                    <h3 className="text-slate-800 font-medium">
                      Source Files ({files.length})
                    </h3>
                  </div>
                </div>

                {/* Files Content - Scrollable */}
                <div className="flex-1 p-6 pt-4 min-h-0">
                  <Tabs
                    defaultValue={files[0]?.name}
                    className="flex flex-col h-full min-h-0"
                  >
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
                                {file.name.split("/").pop()}
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
  );
};

export  {AnswerDialogForQuery,AnswerDialogForCard};
