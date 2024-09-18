export interface Sketch {
  id: string;
  title: string;
  author: string;
  thumbnailURL: string;
  sketchFunction: () => void;
}
