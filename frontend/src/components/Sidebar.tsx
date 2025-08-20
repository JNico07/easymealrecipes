import type { FC } from "react";
import { Home, Compass, Heart, LogOut } from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = ({ activeItem, onNavigate, onLogout }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={24} /> },
    { id: "explore", label: "Explore", icon: <Compass size={24} /> },
    { id: "favorites", label: "Favorites", icon: <Heart size={24} /> },
  ];

  return (
    <aside
      className="bg-white h-screen w-64 fixed left-0 top-0 shadow-md flex flex-col justify-between"
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <div>
        <div className="p-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Recipe App Logo"
            className="h-25 w-auto rounded-full object-cover"
          />
        </div>

        {/* Main menu */}
        <nav className="px-4 mt-6" role="navigation">
          <ul className="space-y-2" role="menu">
            {menuItems.map((item) => (
              <li key={item.id} role="menuitem">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-current={activeItem === item.id ? "page" : undefined}
                  aria-label={`${item.label} navigation`}
                >
                  <span className="mr-3" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut size={24} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
