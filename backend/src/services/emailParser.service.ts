import path from "path";
import fs from "fs";
import { simpleParser } from "mailparser";
import MsgReaderOrExports from "@kenjiuno/msgreader";

export interface ParsedEmail {
  subject: string;
  body: string;
  date: Date;
  attachments: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  buffer: Buffer;
  contentType: string;
  size: number;
}

export class EmailParserService {
  parseEmailFile = async (filePath: string): Promise<ParsedEmail> => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case ".msg":
        return this.parseMSG(filePath);

      case ".eml":
        return this.parseEML(filePath);

      default:
        throw new Error(
          `Unsupported format: ${ext}. Only .msg and .eml are supported.`
        );
    }
  };

  private parseMSG = async (filePath: string): Promise<ParsedEmail> => {
    try {
      const msgFileBuffer = fs.readFileSync(filePath);
      const MsgReader =
        (MsgReaderOrExports as any).default || MsgReaderOrExports;
      const msgReader = new MsgReader(msgFileBuffer);
      const msgData = msgReader.getFileData({
        includeAttachmentContent: true,
      });

      let body = msgData.body || "";

      const attachments: EmailAttachment[] = [];

      if (msgData.attachments && msgData?.attachments?.length > 0) {
        for (const att of msgData.attachments) {
          attachments.push({
            filename: att.fileName || "unnamed_attachment",
            buffer: Buffer.from(att.fileName),
            contentType:
              att.attachMimeTag ||
              this.getMimeTypeFromFilename(att.fileName || ""),
            size: att.contentLength,
          });
        }
      }

      return {
        subject: msgData.subject || "No Subject",
        body: body.trim(),
        date: msgData.creationTime || new Date(),
        attachments,
      };
    } catch (error: any) {
      throw new Error(`Failed to parse .msg file: ${error.message}`);
    }
  };
  private parseEML = async (filePath: string): Promise<ParsedEmail> => {
    try {
      const emlBuffer = fs.readFileSync(filePath);
      const parsed = await simpleParser(emlBuffer);

      let body = parsed.text || "";

      const attachments: EmailAttachment[] = [];

      if (parsed.attachments && parsed.attachments.length > 0) {
        for (const att of parsed.attachments) {
          if (
            !att.contentDisposition ||
            att.contentDisposition === "attachment"
          ) {
            attachments.push({
              filename: att.filename || "unnamed_attachment",
              buffer: att.content,
              contentType: att.contentType || "application/octet-stream",
              size: att.size || att.content.length,
            });
          }
        }
      }

      return {
        subject: parsed.subject || "No Subject",
        body: body.trim(),
        date: parsed.date || new Date(),
        attachments,
      };
    } catch (error: any) {
      throw new Error(`Failed to parse .eml file: ${error.message}`);
    }
  };

  private getMimeTypeFromFilename(filename: string): string {
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".txt": "text/plain",
      ".csv": "text/csv",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }
}
