import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "0b5bcvnl",
  dataset: "production",
  apiVersion: "2026-03-13",
  useCdn: false,
});