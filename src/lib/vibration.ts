export const vibrate = {
  light: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    } catch {
    }
  },
  ripple: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([8, 40, 8]);
    } catch {
    }
  },
};
