import express from "express";
import { addSchool } from "../controllers/addSchoolController.js";
import { listSchools } from "../controllers/listSchoolsController.js";

const router = express.Router();

router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

export default router;