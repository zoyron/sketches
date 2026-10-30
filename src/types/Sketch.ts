export interface Sketch {
  id: string;
  title: string;
  author: string;
  thumbnailURL: string;
  component: React.ComponentType;
  description?: string;
  technologies?: string[];
  sourceCodeUrl?: string;
}

// What a sketch declares in its own meta.ts; the rest comes from its folder
export interface SketchMeta extends Omit<Sketch, "id" | "author" | "sourceCodeUrl"> {
  order: number; // higher numbers are listed first
  author?: string; // defaults to Sagar
}
