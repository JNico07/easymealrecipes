import type { FC } from 'react';
import { Home, Search, Users, Heart, HelpCircle, Settings } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'explore', label: 'Explore', icon: <Search size={24} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={24} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} /> },
  ];

  return (
    <aside className="bg-white h-screen w-64 fixed left-0 top-0 shadow-md flex flex-col" aria-label="Main Navigation">
      <div className="p-6 flex items-center justify-center">
        <img src="/logo.png" alt="Recipe App Logo" className="h-12" />
      </div>
      
      <nav className="flex-1 px-4 mt-6" role="navigation">
        <ul className="space-y-2" role="menu">
          {menuItems.map((item) => (
            <li key={item.id} role="menuitem">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeItem === item.id
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-100'}`}
                aria-current={activeItem === item.id ? 'page' : undefined}
                aria-label={`${item.label} navigation`}
              >
                <span className="mr-3" aria-hidden="true">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;