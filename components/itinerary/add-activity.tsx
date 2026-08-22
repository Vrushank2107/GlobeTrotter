export default function AddActivity({ onAdd }: { onAdd: (activity: any) => void }) {
  return (
    <button
      onClick={() => onAdd({})}
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
    >
      + Add Activity
    </button>
  );
}
