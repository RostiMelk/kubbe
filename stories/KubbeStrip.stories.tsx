import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import {
  DEFAULT_BASE_SIZE,
  DEFAULT_DENSITY_FACTOR,
  DEFAULT_GAP,
  DEFAULT_SCALE_FACTOR,
} from "../src/constants";
import { KubbeStrip } from "../src/KubbeStrip";
import type { AlignmentMode } from "../src/types";

const allLogos = [
  new URL("./logos/aether.svg", import.meta.url).href,
  new URL("./logos/athena.svg", import.meta.url).href,
  new URL("./logos/browser-comp.svg", import.meta.url).href,
  new URL("./logos/burlington.svg", import.meta.url).href,
  new URL("./logos/carhartt-wip.svg", import.meta.url).href,
  new URL("./logos/clerk.svg", import.meta.url).href,
  new URL("./logos/coda.svg", import.meta.url).href,
  new URL("./logos/commerce-ui.svg", import.meta.url).href,
  new URL("./logos/conductor.svg", import.meta.url).href,
  new URL("./logos/cursor.svg", import.meta.url).href,
  new URL("./logos/customer.io.svg", import.meta.url).href,
  new URL("./logos/dbt.svg", import.meta.url).href,
  new URL("./logos/dom-perignon.svg", import.meta.url).href,
  new URL("./logos/elemeno-health.svg", import.meta.url).href,
  new URL("./logos/eurostar.svg", import.meta.url).href,
  new URL("./logos/expedia.svg", import.meta.url).href,
  new URL("./logos/fanduel.svg", import.meta.url).href,
  new URL("./logos/fnatic.svg", import.meta.url).href,
  new URL("./logos/frame.svg", import.meta.url).href,
  new URL("./logos/frontier.svg", import.meta.url).href,
  new URL("./logos/gaga.svg", import.meta.url).href,
  new URL("./logos/gala-games.svg", import.meta.url).href,
  new URL("./logos/gfinity.svg", import.meta.url).href,
  new URL("./logos/good-american.svg", import.meta.url).href,
  new URL("./logos/hinge.svg", import.meta.url).href,
  new URL("./logos/hipp.svg", import.meta.url).href,
  new URL("./logos/hunter-douglas.svg", import.meta.url).href,
  new URL("./logos/kahoot.svg", import.meta.url).href,
  new URL("./logos/keystone.svg", import.meta.url).href,
  new URL("./logos/lift-foil.svg", import.meta.url).href,
  new URL("./logos/loveholidays.svg", import.meta.url).href,
  new URL("./logos/lvmh.svg", import.meta.url).href,
  new URL("./logos/mejuri.svg", import.meta.url).href,
  new URL("./logos/metacore.svg", import.meta.url).href,
  new URL("./logos/mr-marvis.svg", import.meta.url).href,
  new URL("./logos/new-day.svg", import.meta.url).href,
  new URL("./logos/nordstrom.svg", import.meta.url).href,
  new URL("./logos/nour-hammour.svg", import.meta.url).href,
  new URL("./logos/paytronix.svg", import.meta.url).href,
  new URL("./logos/pinecone.svg", import.meta.url).href,
  new URL("./logos/poc.svg", import.meta.url).href,
  new URL("./logos/powerhouse.svg", import.meta.url).href,
  new URL("./logos/primary-bid.svg", import.meta.url).href,
  new URL("./logos/rad-power-bikes.svg", import.meta.url).href,
  new URL("./logos/redis.svg", import.meta.url).href,
  new URL("./logos/reforge.svg", import.meta.url).href,
  new URL("./logos/render.svg", import.meta.url).href,
  new URL("./logos/replit.svg", import.meta.url).href,
  new URL("./logos/retool.svg", import.meta.url).href,
  new URL("./logos/rich-brilliant-lighting.svg", import.meta.url).href,
  new URL("./logos/rikstv.svg", import.meta.url).href,
  new URL("./logos/rona.svg", import.meta.url).href,
  new URL("./logos/samsung.svg", import.meta.url).href,
  new URL("./logos/scalapay.svg", import.meta.url).href,
  new URL("./logos/siemens.svg", import.meta.url).href,
  new URL("./logos/spanx.svg", import.meta.url).href,
  new URL("./logos/stereolabs.svg", import.meta.url).href,
  new URL("./logos/summersalt.svg", import.meta.url).href,
  new URL("./logos/supreme.svg", import.meta.url).href,
  new URL("./logos/too-good-to-go.svg", import.meta.url).href,
  new URL("./logos/tula.svg", import.meta.url).href,
  new URL("./logos/unity.svg", import.meta.url).href,
  new URL("./logos/wetransfer.svg", import.meta.url).href,
];

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomValue: number;

  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    randomValue = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomValue]] = [
      shuffled[randomValue],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

function KubbeStripPlayground({
  count,
  shuffleSeed,
  baseSize,
  scaleFactor,
  densityAware,
  densityFactor,
  cropToContent,
  alignBy,
  gap,
}: {
  count: number;
  shuffleSeed: number;
  baseSize: number;
  scaleFactor: number;
  densityAware: boolean;
  densityFactor: number;
  cropToContent: boolean;
  alignBy: AlignmentMode;
  gap: number;
}) {
  const logos = useMemo(() => {
    const shuffled = shuffleArray(allLogos, shuffleSeed);
    return shuffled.slice(0, count);
  }, [count, shuffleSeed]);

  return (
    <KubbeStrip
      logos={logos}
      baseSize={baseSize}
      scaleFactor={scaleFactor}
      densityAware={densityAware}
      densityFactor={densityFactor}
      cropToContent={cropToContent}
      alignBy={alignBy}
      gap={gap}
    />
  );
}

const meta: Meta = {
  title: "KubbeStrip",
  component: KubbeStripPlayground,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    count: {
      name: "Count",
      control: { type: "range", min: 1, max: allLogos.length, step: 1 },
      description: "Number of logos to display",
    },
    shuffleSeed: {
      name: "Shuffle Seed",
      control: { type: "range", min: 1, max: 1000, step: 1 },
      description: "Shuffle seed (change to randomize logo order)",
    },
    baseSize: {
      name: "Base Size",
      control: { type: "range", min: 16, max: 128, step: 4 },
      description: "Base size for normalization",
    },
    scaleFactor: {
      name: "Scale Factor",
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        "Scale factor (0 = uniform widths, 0.5 = balanced, 1 = uniform heights)",
    },
    densityAware: {
      name: "Density Aware",
      control: "boolean",
      description: "Enable pixel density compensation",
    },
    densityFactor: {
      name: "Density Factor",
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        "How much density affects sizing (0 = no effect, 1 = full effect)",
    },
    cropToContent: {
      name: "Crop to Content",
      control: "boolean",
      description:
        "Crop logos to their content bounds (returns base64 cropped images)",
    },
    alignBy: {
      name: "Align By",
      control: "select",
      options: ["bounds", "visual-center"],
      description:
        "Alignment mode: bounds (geometric center) or visual-center (weighted center)",
    },
    gap: {
      name: "Gap",
      control: { type: "range", min: 0, max: 48, step: 4 },
      description: "Gap between logos",
    },
  },
};

export default meta;

type Story = StoryObj<typeof KubbeStripPlayground>;

export const Playground: Story = {
  args: {
    count: allLogos.length / 4,
    shuffleSeed: 42,
    baseSize: DEFAULT_BASE_SIZE,
    scaleFactor: DEFAULT_SCALE_FACTOR,
    densityAware: true,
    densityFactor: DEFAULT_DENSITY_FACTOR,
    cropToContent: false,
    alignBy: "visual-center",
    gap: DEFAULT_GAP,
  },
};
