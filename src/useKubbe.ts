import { useState, useEffect, useRef } from "react";
import type {
  UseKubbeOptions,
  UseKubbeResult,
  NormalizedLogo,
  LogoSource,
} from "./types";
import { loadImage, measureWithContentDetection } from "./measure";
import { normalizeSource, createNormalizedLogo } from "./normalize";

const DEFAULT_BASE_SIZE = 48;
const DEFAULT_SCALE_FACTOR = 0.5;
const DEFAULT_CONTRAST_THRESHOLD = 10;
const DEFAULT_DENSITY_FACTOR = 0.5;

function getLogosKey(logos: (string | LogoSource)[]): string {
  return logos
    .map((logo) => (typeof logo === "string" ? logo : logo.src))
    .join("|");
}

export function useKubbe(options: UseKubbeOptions): UseKubbeResult {
  const {
    logos,
    baseSize = DEFAULT_BASE_SIZE,
    scaleFactor = DEFAULT_SCALE_FACTOR,
    contrastThreshold = DEFAULT_CONTRAST_THRESHOLD,
    densityAware = true,
    densityFactor = DEFAULT_DENSITY_FACTOR,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [normalizedLogos, setNormalizedLogos] = useState<NormalizedLogo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const logosRef = useRef(logos);
  const logosKey = getLogosKey(logos);

  useEffect(() => {
    logosRef.current = logos;
  }, [logosKey]);

  useEffect(() => {
    const currentLogos = logosRef.current;

    if (currentLogos.length === 0) {
      setIsLoading(false);
      setNormalizedLogos([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function processLogos() {
      try {
        const sources: LogoSource[] = currentLogos.map(normalizeSource);
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
    logosKey,
    baseSize,
    scaleFactor,
    contrastThreshold,
    densityAware,
    densityFactor,
  ]);

  return {
    isLoading,
    isReady: !isLoading && error === null,
    normalizedLogos,
    error,
  };
}
