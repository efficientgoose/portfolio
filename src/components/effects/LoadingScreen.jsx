import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/4ce08f38-14fa-4e39-862b-3999b8d6c62f/keL5ErArCV.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
