"use client";

import React, { useState } from "react";
import { AnswerDialogForCard } from "./AnswerDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
dayjs.extend(relativeTime);

type File = {
  name: string;
  content: string;
  summary: string;
};

interface QACardProps {
  question: string;
  answer: string;
  files: File[];
  profileImg: string | null;
  createdAt: Date;
}

const QACard= ({
  question,
  answer,
  files,
  profileImg,
  createdAt,
}:QACardProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <div 
        className="group relative flex gap-5 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 ease-out overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
        
        <div className="flex-shrink-0 relative z-10">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-white shadow-md group-hover:ring-blue-100 transition-all duration-300">
              {profileImg ? (
                <AvatarImage src={profileImg} alt="Profile Image" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  CN
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
        <div 
          className="flex-1 cursor-pointer relative z-10 min-w-0" 
          onClick={() => setOpenDialog(true)}
        >
          {/* Question and Time */}
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 flex-1">
              {question}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                {dayjs(createdAt).fromNow()}
              </span>
            </div>
          </div>
          <div className="relative">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
              {answer.slice(0, 130)}...
            </p>
            
          </div>
        </div>
      </div>

      {/* Answer Dialog */}
      <AnswerDialogForCard
        answer={answer}
        files={files}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};

export default QACard;