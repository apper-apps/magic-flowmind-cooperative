import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "chat") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "workflow") {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-48" />
          <div className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-full" />
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
        </div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  );
};

export default Loading;