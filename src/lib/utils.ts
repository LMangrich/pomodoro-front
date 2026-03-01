import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import tailwindConfig from "../../tailwind.config";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: Object.keys(tailwindConfig.theme?.extend?.fontSize ?? {}),
        },
      ],
      "font-weight": [
        {
          font: Object.keys(tailwindConfig.theme?.extend?.fontWeight ?? {}),
        },
      ],
      "font-family": [
        {
          font: Object.keys(tailwindConfig.theme?.extend?.fontFamily ?? {}),
        },
      ],
      "text-color": [
        {
          text: Object.keys(tailwindConfig.theme?.extend?.colors ?? {}),
        },
      ],
      "bg-color": [
        {
          bg: Object.keys(tailwindConfig.theme?.extend?.colors ?? {}),
        },
      ],
      fill: [
        {
          fill: Object.keys(tailwindConfig.theme?.extend?.fill ?? {}),
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
