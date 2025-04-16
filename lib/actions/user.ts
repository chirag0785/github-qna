'use server'

import { auth } from "@clerk/nextjs/server"
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { repos } from "../db/schema/repos";
import { Repo } from "@/store/UserStore";
export const fetchUser=async ()=>{
    try{
        const {userId}=auth();
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userDetails=await db.select().from(users).where(eq(users.id,userId));
        if(userDetails.length===0){
            throw new Error("User not found");
        }
        const user=userDetails[0];
        const repoDetails=[] as Repo[];
        if(user.repos){
            await Promise.all(user.repos.map(async (repoId)=>{
                const repo=await db.select().from(repos).where(eq(repos.id,repoId));
                if(repo.length>0){
                    repoDetails.push({
                        id:repo[0].id,
                        name:repo[0].name,
                        repo_url:repo[0].repo_url,
                    });
                }
            }));
        }
        return {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            profileImg:user.profile_img,
            repos:repoDetails
        }
    }catch(err:any){
        console.error(err);
        throw new Error(err.message || "Error fetching user details");
    }
}