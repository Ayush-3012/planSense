import { ClaudeService } from "./ai.service.js";
import type { EmailAnalysis } from "../types/index.js";

export class EmailAnalyzerService {
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = new ClaudeService();
  }

  async analyze(emailBody: string, subject: string): Promise<EmailAnalysis> {
    const prompt = `
You are an expert insurance quoting specialist analyzing RFP emails.

IMPORTANT INSTRUCTIONS:
- Extract ONLY information that is clearly stated in the email
- If information is mentioned to be in attachments, mark it as "See attachment"
- If information is not mentioned at all, use null or empty string
- Do NOT guess or infer information
- Return the response in valid JSON format ONLY

TASK:
Extract the following information from this RFP email:

1. Client name and location
2. Broker information  
3. Effective date
4. Case type (renewal, new_business, or first_time_benefit)
5. Products being quoted
6. Current carriers for each product (if mentioned in email body)
7. Employee classes with descriptions and eligibility (if described in email body)
8. Renewal rates (if stated in email body)
9. Census information (if provided in email body)
10. Commission rate
11. Quote instructions
12. Special instructions or notes

Email Subject: ${subject}

Email Body:
${emailBody}

Return ONLY a JSON object with this exact structure:
{
  "clientName": "",
  "broker": "",
  "effectiveDate": "",
  "caseType": "renewal|new_business|first_time_benefit",
  "products": [
    {
      "productType": "",
      "currentCarrier": null, // null if not in email body
      "quoteInstructions": "",
      "classes": [
        {
          "className": "",
          "description": "",
          "eligibility": ""
        }
      ],
      "renewalRates": null // null if not in email body
    }
  ],
  "census": null, // null if not in email body
  "commission": "",
  "specialNotes": []  // Add notes like "Rates in attachment",
}

Rules:
- If carriers/rates are in attachments, set to null
- If classes are briefly mentioned but details in PDF, just capture class names
- Add important notes to specialNotes array
- Return ONLY JSON, no extra text.
`;
    const response = await this.claudeService.analyze(prompt);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Claude response");

    const analysisData = JSON.parse(jsonMatch[0]);

    if (!analysisData.clientName || !analysisData.products)
      throw new Error("Incomplete analysis from Claude");

    return analysisData as EmailAnalysis;
  }
}
