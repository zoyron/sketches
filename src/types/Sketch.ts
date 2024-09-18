export interface Sketch {
  id: number;
  title: string;
  author: string;
  thumbnailURL: string;
  sketchFunction: () => void;
}
