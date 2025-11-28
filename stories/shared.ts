export const allLogos = [
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

export function shuffleArray<T>(array: T[], seed: number): T[] {
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

export function useLogos(count: number, shuffleSeed: number): string[] {
  const shuffled = shuffleArray(allLogos, shuffleSeed);
  return shuffled.slice(0, count);
}
