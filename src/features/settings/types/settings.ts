export interface UserProfile {

  id:number;

  full_name:string | null;

  email:string;

  is_super_admin:boolean;

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
