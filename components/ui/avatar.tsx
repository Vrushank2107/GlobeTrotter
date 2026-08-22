export default function Avatar({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
      {src ? <img src={src} alt={alt} /> : <div className="w-full h-full flex items-center justify-center">?</div>}
    </div>
  );
}
