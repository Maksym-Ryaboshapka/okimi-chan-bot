import { Schema } from "mongoose";
import type { ILink } from "../interfaces/ILink.ts";

const linkSchema = new Schema<ILink>({
  tgName: { type: String, required: true },
  osuName: { type: String, required: true },
});

export default linkSchema;