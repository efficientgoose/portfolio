import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
      <div className="w-64 h-64">
        <DotLottieReact
          src="/loading-animation.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
