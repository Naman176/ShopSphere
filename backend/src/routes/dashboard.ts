import express from "express";
import {
  getBarData,
  getLineData,
  getPieData,
  getStatData,
} from "../controllers/dashboard.js";
import { isAdmin } from "../middlewares/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", isAdmin, getStatData);
dashboardRouter.get("/bar", isAdmin, getBarData);
dashboardRouter.get("/pie", isAdmin, getPieData);
dashboardRouter.get("/line", isAdmin, getLineData);

export default dashboardRouter;
