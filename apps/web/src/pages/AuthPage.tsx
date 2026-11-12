import Toolbar from "../components/layout/Toolbar";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import AuthCard from "../features/auth/components/AuthCard";
import HeroSection from "../features/auth/components/HeroSection";

export default function AuthPage() {
  const { toast, show } = useToast();

  return (
    <>
      <div className="grid min-h-screen split:grid-cols-[1.1fr_1fr]">
        <HeroSection />

        <main className="relative z-[3] -mt-[34px] flex flex-col items-center rounded-t-[30px] bg-bg px-[18px] pt-5 pb-8 split:mt-0 split:justify-center split:rounded-none split:px-10 split:py-7">
          <Toolbar />
          <AuthCard notify={show} />
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
