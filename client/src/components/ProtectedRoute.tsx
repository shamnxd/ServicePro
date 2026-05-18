import { Navigate } from "react-router";
import { useAppSelector } from "../store/hooks";
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
            ? "bg-slate-950" 
            : "bg-white"
        }`}
      >
        {/* Minimalist layout displaying ONLY the Lottie loader */}
        <div className="flex items-center justify-center h-48 w-48 shrink-0">
          <DotLottiePlayer
            src="/Cat Crying emojiSticker animation.lottie"
            autoplay
            loop
            style={{ height: '160px', width: '160px' }}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={AppRoute.LOGIN} replace />;
  }

  return <>{children}</>;
}
