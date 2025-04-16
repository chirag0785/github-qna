import { fetchUser } from "@/lib/actions/user";
import {create} from "zustand";
export type Repo={
    id:string;
    name:string;
    repo_url:string;
}
export type User={
    id:string,
    name:string,
    email:string,
    username:string,
    profile_img:string,
    repos:Repo[],
}
type UserStore = User & {
    getUser: () => void
    updateUser: (user: User) => void
    deleteUser: () => void
  }
  
export const useUserStore=create<UserStore>(
        (set)=>({
            id:"",
            name:"",
            email:"",
            username:"",
            profile_img:"",
            repos:[],
            getUser:()=>{
                fetchUser().then((user)=>{
                    set({
                        id:user.id,
                        name:user.name,
                        email:user.email,
                        username:user.username,
                        profile_img:user.profileImg || "",
                        repos:user.repos
                    })
                }).catch((err)=>{
                    console.log(err);
                    set({
                        id:"",
                        name:"",
                        email:"",
                        username:"",
                        profile_img:"",
                        repos:[]
                    })
                })
            },
            updateUser:(user:User)=>{
                set({
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    username:user.username,
                    profile_img:user.profile_img,
                    repos:user.repos
                })
            },
            deleteUser:()=>{
                set({
                    id:"",
                    name:"",
                    email:"",
                    username:"",
                    profile_img:"",
                    repos:[]
                })
            }
        }),
)