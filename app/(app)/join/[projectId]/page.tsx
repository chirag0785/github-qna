'use server'
import { addTeamMember } from "@/lib/actions/repo";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const JoinProject = async ({ params }: { params: { projectId: string } }) => {
  const projectId = params.projectId;
  if (!projectId) return redirect("/dashboard");
  //make the user join the project

  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  //make an entry to the
  try {
    await addTeamMember(projectId, userId);
  } catch (err) {
    console.log("Member already added to project");
  }
  return redirect("/dashboard");
};
export default JoinProject;
