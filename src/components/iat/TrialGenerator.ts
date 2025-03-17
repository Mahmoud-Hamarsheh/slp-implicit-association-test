
import { Trial, BLOCKS, getCorrectKeyForBlock } from "./IATTypes";

export class TrialGenerator {
  static generateTrialsForBlock(block: number, testModel: "A" | "B" = "A"): Trial[] {
    let newTrials: Trial[] = [];
    
    // For Model B, we need to adjust certain blocks
    switch (block) {
      case 1:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(block, "communication_disorder", testModel),
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(block, "normal_communication", testModel),
            block: block
          }))
        ];
        break;
      case 2:
      case 5:
        // For Model B, blocks 2 and 5 are swapped
        const isAttributeBlock = (testModel === "A" && block === 2) || (testModel === "B" && block === 5);
        if (isAttributeBlock) {
          newTrials = [
            ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
              stimulus: item,
              category: "negative",
              correctKey: getCorrectKeyForBlock(block, "negative", testModel),
              block: block,
              isImage: true
            })),
            ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
              stimulus: item,
              category: "positive",
              correctKey: getCorrectKeyForBlock(block, "positive", testModel),
              block: block,
              isImage: true
            }))
          ];
        } else {
          // This is for combined blocks (Model B block 2 or Model A block 5)
          newTrials = [
            ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
              stimulus: item,
              category: "communication_disorder",
              correctKey: getCorrectKeyForBlock(block, "communication_disorder", testModel),
              block: block
            })),
            ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
              stimulus: item,
              category: "normal_communication",
              correctKey: getCorrectKeyForBlock(block, "normal_communication", testModel),
              block: block
            })),
            ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
              stimulus: item,
              category: "negative",
              correctKey: getCorrectKeyForBlock(block, "negative", testModel),
              block: block,
              isImage: true
            })),
            ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
              stimulus: item,
              category: "positive",
              correctKey: getCorrectKeyForBlock(block, "positive", testModel),
              block: block,
              isImage: true
            }))
          ];
        }
        break;
      case 3:
      case 4:
      case 6:
      case 7:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(block, "communication_disorder", testModel),
            block: block
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(block, "normal_communication", testModel),
            block: block
          })),
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(block, "negative", testModel),
            block: block,
            isImage: true
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(block, "positive", testModel),
            block: block,
            isImage: true
          }))
        ];
        break;
    }
    
    // Randomize the order of trials
    return newTrials.sort(() => Math.random() - 0.5);
  }
}
