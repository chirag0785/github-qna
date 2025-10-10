import {create} from "zustand";
export type Project={
    id:string;
    name:string;
}
type ProjectStore = Project & {
    getProject: () => void
    updateProject: (project: Project) => void
}
  
export const useProjectStore=create<ProjectStore>(
        (set)=>({
            id:"",
            name:"",
            getProject:()=>{
                const projectId=localStorage.getItem('github-qna-project-id');
                const projectName=localStorage.getItem('github-qna-project-name');
                
                set({
                    id:projectId || "",
                    name:projectName || ""
                })
            },
            updateProject:(project:Project)=>{
                localStorage.setItem('github-qna-project-id',project.id);
                localStorage.setItem('github-qna-project-name',project.name);
                set({
                    id:project.id,
                    name:project.name
                })
            },
        }),
)