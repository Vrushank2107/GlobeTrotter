export default function Modal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl">{children}</div>
    </div>
  );
}
