import { NextRequest, NextResponse } from "next/server";
import { SPEAKING_EXAMINER_PROMPT, IELTSSpeakingResult } from "@e-english/ielts-ai";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    // In a real production scenario, you would call Gemini or OpenAI here.
    // Example with a mocked LLM response following the prompt guidelines:
    
    // const prompt = SPEAKING_EXAMINER_PROMPT.replace("{{transcript}}", transcript);
    // const response = await callLLM(prompt); 
    
    // Mocked response for demo purposes (matching the IELTSSpeakingResult schema)
    const mockResult: IELTSSpeakingResult = {
      overall_band: 6.5,
      criteria: {
        fluency: 7.0,
        lexical: 6.0,
        grammar: 6.0,
        pronunciation: 7.0
      },
      feedback: "The candidate shows good fluency and is able to maintain a flow of speech. However, there is a reliance on common vocabulary ('good', 'happy') and some minor grammatical slips with articles.",
      mistakes: [
        {
          text: "I am study English",
          issue: "Incorrect verb tense (present continuous required).",
          suggestion: "I am currently studying English"
        }
      ],
      improved_version: "Currently, I am pursuing my English studies with a focus on academic proficiency."
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
