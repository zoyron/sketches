/**
 * Utility for determining optimal rendering parameters based on device capabilities
 */

export interface DeviceCapabilities {
  tier: 'low' | 'mid' | 'high';
  particleMultiplier: number;
  shadowQuality: 'off' | 'low' | 'high';
  pixelRatioMax: number;
}

export const getDeviceCapabilities = (): DeviceCapabilities => {
  // Check if mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Get device metrics
  const pixelRatio = window.devicePixelRatio || 1;
  const canvasArea = window.innerWidth * window.innerHeight;
  const cores = navigator.hardwareConcurrency || 2;

  // Detect low-end devices
  const isLowEnd =
    isMobile ||
    cores < 4 ||
    canvasArea < 1000000 || // Less than ~1000x1000
    pixelRatio < 2;

  // Detect mid-range devices
  const isMidRange =
    !isLowEnd &&
    (cores < 8 || canvasArea < 2000000 || pixelRatio < 3);

  // Determine tier
  if (isLowEnd) {
    return {
      tier: 'low',
      particleMultiplier: 0.2, // 20% of particles
      shadowQuality: 'off',
      pixelRatioMax: 1.5
    };
  } else if (isMidRange) {
    return {
      tier: 'mid',
      particleMultiplier: 0.5, // 50% of particles
      shadowQuality: 'low',
      pixelRatioMax: 2
    };
  } else {
    return {
      tier: 'high',
      particleMultiplier: 1.0, // 100% of particles
      shadowQuality: 'high',
      pixelRatioMax: 2
    };
  }
};

export const getOptimalParticleCount = (maxCount: number): number => {
  const { particleMultiplier } = getDeviceCapabilities();
  return Math.floor(maxCount * particleMultiplier);
};

export const getOptimalPixelRatio = (): number => {
  const { pixelRatioMax } = getDeviceCapabilities();
  return Math.min(window.devicePixelRatio, pixelRatioMax);
};