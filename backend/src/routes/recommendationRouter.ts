/* import express from "express";
import { getRecommendations } from "../controllers/recommendationController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

const recommendationRouter = express.Router();

recommendationRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
});

export default recommendationRouter;
 */
