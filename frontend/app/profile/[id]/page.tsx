import Profile from "@/components/sections/profile";

export default function ProfilePage({ params }: { params: { id: string } }) {
  return <Profile username={params.id} />;
}
