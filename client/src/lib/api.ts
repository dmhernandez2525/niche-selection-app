const API_BASE_URL = 'http://localhost:3500/api';

export interface NicheResult {
  keyword: string;
  score: number;
  competitionScore: number;
  profitabilityScore: number;
}

export interface Niche {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    analyses: number;
    keywords: number;
  };
}

export interface Analysis {
  id: string;
  competitionScore: number;
  profitabilityScore: number;
  overallScore: number;
  channelCount: number | null;
  createdAt: string;
  nicheId: string;
  keywordId: string | null;
  niche?: Niche;
  keyword?: { id: string; term: string };
}

export interface CreateNicheInput {
  name: string;
  description?: string;
}

export interface UpdateNicheInput {
  name?: string;
  description?: string;
}

export interface RunAnalysisInput {
  keyword: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Niche Selection (legacy endpoint)
  async getNicheSelection(): Promise<NicheResult[]> {
    const response = await fetch(`${API_BASE_URL}/niche-selection`);
    return handleResponse<NicheResult[]>(response);
  },

  // Niche CRUD
  async getAllNiches(): Promise<Niche[]> {
    const response = await fetch(`${API_BASE_URL}/niches`);
    return handleResponse<Niche[]>(response);
  },

  async getNicheById(id: string): Promise<Niche> {
    const response = await fetch(`${API_BASE_URL}/niches/${id}`);
    return handleResponse<Niche>(response);
  },

  async createNiche(data: CreateNicheInput): Promise<Niche> {
    const response = await fetch(`${API_BASE_URL}/niches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Niche>(response);
  },

  async updateNiche(id: string, data: UpdateNicheInput): Promise<Niche> {
    const response = await fetch(`${API_BASE_URL}/niches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Niche>(response);
  },

  async deleteNiche(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/niches/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  // Analysis endpoints
  async getAnalysesByNiche(nicheId: string): Promise<Analysis[]> {
    const response = await fetch(`${API_BASE_URL}/niches/${nicheId}/analyses`);
    return handleResponse<Analysis[]>(response);
  },

  async runAnalysis(nicheId: string, data: RunAnalysisInput): Promise<Analysis> {
    const response = await fetch(`${API_BASE_URL}/niches/${nicheId}/analyses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Analysis>(response);
  },

  async getLatestAnalyses(): Promise<Analysis[]> {
    const response = await fetch(`${API_BASE_URL}/analyses/latest`);
    return handleResponse<Analysis[]>(response);
  },

  async getTopNiches(): Promise<Analysis[]> {
    const response = await fetch(`${API_BASE_URL}/analyses/top`);
    return handleResponse<Analysis[]>(response);
  },
};

export default api;
