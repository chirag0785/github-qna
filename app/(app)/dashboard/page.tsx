"use client"
import React from 'react'

const Page = () => {
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