import { type CSSProperties, useEffect } from "react";
import { DEFAULT_ALIGN_BY, DEFAULT_GAP } from "../constants";
import { useKubbe } from "../hooks/useKubbe";
import type { ImageRenderProps, KubbeStripProps } from "../types";
import { getVisualCenterTransform } from "../utils/getVisualCenterTransform";

function DefaultImage(props: ImageRenderProps) {
  return <img {...props} />;
}

export function KubbeStrip({
  logos,
  baseSize,
  scaleFactor,
  contrastThreshold,
  densityAware,
  densityFactor,
  cropToContent,
  alignBy = DEFAULT_ALIGN_BY,
  gap = DEFAULT_GAP,
  renderImage,
  className,
  style,
  onNormalized,
}: KubbeStripProps) {
  const { isLoading, isReady, normalizedLogos, error } = useKubbe({
    logos,
    baseSize,
    scaleFactor,
    contrastThreshold,
    densityAware,
    densityFactor,
    cropToContent,
  });

  const ImageComponent = renderImage || DefaultImage;

  useEffect(() => {
    if (isReady && onNormalized) {
      onNormalized(normalizedLogos);
    }
  }, [isReady, normalizedLogos, onNormalized]);

  const halfGap = typeof gap === "number" ? `${gap / 2}px` : `calc(${gap} / 2)`;

  const containerStyle: CSSProperties = {
    textAlign: "center",
    textWrap: "balance",
    ...style,
  };

  if (error) {
    return null;
  }

  return (
    <div
      className={className}
      style={containerStyle}
      data-kubbe-loading={isLoading}
    >
      {normalizedLogos.map((logo, index) => {
        const transform = getVisualCenterTransform(logo, alignBy);

        return (
          <span
            key={`${logo.src}-${index}`}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              padding: halfGap,
              opacity: isLoading ? 0 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <ImageComponent
              src={logo.croppedSrc || logo.src}
              alt={logo.alt}
              width={logo.normalizedWidth}
              height={logo.normalizedHeight}
              style={{
                display: "block",
                width: logo.normalizedWidth,
                height: logo.normalizedHeight,
                objectFit: "contain",
                transform,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
