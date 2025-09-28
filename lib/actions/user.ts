'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"
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
            //this means user not found so now for second step of verification we will check 
            //if user exists in clerk
            //set in the metadata that first time user is there
            const clerkUser=await clerkClient().users.getUser(userId);
            if(!clerkUser){
                throw new Error("User not found");
            }
            return {
                id:clerkUser.id,
                username: clerkUser.username || "",
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
                profileImg: clerkUser.imageUrl || "",
                repos: []
            }
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

export const updateFirstTimeUserFlag=async ()=>{
    try{
        const {userId}=auth();
        if(!userId){
            throw new Error("User not authenticated");
        }
        const clerkUser=await clerkClient().users.getUser(userId);
        if(!clerkUser){
            throw new Error("User not found");
        }
        await clerkClient().users.updateUserMetadata(clerkUser.id,{
            publicMetadata: {
                ...clerkUser.publicMetadata,
                firstTimeUser: false,
            }
        })
    }catch(err:any){
        console.error(err);
        throw new Error(err.message || "Error updating user details");
    }
}