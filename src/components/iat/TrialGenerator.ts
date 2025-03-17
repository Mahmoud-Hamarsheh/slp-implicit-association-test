
import { Trial, BLOCKS, getCorrectKeyForBlock } from "./IATTypes";

export class TrialGenerator {
  static generateTrialsForBlock(block: number, testModel: "A" | "B" = "A"): Trial[] {
    let newTrials: Trial[] = [];
    
    // Determine if we're using the original block or swapped block based on test model
    const effectiveBlock = this.getEffectiveBlock(block, testModel);
    
    switch (effectiveBlock) {
      case 1:
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "communication_disorder", testModel),
            block: block,
            effectiveBlock: effectiveBlock
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "normal_communication", testModel),
            block: block,
            effectiveBlock: effectiveBlock
          }))
        ];
        break;
      case 2:
        // Attribute block (positive vs negative)
        newTrials = [
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "negative", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "positive", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          }))
        ];
        break;
      case 5:
        // The switched attribute block (negative vs positive with flipped keys)
        newTrials = [
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "negative", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "positive", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          }))
        ];
        break;
      case 3:
      case 4:
      case 6:
      case 7:
        // Combined blocks
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "communication_disorder", testModel),
            block: block,
            effectiveBlock: effectiveBlock
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "normal_communication", testModel),
            block: block,
            effectiveBlock: effectiveBlock
          })),
          ...BLOCKS.NEGATIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "negative",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "negative", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          })),
          ...BLOCKS.POSITIVE_ATTRIBUTES.map((item): Trial => ({
            stimulus: item,
            category: "positive",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "positive", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: true
          }))
        ];
        break;
    }
    
    // Randomize the order of trials
    return newTrials.sort(() => Math.random() - 0.5);
  }

  // Helper method to map the actual block to an effective block based on test model
  static getEffectiveBlock(block: number, testModel: "A" | "B"): number {
    if (testModel === "B") {
      if (block >= 2 && block <= 4) {
        return block + 3; // 2->5, 3->6, 4->7
      } else if (block >= 5 && block <= 7) {
        return block - 3; // 5->2, 6->3, 7->4
      }
    }
    return block;
  }
}
