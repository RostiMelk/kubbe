import { useEffect, type CSSProperties } from "react";
import type { KubbeStripProps, ImageRenderProps } from "./types";
import { useKubbe } from "./useKubbe";

const DEFAULT_GAP = 16;

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
  });

  const ImageComponent = renderImage || DefaultImage;

  useEffect(() => {
    if (isReady && onNormalized) {
      onNormalized(normalizedLogos);
    }
  }, [isReady, normalizedLogos, onNormalized]);

  const gapValue = typeof gap === "number" ? `${gap}px` : gap;
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
      {normalizedLogos.map((logo, index) => (
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
            src={logo.src}
            alt={logo.alt}
            width={logo.normalizedWidth}
            height={logo.normalizedHeight}
            style={{
              display: "block",
              width: logo.normalizedWidth,
              height: logo.normalizedHeight,
              objectFit: "contain",
            }}
          />
        </span>
      ))}
    </div>
  );
}
