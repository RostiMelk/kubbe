import type { BoundingBox, MeasurementResult } from "./types";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export function measureImage(img: HTMLImageElement): MeasurementResult {
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

export function detectContentBoundingBox(
  img: HTMLImageElement,
  contrastThreshold: number = 10,
): BoundingBox {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      const hasAlpha = a > contrastThreshold;
      const hasContrast =
        Math.abs(r - 255) > contrastThreshold ||
        Math.abs(g - 255) > contrastThreshold ||
        Math.abs(b - 255) > contrastThreshold;

      if (hasAlpha && hasContrast) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export function measurePixelDensity(
  img: HTMLImageElement,
  contentBox?: BoundingBox,
  contrastThreshold: number = 10,
): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return 0.5;
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const box = contentBox || {
    x: 0,
    y: 0,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };

  const imageData = ctx.getImageData(box.x, box.y, box.width, box.height);
  const { data, width, height } = imageData;

  let filledPixels = 0;
  let totalWeightedOpacity = 0;
  const totalPixels = width * height;

  if (totalPixels === 0) {
    return 0.5;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      const hasAlpha = a > contrastThreshold;
      const hasContrast =
        Math.abs(r - 255) > contrastThreshold ||
        Math.abs(g - 255) > contrastThreshold ||
        Math.abs(b - 255) > contrastThreshold;

      if (hasAlpha && hasContrast) {
        filledPixels++;
        totalWeightedOpacity += a / 255;
      }
    }
  }

  const coverageRatio = filledPixels / totalPixels;
  const averageOpacity =
    filledPixels > 0 ? totalWeightedOpacity / filledPixels : 0;
  const density = coverageRatio * averageOpacity;

  return density;
}

export function measureWithContentDetection(
  img: HTMLImageElement,
  contrastThreshold: number = 10,
  includeDensity: boolean = false,
): MeasurementResult {
  const basic = measureImage(img);
  const contentBox = detectContentBoundingBox(img, contrastThreshold);

  const result: MeasurementResult = {
    ...basic,
    contentBox,
  };

  if (includeDensity) {
    result.pixelDensity = measurePixelDensity(
      img,
      contentBox,
      contrastThreshold,
    );
  }

  return result;
}
