import { GalleryVideo } from "@/data/gallery";

interface VideoGridProps {
  videos: GalleryVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="text-center text-slate-400 py-12">
        No videos yet for this session. Stay tuned!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {videos.map((video) => (
        <div key={video.id}>
          <div className="rounded-xl overflow-hidden">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-1 text-sm text-slate-400">{video.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
