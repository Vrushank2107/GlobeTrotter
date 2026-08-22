import Link from 'next/link';

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around p-2">
        <Link href="/dashboard" className="p-2">Home</Link>
        <Link href="/trips" className="p-2">Trips</Link>
        <Link href="/explore" className="p-2">Explore</Link>
        <Link href="/profile" className="p-2">Profile</Link>
      </div>
    </nav>
  );
}
