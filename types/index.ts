export type NewUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
  };
  

export type User={
    id:string;
    firstName?:string;
    lastName?:string;
    email:string;
   

}

export type updateUser ={
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    

}

export type NewCourse = {
    user_id:string,
    title:string;
}
