import { Navigate } from "react-router";
import { useAppSelector } from "../store/hooks";
import { Loader2 } from "lucide-react";
import { AppRoute } from "../constants/routes.enum";
import { DotLottiePlayer } from "@dotlottie/react-player";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    // Read the active dashboard theme, defaulting to light mode (white default)
    const isDark = typeof window !== "undefined" && localStorage.getItem("theme") === "dark";

    return (
      <div 
        className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white" 
            : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900"
        }`}
      >
        {/* Adaptive visual glassmorphic card */}
        <div 
          className={`relative p-12 backdrop-blur-xl border rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full text-center overflow-hidden transition-all duration-300 ${
            isDark 
              ? "bg-white/[0.03] border-white/[0.05] shadow-black/40" 
              : "bg-white/80 border-slate-200/80 shadow-slate-200/40"
          }`}
        >
          {/* Top-right glowing gradient circle */}
          <div 
            className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
              isDark ? "bg-pink-700/10" : "bg-pink-500/10"
            }`} 
          />
          {/* Bottom-left glowing gradient circle */}
          <div 
            className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-300 ${
              isDark ? "bg-pink-600/10" : "bg-pink-400/5"
            }`} 
          />

          {/* Premium loop-animated dotLottie player */}
          <div className="relative mb-4 flex items-center justify-center h-32 w-32 shrink-0">
            <DotLottiePlayer
              src="/Cat Crying emojiSticker animation.lottie"
              autoplay
              loop
              style={{ height: '128px', width: '128px' }}
            />
          </div>

          <h2 
            className={`text-xl font-bold tracking-tight mb-1 transition-colors duration-300 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Continental System
          </h2>
          
          <p 
            className={`text-sm mb-6 transition-colors duration-300 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Authorizing secure corporate credentials...
          </p>
          
          {/* Spinning brand pink loader */}
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-pink-600 animate-spin" />
            <div className="absolute h-10 w-10 rounded-full border border-pink-600/20 animate-ping opacity-75" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={AppRoute.LOGIN} replace />;
  }

  return <>{children}</>;
}
