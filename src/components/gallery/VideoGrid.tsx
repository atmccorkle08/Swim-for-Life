import { GalleryVideo } from "@/data/gallery";

interface VideoGridProps {
  videos: GalleryVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="text-center text-cyan-200/60 py-12">
        No videos yet for this session. Stay tuned!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {videos.map((video) => (
        <div key={video.id}>
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
          <h3 className="mt-3 text-white font-display font-semibold">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-1 text-sm text-cyan-200">{video.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
