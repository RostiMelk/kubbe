import { type CSSProperties, useEffect } from "react";
import { DEFAULT_GAP } from "./constants";
import type { ImageRenderProps, KubbeStripProps } from "./types";
import { useKubbe } from "./useKubbe";

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
  alignBy = "bounds",
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
        let transform: string | undefined;

        if (alignBy === "visual-center" && logo.visualCenter) {
          const scaleX =
            logo.normalizedWidth /
            (logo.contentBox?.width || logo.originalWidth);
          const scaleY =
            logo.normalizedHeight /
            (logo.contentBox?.height || logo.originalHeight);

          const offsetX = -logo.visualCenter.offsetX * scaleX;
          const offsetY = -logo.visualCenter.offsetY * scaleY;

          if (Math.abs(offsetX) > 0.5 || Math.abs(offsetY) > 0.5) {
            transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
          }
        }

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
