export const LAKE_CONFIGS = {
  CLEAR: {
    type: "Clear",
    color: "#6fa5fc",
    maxDepth: 7,
    targetRange: {
      min: 4,
      max: 7
    }
  },
  INTERMEDIATE: {
    type: "Intermediate",
    color: "#bfc18b",
    maxDepth: 7,
    targetRange: {
      min: 3.5,
      max: 7
    }
  },
  PRODUCTIVE: {
    type: "Productive",
    color: "#6b8474",
    maxDepth: 5,
    targetRange: {
      min: 2,
      max: 3
    }
  },
  DYSTROPHIC: {
    type: "Dystrophic",
    color: "#82753a",
    maxDepth: 5,
    targetRange: {
      min: 2,
      max: 3
    }
  },
  DYSTROPHIC_PRODUCTIVE: {
    type: "Dystrophic Productive",
    color: "#8a9663",
    maxDepth: 5,
    targetRange: {
      min: 1,
      max: 3
    }
  }
}; 