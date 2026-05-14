import { auth } from "@/auth";
import Profile from "@/components/auth/profile";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return <Profile session={session} />;
};

export default ProfilePage;
