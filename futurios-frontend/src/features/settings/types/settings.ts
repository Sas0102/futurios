export interface UserProfile {

  id:number;

  full_name:string;

  email:string;

}


export interface Organisation {

  id:number;

  name:string;

  slug:string;

}


export interface SettingsData {

  user:UserProfile;

  organisation:Organisation;

}