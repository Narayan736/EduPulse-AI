import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 shadow-sm">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="self-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              EduPulse AI
            </span>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center gap-5">
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</span>
                    <span className="text-xs text-gray-500 font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <UserIcon size={20} />
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
