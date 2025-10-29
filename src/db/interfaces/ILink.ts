import { Document } from "mongoose";

export interface ILink extends Document {
  tgName: string;
  osuName: string;
}