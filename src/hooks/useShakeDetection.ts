import { useEffect, useRef } from "react";

export function useShakeDetection(onShake: () => void, threshold = 30) {
  const lastAccel = useRef({ x: 0, y: 0, z: 0 });
  const lastShake = useRef(0);

  useEffect(() => {
    const handler = (e: DeviceMotionEvent) => {
      const accel = e.accelerationIncludingGravity;
      if (!accel?.x || !accel?.y || !accel?.z) return;

      const delta =
        Math.abs(accel.x - lastAccel.current.x) +
        Math.abs(accel.y - lastAccel.current.y) +
        Math.abs(accel.z - lastAccel.current.z);

      lastAccel.current = { x: accel.x, y: accel.y, z: accel.z };

      if (delta > threshold && Date.now() - lastShake.current > 3000) {
        lastShake.current = Date.now();
        onShake();
      }
    };

    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, [onShake, threshold]);
}
