import { Skeleton } from "@/components/ui/skeleton";
import { CORE_MODULE } from "@/lib/aptos";
import { hexToString } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Comment({
  key,
  comment,
}: {
  key: number;
  comment: any;
}) {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(
          `/api/user?AccountAddress=${comment.commenter}`
        );
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
  }, []);
  return profile == null ? (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ) : (
    <div className="flex justify-between " key={key}>
      <div className="flex items-center  space-x-3 py-2 ">
        <Image
          src={`https://aggregator-devnet.walrus.space/v1/${profile.image}`}
          width={30}
          height={30}
          alt="Profile"
          className="rounded-full cursor-pointer"
        />
        <p
          className="text-white text-sm font-semibold hover:scale-105 hover:-translate-y-1 transition duration-100 ease-out cursor-pointer"
          onClick={() => {
            // TODO: navigate to user profile
          }}
        >
          {profile.username} &nbsp;
        </p>
        <p className="text-sm cursor-default font-medium">{comment.content}</p>
      </div>
    </div>
  );
}
