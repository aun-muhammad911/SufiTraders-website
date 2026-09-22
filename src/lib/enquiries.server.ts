import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Enquiry, EnquiryInput } from "./enquiries";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

let writeQueue: Promise<void> = Promise.resolve();

async function readEnquiries(): Promise<Enquiry[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const contents = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(contents) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as Array<Partial<Enquiry>>).map((enquiry) => ({
      ...(enquiry as Enquiry),
      status: enquiry.status === "resolved" ? "resolved" : "open",
    }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeEnquiries(enquiries: Enquiry[]) {
  await mkdir(DATA_DIR, { recursive: true });
  const temporaryFile = path.join(DATA_DIR, `enquiries.${crypto.randomUUID()}.tmp.json`);
  await writeFile(temporaryFile, `${JSON.stringify(enquiries, null, 2)}\n`, "utf8");
  await rename(temporaryFile, DATA_FILE);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const enquiries = await readEnquiries();
  return enquiries.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  const task = writeQueue.then(async () => {
    const enquiry: Enquiry = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    const enquiries = await readEnquiries();
    enquiries.push(enquiry);
    await writeEnquiries(enquiries);
    return enquiry;
  });

  writeQueue = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}

export function setEnquiryResolution(id: string, resolved: boolean): Promise<Enquiry> {
  const task = writeQueue.then(async () => {
    const enquiries = await readEnquiries();
    const index = enquiries.findIndex((enquiry) => enquiry.id === id);
    if (index === -1) throw new Error("Enquiry not found.");

    const current = enquiries[index]!;
    const { resolvedAt: _resolvedAt, ...base } = current;
    const updated: Enquiry = resolved
      ? { ...base, status: "resolved", resolvedAt: new Date().toISOString() }
      : { ...base, status: "open" };
    enquiries[index] = updated;
    await writeEnquiries(enquiries);
    return updated;
  });

  writeQueue = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}
