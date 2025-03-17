
import { Trial, Response } from "../IATTypes";

export interface BlockState {
  currentBlock: number;
  trials: Trial[];
  currentTrial: number;
  responses: Response[];
  showInstructions: boolean;
  isBlockStarted: boolean;
  showCategoryChangeAlert: boolean;
}

export interface BlockActions {
  setShowCategoryChangeAlert: (show: boolean) => void;
  handleTrialComplete: (response: Response) => void;
  handleStartBlock: () => void;
  handleCloseAlert: () => void;
}

export interface BlockManagerProps {
  testModel: "A" | "B";
}

export interface BlockCompletionHandler {
  (result: number, allResponses: Response[], model: "A" | "B"): void;
}
