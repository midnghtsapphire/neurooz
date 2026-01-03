import { useState, useEffect, useCallback } from "react";

export interface DeviceSensorState {
  // Motion sensors
  isMoving: boolean;
  movementIntensity: "still" | "gentle" | "active" | "agitated";
  
  // Time-based context
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  
  // Device state
  batteryLevel: number | null;
  isCharging: boolean;
  
  // Ambient light (if available)
  ambientLight: "dark" | "dim" | "normal" | "bright" | null;
  
  // Orientation
  orientation: "portrait" | "landscape";
  
  // Network
  isOnline: boolean;
  connectionType: string | null;
  
  // Suggested adaptations based on sensors
  suggestedMode: "flow" | "power" | "recovery" | null;
  adaptationReason: string | null;
}

const getTimeOfDay = (): DeviceSensorState["timeOfDay"] => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

export function useDeviceSensors(): DeviceSensorState {
  const [state, setState] = useState<DeviceSensorState>({
    isMoving: false,
    movementIntensity: "still",
    timeOfDay: getTimeOfDay(),
    batteryLevel: null,
    isCharging: false,
    ambientLight: null,
    orientation: "portrait",
    isOnline: navigator.onLine,
    connectionType: null,
    suggestedMode: null,
    adaptationReason: null,
  });

  // Motion detection via DeviceMotion API
  useEffect(() => {
    let movementBuffer: number[] = [];
    const BUFFER_SIZE = 10;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      movementBuffer.push(magnitude);
      if (movementBuffer.length > BUFFER_SIZE) {
        movementBuffer.shift();
      }

      const avgMagnitude = movementBuffer.reduce((a, b) => a + b, 0) / movementBuffer.length;
      const variance = movementBuffer.reduce((acc, val) => acc + (val - avgMagnitude) ** 2, 0) / movementBuffer.length;

      let intensity: DeviceSensorState["movementIntensity"] = "still";
      if (variance > 50) intensity = "agitated";
      else if (variance > 20) intensity = "active";
      else if (variance > 5) intensity = "gentle";

      setState((prev) => ({
        ...prev,
        isMoving: variance > 3,
        movementIntensity: intensity,
      }));
    };

    if ("DeviceMotionEvent" in window) {
      // @ts-ignore - requestPermission is iOS-specific
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        // iOS requires permission - will be requested on user interaction
      } else {
        window.addEventListener("devicemotion", handleMotion);
      }
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  // Battery API
  useEffect(() => {
    const updateBattery = async () => {
      try {
        // @ts-ignore - Battery API
        const battery = await navigator.getBattery?.();
        if (battery) {
          const update = () => {
            setState((prev) => ({
              ...prev,
              batteryLevel: Math.round(battery.level * 100),
              isCharging: battery.charging,
            }));
          };
          update();
          battery.addEventListener("levelchange", update);
          battery.addEventListener("chargingchange", update);
        }
      } catch (e) {
        // Battery API not supported
      }
    };
    updateBattery();
  }, []);

  // Ambient Light Sensor
  useEffect(() => {
    try {
      // @ts-ignore - AmbientLightSensor API
      if ("AmbientLightSensor" in window) {
        // @ts-ignore
        const sensor = new AmbientLightSensor();
        sensor.addEventListener("reading", () => {
          const lux = sensor.illuminance;
          let light: DeviceSensorState["ambientLight"] = "normal";
          if (lux < 10) light = "dark";
          else if (lux < 50) light = "dim";
          else if (lux > 10000) light = "bright";

          setState((prev) => ({ ...prev, ambientLight: light }));
        });
        sensor.start();
      }
    } catch (e) {
      // Sensor not available
    }
  }, []);

  // Orientation
  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setState((prev) => ({
        ...prev,
        orientation: isPortrait ? "portrait" : "landscape",
      }));
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  // Network status
  useEffect(() => {
    const updateNetwork = () => {
      const connection = (navigator as any).connection;
      setState((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
        connectionType: connection?.effectiveType || null,
      }));
    };

    updateNetwork();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
    };
  }, []);

  // Time of day updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({ ...prev, timeOfDay: getTimeOfDay() }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate suggested mode based on sensor data
  useEffect(() => {
    let suggestedMode: DeviceSensorState["suggestedMode"] = null;
    let adaptationReason: string | null = null;

    // Late night + low battery = Recovery Mode
    if (state.timeOfDay === "night" && state.batteryLevel !== null && state.batteryLevel < 30) {
      suggestedMode = "recovery";
      adaptationReason = "Late night + low battery detected";
    }
    // Agitated movement = suggest Flow Mode (calming)
    else if (state.movementIntensity === "agitated") {
      suggestedMode = "flow";
      adaptationReason = "High movement detected - Flow Mode may help focus";
    }
    // Dark ambient + night = Recovery Mode
    else if (state.ambientLight === "dark" && state.timeOfDay === "night") {
      suggestedMode = "recovery";
      adaptationReason = "Dark environment detected";
    }
    // Morning + charging + still = Power Mode ready
    else if (state.timeOfDay === "morning" && state.isCharging && state.movementIntensity === "still") {
      suggestedMode = "power";
      adaptationReason = "Morning focus window detected";
    }

    setState((prev) => ({ ...prev, suggestedMode, adaptationReason }));
  }, [state.timeOfDay, state.batteryLevel, state.movementIntensity, state.ambientLight, state.isCharging]);

  return state;
}

// Hook to request motion permission on iOS
export function useRequestMotionPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    // @ts-ignore - iOS-specific
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        // @ts-ignore
        const permission = await DeviceMotionEvent.requestPermission();
        setHasPermission(permission === "granted");
        return permission === "granted";
      } catch (e) {
        setHasPermission(false);
        return false;
      }
    }
    // Non-iOS - permission not required
    setHasPermission(true);
    return true;
  }, []);

  return { hasPermission, requestPermission };
}
