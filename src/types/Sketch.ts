// A sketch that doesn't respond to touch simply leaves out the touch text
export interface SketchHint {
  mouse: string;
  touch?: string;
}

export interface Sketch {
  id: string;
  title: string;
  author: string;
  thumbnailURL: string;
  component: React.ComponentType;
  description?: string;
  technologies?: string[];
  sourceCodeUrl?: string;
  hint?: SketchHint;
}

// What a sketch declares in its own meta.ts; the rest comes from its folder
export interface SketchMeta extends Omit<Sketch, "id" | "author" | "sourceCodeUrl" | "component"> {
  order: number; // higher numbers are listed first
  author?: string; // defaults to Sagar
  load: () => Promise<{ default: React.ComponentType }>; // keeps the sketch and its dependencies out of the initial download
}
