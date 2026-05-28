import "reflect-metadata";
import "../config/container";
import mongoose, { Types } from "mongoose";
import { env } from "../config/env";
import { Logger } from "../utils/logger";
import { ComplaintModel } from "../models/Complaint";
import { EnquiryModel } from "../models/Enquiry";
import { QuotationModel } from "../models/Quotation";

function isObjectIdString(value: unknown): value is string {
  return typeof value === "string" && Types.ObjectId.isValid(value);
}

async function backfill(modelName: string, model: any) {
  const cursor = model
    .find({ $or: [{ clientRef: { $exists: false } }, { clientRef: null }] })
    .select({ _id: 1, clientId: 1 })
    .lean()
    .cursor();

  let scanned = 0;
  let updated = 0;
  for await (const doc of cursor) {
    scanned += 1;
    if (!isObjectIdString(doc.clientId)) continue;
    await model.updateOne({ _id: doc._id }, { $set: { clientRef: new Types.ObjectId(doc.clientId) } }).exec();
    updated += 1;
    if (updated % 500 === 0) {
      Logger.info(`[migration:${modelName}] updated ${updated} docs (scanned ${scanned})`);
    }
  }

  Logger.info(`[migration:${modelName}] done. updated=${updated}, scanned=${scanned}`);
}

async function main() {
  Logger.initialize();
  Logger.info("Starting backfillClientRef migration...");

  await mongoose.connect(env.MONGO_URI);
  try {
    await Promise.all([
      backfill("complaints", ComplaintModel),
      backfill("enquiries", EnquiryModel),
      backfill("quotations", QuotationModel),
    ]);
    Logger.info("backfillClientRef migration completed successfully.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

