import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "",
});
export default function getAIModel() {
  return ai;
}
