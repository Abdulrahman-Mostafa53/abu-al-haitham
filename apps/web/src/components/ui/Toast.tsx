interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      role="status"
      className={`pointer-events-none fixed inset-x-4 bottom-[calc(20px+env(safe-area-inset-bottom,0px))] z-20 mx-auto max-w-[420px] rounded-[14px] bg-ink px-4 py-3 text-[.9rem] font-semibold text-bg transition duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
