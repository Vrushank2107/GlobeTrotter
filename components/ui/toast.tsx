export default function Toast({ message, type }: { message: string; type?: 'success' | 'error' | 'info' }) {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`}>
      {message}
    </div>
  );
}
