export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around p-2">
        <a href="/dashboard" className="p-2">Home</a>
        <a href="/trips" className="p-2">Trips</a>
        <a href="/explore" className="p-2">Explore</a>
        <a href="/profile" className="p-2">Profile</a>
      </div>
    </nav>
  );
}
