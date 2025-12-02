const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(response.status, error.detail || response.statusText);
  }
  return response.json();
}

export const api = {
  /**
   * Upload audio and get transcript
   */
  async transcribe(audioBlob: Blob): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch(`${API_BASE_URL}/api/v1/record`, {
      method: "POST",
      body: formData,
    });

    return handleResponse<TranscriptionResponse>(response);
  },

  /**
   * Generate story from transcript
   */
  async generateStory(transcript: string, context?: string): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/generate-story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, context }),
    });

    return handleResponse<StoryResponse>(response);
  },

  /**
   * Full pipeline: audio to story
   */
  async process(audioBlob: Blob, context?: string): Promise<ProcessResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    if (context) {
      formData.append("context", context);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/process`, {
      method: "POST",
      body: formData,
    });

    return handleResponse<ProcessResponse>(response);
  },

  /**
   * Health check
   */
  async health(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);
    return handleResponse(response);
  },
};

// Types matching backend schemas
export interface TranscriptionResponse {
  transcript: string;
  duration_seconds: number;
}

export interface StoryResponse {
  title: string;
  story: string;
  word_count: number;
}

export interface ProcessResponse {
  transcript: string;
  duration_seconds: number;
  title: string;
  story: string;
  word_count: number;
}
