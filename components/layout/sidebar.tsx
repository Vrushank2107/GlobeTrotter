export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li><a href="/dashboard" className="block p-2 rounded hover:bg-gray-100">Dashboard</a></li>
          <li><a href="/trips" className="block p-2 rounded hover:bg-gray-100">Trips</a></li>
          <li><a href="/explore" className="block p-2 rounded hover:bg-gray-100">Explore</a></li>
          <li><a href="/community" className="block p-2 rounded hover:bg-gray-100">Community</a></li>
          <li><a href="/calendar" className="block p-2 rounded hover:bg-gray-100">Calendar</a></li>
          <li><a href="/profile" className="block p-2 rounded hover:bg-gray-100">Profile</a></li>
          <li><a href="/settings" className="block p-2 rounded hover:bg-gray-100">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}
