export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || "marketplace";
export const SINGLE_BARBER_SLUG =
  process.env.NEXT_PUBLIC_SINGLE_BARBER_SLUG || "luccifadez";
export const IS_SINGLE_MODE = APP_MODE === "single";
export const IS_MARKETPLACE_MODE = APP_MODE === "marketplace";

export const APP_NAME = "LubooKing";
export const APP_DESCRIPTION =
  "Professional booking platform for barbers - Create your online presence in minutes";
