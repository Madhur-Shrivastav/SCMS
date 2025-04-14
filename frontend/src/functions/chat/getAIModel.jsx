import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCfVMxZNBqQsSdrspROnaXTLzXWd82z5r8",
});
export default function getAIModel() {
  return ai;
}
