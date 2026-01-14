// test.ts (temporary file for testing)

import { EmailParserService } from "../src/services/emailParser.service.js";

async function testParser() {
  const parser = new EmailParserService();

  try {
    // Test with .msg file
    // const msgResult = await parser.parseEmailFile("./uploads/test.msg");
    // console.log("📧 MSG Parsed Successfully:");
    // console.log("Subject:", msgResult.subject);
    // console.log("Body preview:", msgResult.body.slice(0, 200));
    // console.log("Attachments:", msgResult.attachments.length);
    // msgResult.attachments.forEach((att) => {
    //   console.log(
    //     `  - ${att.filename} (${att.contentType}, ${att.size} bytes)`
    //   );
    // });

    // console.log("\n---\n");

    // Test with .eml file (if you have one)
    const emlResult = await parser.parseEmailFile("./uploads/test.eml");
    console.log("📧 EML Parsed Successfully:");
    console.log("Subject:", emlResult.subject);
    console.log("Body preview:", emlResult.body.slice(0, 200));
    console.log("Attachments:", emlResult.attachments.length);
    emlResult.attachments.forEach((att) => {
      console.log(
        `  - ${att.filename} (${att.contentType}, ${att.size} bytes)`
      );
    });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

testParser();
