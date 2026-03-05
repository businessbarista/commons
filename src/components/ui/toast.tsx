"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Confetti ────────────────────────────────────────────────────

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#FFA038", "#CD8407", "#E8725C", "#2B8A7E", "#D4A24E"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 3,
        w: Math.random() * 6 + 3,
        h: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          allDone = false;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (!allDone) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── Toast Component ─────────────────────────────────────────────

interface ToastData {
  id: string;
  message: string;
  variant: "success" | "error";
  confetti?: boolean;
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const variantStyles =
    toast.variant === "success"
      ? "bg-[#E8F5EC] text-success border-success/20"
      : "bg-[#FDECEB] text-error border-error/20";

  return (
    <div className="relative overflow-hidden">
      {toast.confetti && <ConfettiCanvas />}
      <div
        role="status"
        aria-live="polite"
        className={`relative z-10 flex items-center gap-2 px-4 py-3 border rounded-[var(--radius-md)] shadow-md ${variantStyles}`}
      >
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="ml-auto p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Toast Context & Provider ────────────────────────────────────

interface ToastContextValue {
  showToast: (
    message: string,
    options?: { variant?: "success" | "error"; confetti?: boolean },
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (
      message: string,
      options?: { variant?: "success" | "error"; confetti?: boolean },
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          variant: options?.variant ?? "success",
          confetti: options?.confetti ?? false,
        },
      ]);
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext>
  );
}
