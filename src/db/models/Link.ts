import { model } from "mongoose";
import type { ILink } from "../interfaces/ILink.ts";
import linkSchema from "../schemas/linkSchema.ts";

const Link = model<ILink>("Link", linkSchema);

export default Link;