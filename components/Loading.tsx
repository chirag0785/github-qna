const Loading=()=>{
    return (
       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 flex flex-col items-center shadow-xl">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4 animate-spin"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
}
export default Loading;