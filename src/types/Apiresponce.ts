import { Message } from "@/models/User.model";

export interface ApiResponce {
  success : boolean,
  message : string,
  statusCode : number,
  isAcceptingMessage?: boolean,
  messages? : Message[],
} 