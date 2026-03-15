export const ACTIONS = {
  setRole: "setRole",
  setStep: "setStep",
  setPreview: "setPreview",
  setStream: "setStream",
  setIsStreaming: "setIsStreaming",
  setFaceCount: "setFaceCount",
  setModelsLoaded: "setModelsLoaded",
  setIsProcessing: "setIsProcessing",
  setFaceVerified: "setFaceVerified",
  setShowFacePopup: "setShowFacePopup",
  setVerifying: "setVerifying",
} as const;

export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];
