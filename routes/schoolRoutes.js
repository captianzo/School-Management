import express from "express";
import { addSchool } from "../controllers/addSchoolController";


const router = express.router();

router.post('/addSchool', addSchool);
router.get('/listSchools', listSchool);

export default router;