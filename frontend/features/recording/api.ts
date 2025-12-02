import { api, ProcessResponse } from "@/lib/api-client";

export async function processRecording(
  audioBlob: Blob,
  context?: string
): Promise<ProcessResponse> {
  return api.process(audioBlob, context);
}
