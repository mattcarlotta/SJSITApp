import { Schema, model } from "mongoose";
import { createSchedule } from "shared/helpers";

const eventSchema = new Schema({
  eventType: { type: String, default: "Game", required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, default: "SAP Center at San Jose" },
  employeeResponses: [
    {
      _id: {
        type: String,
        required: true,
      },
      response: { type: String, required: true },
      notes: String,
    },
  ],
  schedule: [
    {
      _id: { type: String, required: true },
      title: String,
      employeeIds: { type: Array, of: String },
    },
  ],
  scheduledIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  seasonId: { type: String, required: true },
  team: { type: String, required: true },
  opponent: String,
  callTimes: { type: Array, of: Date, required: true },
  uniform: { type: String, default: "Teal Jersey" },
  notes: String,
});

eventSchema.pre("save", function(next) {
  this.schedule = createSchedule(this.callTimes);
  next();
});

export default model("Event", eventSchema);
