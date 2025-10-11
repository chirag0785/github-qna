
import { Users } from 'lucide-react';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const TeamMembers = ({members,maxVisible}:{
    members: {
        id:string;
        name:string;
        profile_img:string | null;
    }[],
    maxVisible: number
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - visibleMembers.length;

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">Team</span>
      </div>
      
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <div
            key={member.id}
            className="relative group"
            style={{ zIndex: visibleMembers.length - index }}
          >
            <Avatar className="w-9 h-9 rounded-full ring-2 ring-white hover:ring-indigo-400 transition-all duration-200 hover:scale-110 cursor-pointer overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              {member.profile_img ? (
                <AvatarImage
                  src={member.profile_img} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {member.name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div 
            className="w-9 h-9 flex items-center justify-center text-xs font-semibold text-indigo-600 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full ring-2 ring-white hover:ring-indigo-400 transition-all duration-200 hover:scale-110 cursor-pointer"
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamMembers