export default function TripHeader({ title, status }: { title: string; status?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {status && <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{status}</span>}
    </div>
  );
}
