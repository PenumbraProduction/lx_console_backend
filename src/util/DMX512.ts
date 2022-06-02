export const isWithinRange = (val, min=0, max=255) => val <= max && val >= min;

export const clamp = (val, min=0, max=255) => Math.min(Math.max(val, min), max);
