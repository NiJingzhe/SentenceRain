export interface Sentence {
  id: number;
  text: string;
  position: [number, number, number];
  velocity: number;
  opacity: number;
  color: string;
}

export interface ControlParams {
  sentences: string[];
  color: string;
  speed: number;
  density: number;
}