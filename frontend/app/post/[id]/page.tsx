"use client";
import { useEnvironmentStore } from "@/components/context";
import Comments from "@/components/sections/post/comments";
import PostPage from "@/components/sections/post/post-page";
import SideBar from "@/components/sections/side-nav";
import { CORE_MODULE } from "@/lib/aptos";
import { hexToString } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
  const { posts } = useEnvironmentStore((store) => store);
  const [post, setPost] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    console.log("PostPage");
    setPost(posts.find((p) => p.id == parseInt(params.id)));
    if (post != null)
      (async function () {
        try {
          const res = await fetch(`/api/user?AccountAddress=${post.creator}`);
          const response = await res.json();
          const { resources } = response.data;

          // FETCH PROFILE
          const profile = (resources as any[]).find(
            (r) => r.type === `${CORE_MODULE}::SocialMediaPlatform::Profile`
          );
          if (profile != undefined) {
            setProfile({
              image: hexToString(profile.data.profile_pic_cid.slice(2)),
              username: hexToString(profile.data.user_name.slice(2)),
              name: hexToString(profile.data.display_name.slice(2)),
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
  }, [post]);
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="pt-7 px-7 flex-1 flex justify-center">
        {post == null || profile == null ? (
          <div className="loader"></div>
        ) : (
          <>
            <div className="w-[40%]">
              <PostPage post={post} profile={profile} />
            </div>
            <div className="w-[40%]">
              <Comments post={post} profile={profile} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
