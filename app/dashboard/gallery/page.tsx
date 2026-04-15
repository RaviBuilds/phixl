

import GalleryCard from "@/components/GalleryCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ImageIcon } from "lucide-react"; // Import an icon for the empty state
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Gallery",
  description: "View and download your securely restored photos.",
  robots: { index: false, follow: false },
};

export default async function Gallery() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restoredData, error: restoreError } = await supabase
    .from("restorations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }); // Show newest first!

  if (restoreError) {
    console.error("Oops error occurred", restoreError);
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Gallery View
        </h1>
        <p className="text-gray-400 mt-2">
          Manage and view all your previously restored photos.
        </p>
      </div>

      {/* --- Empty State --- */}
      {restoredData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-900/50 border border-gray-800 rounded-2xl border-dashed">
          <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No restorations yet
          </h3>
          <p className="text-gray-400 max-w-md mb-6">
            You haven't used the AI pipeline yet. Head over to the dashboard to
            restore your first image.
          </p>
          <Link
            href="/dashboard"
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        /* --- Populated Gallery Grid --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restoredData?.map((item) => {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("restored_images")
              .getPublicUrl(item.image_url);

            return (
              <div key={item.id} className="flex flex-col gap-2">
                {/* Notice I added id and imagePath to the props for your future delete logic */}
                <GalleryCard
                  publicUrl={publicUrl}
                  id={item.id}
                  imagePath={item.image_url}
                />

                <div className="px-1 text-xs font-medium text-gray-500 flex justify-between items-center">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="uppercase tracking-wider">AI Restored</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
