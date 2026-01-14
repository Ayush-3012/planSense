import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import rfpController from "../controllers/rfp.controller.js";

const rfpRouter = Router();

rfpRouter
  .route("/uploadRfp")
  .post(upload.single("rfp"), rfpController.analyzeRFP);

export default rfpRouter;
