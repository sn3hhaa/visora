"use client";

import * as React from "react";
import { Sliders, X } from "lucide-react";

interface CameraSettingsProps {
  selectedId: string | null;
  onSelect: (deviceId: string | null) => void;
  onClose: () => void;
}

export function CameraSettings({ selectedId, onSelect, onClose }: CameraSettingsProps) {
  const [cameras, setCameras] = React.useState<MediaDeviceInfo[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    // Device labels are only exposed after the user has granted camera permission.
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        if (!cancelled) setCameras(devices.filter((device) => device.kind === "videoinput"));
      })
      .catch(() => {
        if (!cancelled) setCameras([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-settings-title"
        className="bg-white border border-[#EAE4DA] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#A25A24]" />
            <h3 id="camera-settings-title" className="text-sm font-bold text-[#141414]">
              Camera
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-[#78736A] hover:text-[#141414] hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <label htmlFor="camera-select" className="font-semibold text-[#5C564E]">
            Video input
          </label>
          {cameras === null ? (
            <span className="text-[#8E887E]">Looking for cameras…</span>
          ) : cameras.length === 0 ? (
            <span className="text-[#8E887E]">No camera found.</span>
          ) : (
            <select
              id="camera-select"
              value={selectedId ?? ""}
              onChange={(event) => onSelect(event.target.value || null)}
              className="px-3 py-2 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            >
              <option value="">System default</option>
              {cameras.map((camera, index) => (
                <option key={camera.deviceId || index} value={camera.deviceId}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <p className="text-[11px] leading-relaxed text-[#78736A] border-t border-[#F0ECE4] pt-3">
          Your camera feed is shown only on this device as a practice aid. It is not recorded or sent to the server.
          Voice answers are not available yet, so the microphone is never accessed.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#141414] hover:bg-[#2C332A] text-white py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
