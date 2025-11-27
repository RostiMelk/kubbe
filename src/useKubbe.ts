import { useEffect, useState } from "react";
import {
  DEFAULT_BASE_SIZE,
  DEFAULT_CONTRAST_THRESHOLD,
  DEFAULT_DENSITY_FACTOR,
  DEFAULT_SCALE_FACTOR,
} from "./constants";
import {
  cropToDataUrl,
  loadImage,
  measureWithContentDetection,
} from "./measure";
import { createNormalizedLogo, normalizeSource } from "./normalize";
import type {
  LogoSource,
  NormalizedLogo,
  UseKubbeOptions,
  UseKubbeResult,
} from "./types";

export function useKubbe(options: UseKubbeOptions): UseKubbeResult {
  const {
    logos,
    baseSize = DEFAULT_BASE_SIZE,
    scaleFactor = DEFAULT_SCALE_FACTOR,
    contrastThreshold = DEFAULT_CONTRAST_THRESHOLD,
    densityAware = true,
    densityFactor = DEFAULT_DENSITY_FACTOR,
    cropToContent = false,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [normalizedLogos, setNormalizedLogos] = useState<NormalizedLogo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (logos.length === 0) {
      setIsLoading(false);
      setNormalizedLogos([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function processLogos() {
      try {
        const sources: LogoSource[] = logos.map(normalizeSource);
        const results: NormalizedLogo[] = [];

        for (const source of sources) {
          if (cancelled) return;

          const img = await loadImage(source.src);
          const measurement = measureWithContentDetection(
            img,
            contrastThreshold,
            densityAware,
          );

          const effectiveDensityFactor = densityAware ? densityFactor : 0;

          const normalized = createNormalizedLogo(
            source,
            measurement,
            baseSize,
            scaleFactor,
            effectiveDensityFactor,
          );

          if (cropToContent && measurement.contentBox) {
            normalized.croppedSrc = cropToDataUrl(img, measurement.contentBox);
          }

          results.push(normalized);
        }

        if (!cancelled) {
          setNormalizedLogos(results);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    }

    processLogos();

    return () => {
      cancelled = true;
    };
  }, [
    logos,
    baseSize,
    scaleFactor,
    contrastThreshold,
    densityAware,
    densityFactor,
    cropToContent,
  ]);

  return {
    isLoading,
    isReady: !isLoading && error === null,
    normalizedLogos,
    error,
  };
}
