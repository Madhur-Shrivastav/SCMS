import { GoogleGenAI } from "@google/genai";
import { keys } from "../../secrets.mjs";

export default function getAIModel() {
  return new GoogleGenAI({
    apiKey: keys.gemini,
  });
}
