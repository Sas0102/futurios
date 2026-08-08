export interface SimulateRequest {
  call_id: string;
  message: string;
}

export interface SimulateResponse {
  response_text: string;
  intent: string;
  detected_language: string;
  confidence: number;
  transfer_required: boolean;
  transfer_department: string | null;
  end_call: boolean;
}
