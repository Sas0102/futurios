export interface Call {

  id:number;

  caller:string;

  agent:string;

  duration:string;

  status:"Completed" | "Missed";

  date:string;

}