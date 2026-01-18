import express from "express";
import {
  addContact,
  getContacts,
  deleteContact
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", addContact);
router.get("/", getContacts);
router.delete("/:id", deleteContact);

export default router;
