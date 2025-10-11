'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { repos } from "../db/schema/repos";
import { Repo } from "@/store/UserStore";
import { userRepos } from "../db/schema/userRepos";
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
                repos: [],
                credits: 100,       //giving 100 free credits to new user
            }   
        }
        const user=userDetails[0];
        const repoDetails=await db.select({
            id: repos.id,
            name: repos.name,
            repo_url: repos.repo_url,
        }).from(userRepos).where(eq(userRepos.user_id,user.id)).innerJoin(repos,eq(userRepos.repo_id,repos.id));
        return {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            profileImg:user.profile_img,
            repos:repoDetails,
            credits: user.credits
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

export const addCreditsToUser=async (userId:string,creditsToAdd:number)=>{
    try{
        if(!userId){
            throw new Error("User not authenticated");
        }
        const userDetails=await db.select().from(users).where(eq(users.id,userId));
        if(userDetails.length===0){
            throw new Error("User not found");
        }
        const user=userDetails[0];
        const newCredits=(user.credits || 0) + creditsToAdd;
        await db.update(users).set({credits:newCredits}).where(eq(users.id,userId));
    }catch(err:any){
        console.error(err);
        throw new Error(err.message || "Error adding credits to user");
    }
}