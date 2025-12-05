function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";
  // Ensure URL has protocol prefix
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();

export interface AboutYouData {
  full_name: string;
  date_of_birth?: string;
  birth_place?: string;
  current_location?: string;
}

export interface AboutYouResponse {
  success: boolean;
  message: string;
  data: AboutYouData;
}

export async function saveAboutYou(data: AboutYouData): Promise<AboutYouResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/questionnaire/about`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || response.statusText);
  }

  return response.json();
}

export async function getAboutYou(): Promise<AboutYouResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/questionnaire/about`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || response.statusText);
  }

  return response.json();
}
