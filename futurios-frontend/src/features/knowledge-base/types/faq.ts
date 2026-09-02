export interface FAQ {
  id: number;
  organisation_id: number;
  question: string;
  answer: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
}
