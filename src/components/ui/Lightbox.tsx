import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setVisible(false);
        setTimeout(onClose, 250);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-opacity duration-250 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.92)", cursor: "default" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[85vh] max-w-[90vw] transition-all duration-250 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[85vh] max-w-[90vw] object-contain"
          style={{ cursor: "zoom-out" }}
        />
        <button
          onClick={handleClose}
          aria-label="Cerrar visor"
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center border border-paper/30 bg-bg-hero text-paper transition-colors hover:border-accent hover:text-accent"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 0.5rem) 0, 100% 0.5rem, 100% 100%, 0.5rem 100%, 0 calc(100% - 0.5rem))",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
