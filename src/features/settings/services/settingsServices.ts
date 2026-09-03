import api from "@/lib/api";

import {
  SettingsData
} from "../types/settings";



// later this will connect backend

export const getSettings = async():Promise<SettingsData> => {


const response = await api.get(
"/me/settings"
);


return response.data;


};





export const updateProfile = async(
data:{
full_name:string;
email:string;
}
)=>{


const response = await api.put(
"/me/profile",
data
);


return response.data;


};





export const updateOrganisation = async(
organisationId:number,
data:{
name:string;
}
)=>{


const response = await api.put(

`/organisations/${organisationId}`,

data

);


return response.data;


};