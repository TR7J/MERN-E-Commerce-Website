import express from "express";
import { getRecommendations } from "../controllers/recommendationController";

const recommendationRouter = express.Router();

recommendationRouter.get("/:userId", getRecommendations);

export default recommendationRouter;
