export interface Call {

  id:number;

  caller:string;

  agent:string;

  duration:string;

  status:"Completed" | "Missed";

  date:string;

}

export interface CallSummary {
  id: number;
  call_id: string;
  organisation_id: number;
  agent_id: number;
  final_intent: string;
  transfer_required: boolean;
  transfer_department: string | null;
  turn_count: number;
  created_at: string;
}

export interface Appointment {
  id: number;
  organisation_id: number;
  agent_id: number;
  call_id: string;
  caller_message: string;
  phone_number: string | null;
  created_at: string;
}

export interface CallbackRequest {
  id: number;
  organisation_id: number;
  agent_id: number;
  call_id: string;
  caller_message: string;
  phone_number: string | null;
  created_at: string;
}
