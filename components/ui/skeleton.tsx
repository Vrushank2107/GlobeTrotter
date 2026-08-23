export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className || ''}`} />
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-72 bg-white border-r border-slate-200 animate-pulse" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-slate-200 animate-pulse" />
        <div className="p-10 space-y-6">
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
        </div>
      ))}
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-72 bg-white border-r border-slate-200 animate-pulse" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-slate-200 animate-pulse" />
        <div className="p-10 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center gap-8">
            <div className="w-28 h-28 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-slate-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto animate-pulse" />
                <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 bg-slate-200 rounded flex-1 animate-pulse" />
          <div className="h-8 bg-slate-200 rounded flex-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
