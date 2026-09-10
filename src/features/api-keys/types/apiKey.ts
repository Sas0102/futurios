export interface ApiKey {
  id: number;
  organisation_id: number;
  name: string | null;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface CreateApiKeyRequest {
  name?: string | null;
}

export interface CreatedApiKey {
  id: number;
  organisation_id: number;
  name: string | null;
  key_prefix: string;
  raw_key: string;
  created_at: string;
}
