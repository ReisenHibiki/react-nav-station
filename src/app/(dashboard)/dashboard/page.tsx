import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
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

        </div>

      </div>
    </main>
  );
}