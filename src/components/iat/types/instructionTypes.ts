
export interface BlockInstructions {
  title: string;
  description: string | string[];
  leftKey: string;
  rightKey: string;
  reminder?: string[];
  showPositiveAttributes?: boolean;
  showNegativeAttributes?: boolean;
}

export interface IATInstructionsProps {
  block: number;
  onStart: () => void;
  testModel?: "A" | "B";
}
