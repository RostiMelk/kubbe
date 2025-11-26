import type { CSSProperties, ReactNode, ImgHTMLAttributes } from "react";

export interface LogoSource {
  src: string;
  alt?: string;
}

export interface NormalizedLogo {
  src: string;
  alt: string;
  originalWidth: number;
  originalHeight: number;
  contentBox?: BoundingBox;
  normalizedWidth: number;
  normalizedHeight: number;
  aspectRatio: number;
  pixelDensity?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MeasurementResult {
  width: number;
  height: number;
  contentBox?: BoundingBox;
  pixelDensity?: number;
}

export type ImageRenderProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: CSSProperties;
};

export type RenderImageFn = (props: ImageRenderProps) => ReactNode;

export interface UseKubbeOptions {
  logos: (string | LogoSource)[];
  baseSize?: number;
  scaleFactor?: number;
  contrastThreshold?: number;
  densityAware?: boolean;
  densityFactor?: number;
}

export interface UseKubbeResult {
  isLoading: boolean;
  isReady: boolean;
  normalizedLogos: NormalizedLogo[];
  error: Error | null;
}

export interface KubbeStripProps {
  logos: (string | LogoSource)[];
  baseSize?: number;
  scaleFactor?: number;
  contrastThreshold?: number;
  densityAware?: boolean;
  densityFactor?: number;
  gap?: number | string;
  renderImage?: RenderImageFn;
  className?: string;
  style?: CSSProperties;
  onNormalized?: (logos: NormalizedLogo[]) => void;
}
