import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [profile] = await db
  .select()
  .from(profiles)
  .where(eq(profiles.id, user.id));
  if (!profile) {
  return (
    <main className="min-h-screen flex justify-center items-center">
      Profile 不存在
    </main>
  );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl m-4">

        <h1 className="text-3xl font-bold mb-8">
          Profile
        </h1>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              User ID
            </p>

            <p className="font-medium break-all">
              {user.id}
            </p>
          </div>

            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">
                {profile.username}
              </p>
            </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email Verified
            </p>

            <p className="font-medium">
              {user.email_confirmed_at ? "✅ 已验证" : "❌ 未验证"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              创建时间
            </p>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>

          <div>
              <p className="text-sm text-gray-500">Bio个人简介</p>
              <p className="font-medium">
                {profile.bio ?? "暂无简介"}
              </p>
          </div>

        </div>

      </div>
    </main>
  );
}