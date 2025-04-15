import { GoogleGenAI } from "@google/genai";
import { keys } from "../../secrets.mjs";
const ai = new GoogleGenAI({
  apiKey: keys.gemini,
});
export default function getAIModel() {
  return ai;
}
