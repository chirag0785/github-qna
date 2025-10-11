import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { UserPlus, Copy, Link2, Sparkles } from "lucide-react";

const InviteTeamMember = ({ projectId }: { projectId: string }) => {
  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/join/${projectId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!", {
      description: "Share this link with your team members",
      icon: <Copy className="w-4 h-4" />,
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <UserPlus className="w-4 h-4 mr-2 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium text-indigo-700">Invite Members</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Invite Team Members
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Share this secure link with your team members to join the project
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white border-2 border-indigo-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <span>Invitation Link</span>
                </div>
                <Input 
                  readOnly 
                  value={inviteLink}
                  className="font-mono text-sm bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 cursor-pointer"
                  onClick={handleCopyLink}
                />
              </div>
            </div>

            <Button 
              onClick={handleCopyLink}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Copy Invitation Link
            </Button>

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                This link will allow team members to join your project. Anyone with this link can join, so share it carefully.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteTeamMember;