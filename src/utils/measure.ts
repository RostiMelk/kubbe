import type { BoundingBox, MeasurementResult, VisualCenter } from "../types";

export function cropToDataUrl(
  img: HTMLImageElement,
  contentBox: BoundingBox,
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return img.src;
  }

  canvas.width = contentBox.width;
  canvas.height = contentBox.height;

  ctx.drawImage(
    img,
    contentBox.x,
    contentBox.y,
    contentBox.width,
    contentBox.height,
    0,
    0,
    contentBox.width,
    contentBox.height,
  );

  return canvas.toDataURL("image/png");
}

interface BackgroundColor {
  r: number;
  g: number;
  b: number;
}

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

function isContentPixel(
  r: number,
  g: number,
  b: number,
  a: number,
  background: BackgroundColor,
  contrastThreshold: number,
): boolean {
  const hasAlpha = a > contrastThreshold;
  const hasContrast =
    Math.abs(r - background.r) > contrastThreshold ||
    Math.abs(g - background.g) > contrastThreshold ||
    Math.abs(b - background.b) > contrastThreshold;

  return hasAlpha && hasContrast;
}

export function detectContentBoundingBox(
  img: HTMLImageElement,
  contrastThreshold: number = 10,
): { box: BoundingBox; background: BackgroundColor } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const defaultBackground: BackgroundColor = { r: 255, g: 255, b: 255 };

  if (!ctx) {
    return {
      box: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
      background: defaultBackground,
    };
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

      if (isContentPixel(r, g, b, a, defaultBackground, contrastThreshold)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return {
      box: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
      background: defaultBackground,
    };
  }

  return {
    box: {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    },
    background: defaultBackground,
  };
}

export function calculateVisualCenter(
  img: HTMLImageElement,
  contentBox: BoundingBox,
  background: BackgroundColor,
  contrastThreshold: number = 10,
): VisualCenter {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const centerX = contentBox.x + contentBox.width / 2;
  const centerY = contentBox.y + contentBox.height / 2;

  if (!ctx) {
    return { x: centerX, y: centerY, offsetX: 0, offsetY: 0 };
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(
    contentBox.x,
    contentBox.y,
    contentBox.width,
    contentBox.height,
  );
  const { data, width, height } = imageData;

  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;

      if (!isContentPixel(r, g, b, a, background, contrastThreshold)) {
        continue;
      }

      const dr = r - background.r;
      const dg = g - background.g;
      const db = b - background.b;
      const colorDistance = Math.sqrt(dr * dr + dg * dg + db * db);

      const weight = Math.sqrt(colorDistance) * (a / 255);

      totalWeight += weight;
      weightedX += (x + 0.5) * weight;
      weightedY += (y + 0.5) * weight;
    }
  }

  if (totalWeight === 0) {
    return { x: centerX, y: centerY, offsetX: 0, offsetY: 0 };
  }

  const localCenterX = weightedX / totalWeight;
  const localCenterY = weightedY / totalWeight;

  const visualX = contentBox.x + localCenterX;
  const visualY = contentBox.y + localCenterY;

  const geometricCenterX = contentBox.width / 2;
  const geometricCenterY = contentBox.height / 2;

  const offsetX = localCenterX - geometricCenterX;
  const offsetY = localCenterY - geometricCenterY;

  return {
    x: visualX,
    y: visualY,
    offsetX,
    offsetY,
  };
}

export function measurePixelDensity(
  img: HTMLImageElement,
  contentBox?: BoundingBox,
  background?: BackgroundColor,
  contrastThreshold: number = 10,
): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return 0.5;
  }

  const bg = background || { r: 255, g: 255, b: 255 };

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

      if (isContentPixel(r, g, b, a, bg, contrastThreshold)) {
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

  const { box: contentBox, background } = detectContentBoundingBox(
    img,
    contrastThreshold,
  );

  const visualCenter = calculateVisualCenter(
    img,
    contentBox,
    background,
    contrastThreshold,
  );

  const result: MeasurementResult = {
    ...basic,
    contentBox,
    visualCenter,
  };

  if (includeDensity) {
    result.pixelDensity = measurePixelDensity(
      img,
      contentBox,
      background,
      contrastThreshold,
    );
  }

  return result;
}
