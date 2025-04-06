"use client"
import { pollCommits } from '@/lib/actions/commit'
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(()=>{
    pollCommits("jhz4zammf5ri7111ddqku","user_2vLZDw1KNC9ww8V52ZFOMSAl5RK").catch((err)=>{
      console.log("Error: ",err);
    })
  },[])
  return (
    <div>
        Dashboard
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData=new FormData(e.currentTarget);
          const repoUrl=formData.get('repoUrl') as string;
          const personalAccessToken=formData.get('personalAccessToken') as string;
          const repoName=formData.get('repoName') as string;
          const response=await fetch('/api/upload-repo',{
              method:'POST',
              headers:{
                  'Content-Type':'application/json'
              },
              body:JSON.stringify({repoUrl,personalAccessToken,repoName})
          });
        }}>
          <input type='text' name='repoUrl' placeholder='Repository URL' />
          <input type='text' name='personalAccessToken' placeholder='Personal Access Token' />
          <input type='text' name='repoName' placeholder='Repository Name' />
          <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default Page