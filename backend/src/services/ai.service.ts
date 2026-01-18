import Anthropic from "@anthropic-ai/sdk";
import config from "../config/env.js";

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.claudeApiKey,
    });
  }

  async analyze(prompt: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const content = response.content[0];

      if (content?.type === "text") {
        return content.text;
      }

      throw new Error("Unexpected response format from Claude");
    } catch (error: any) {
      console.error("Claude API Error:", error.message);
      throw new Error(`Failed to analyze with Claude: ${error.message}`);
    }
  }
}
