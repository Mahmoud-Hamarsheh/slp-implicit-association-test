
import { Trial, BLOCKS, getCorrectKeyForBlock } from "./IATTypes";

export class TrialGenerator {
  static generateTrialsForBlock(block: number): Trial[] {
    let newTrials: Trial[] = [];
    
    switch (block) {
      case 1:
      case 4:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(block, "communication_disorder"),
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(block, "normal_communication"),
            block: block
          }))
        ];
        break;
      case 2:
      case 5:
        newTrials = [
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(block, "negative"),
            block: block
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(block, "positive"),
            block: block
          }))
        ];
        break;
      case 3:
      case 6:
      case 7:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(block, "communication_disorder"),
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(block, "normal_communication"),
            block: block
          })),
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(block, "negative"),
            block: block
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(block, "positive"),
            block: block
          }))
        ];
        break;
    }
    
    // Randomize the order of trials
    return newTrials.sort(() => Math.random() - 0.5);
  }
}
