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
            effectiveBlock: effectiveBlock,
            isImage: false
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "normal_communication", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: false
          }))
        ];
        break;
      case 2:
        // Attribute block (positive vs negative)
        // Using images instead of text for positive/negative attributes
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
        // Using images instead of text
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
        // Make emotional attributes images, keep communication terms as text
        newTrials = [
          ...BLOCKS.COMMUNICATION_DISORDER.map((item): Trial => ({
            stimulus: item,
            category: "communication_disorder",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "communication_disorder", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: false
          })),
          ...BLOCKS.NORMAL_COMMUNICATION.map((item): Trial => ({
            stimulus: item,
            category: "normal_communication",
            correctKey: getCorrectKeyForBlock(effectiveBlock, "normal_communication", testModel),
            block: block,
            effectiveBlock: effectiveBlock,
            isImage: false
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
    
    // For image trials, replace the stimulus with image path
    newTrials = newTrials.map(trial => {
      if (trial.isImage) {
        // Replace text stimulus with URL to an image
        // This is a simple mapping using the text as a key
        const imageMap: Record<string, string> = {
          // Positive attributes
          "إيجابي": "https://images.unsplash.com/photo-1581300134629-4e3a11e58f8d?w=500&q=80",
          "ممتاز": "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&q=80",
          "نجاح": "https://images.unsplash.com/photo-1552581234-26160f608093?w=500&q=80",
          "متميز": "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=500&q=80",
          "قوي": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80",
          "محترف": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80",
          "متعلم": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80",
          "متفوق": "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=500&q=80",
          
          // Negative attributes
          "حزين": "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=500&q=80",
          "سلبي": "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80",
          "ضعيف": "https://images.unsplash.com/photo-1606103920295-9a091db357e3?w=500&q=80",
          "فاشل": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&q=80",
          "غاضب": "https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=500&q=80",
          "محبط": "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&q=80",
          "مرتبك": "https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?w=500&q=80",
          "متعثر": "https://images.unsplash.com/photo-1581005311748-a8dc3b4c6c82?w=500&q=80",
          "مهزوم": "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=500&q=80",
          "ضعيف التحصيل": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=500&q=80"
        };
        
        return {
          ...trial,
          stimulus: imageMap[trial.stimulus] || trial.stimulus
        };
      }
      return trial;
    });
    
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
