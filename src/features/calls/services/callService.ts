import api from "@/lib/api";

import {
Call
} from "../types/call";



export const getCalls = async():

Promise<Call[]>=>{


const response = await api.get(
"/calls"
);


return response.data;


};