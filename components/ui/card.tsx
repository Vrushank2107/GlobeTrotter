export default function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="bg-white rounded-lg shadow-md">
      {children}
    </div>
  );
}
