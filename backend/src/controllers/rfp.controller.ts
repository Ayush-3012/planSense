import type { Request, Response } from "express";

class RFPController {
  analyzeRFP = async (req: Request, res: Response) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "At least one file is required",
        });
      }
    } catch (error: any) {
      console.error("Error in analyzeRFP controller:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  };
}

export default new RFPController();
