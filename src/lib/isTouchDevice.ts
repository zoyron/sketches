// True where the main pointer can't hover, so mouse-move interactions and wording don't apply
export const isTouchDevice = () => window.matchMedia("(hover: none)").matches;
