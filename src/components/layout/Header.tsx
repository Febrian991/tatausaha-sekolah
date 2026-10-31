import React, { useState } from 'react';
import { User, NotificationItem, SchoolProfile } from '../../types';
import { 
  Bell, 
  LogOut, 
  School, 
  ChevronDown, 
  Check, 
  Clock, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  schoolProfile: SchoolProfile;
  notifications: NotificationItem[];
  onLogout: () => void;
  onNavigateTab: (tab: string) => void;
  onMarkNotificationAsRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  schoolProfile,
  notifications,
  onLogout,
  onNavigateTab,
  onMarkNotificationAsRead
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter notifications for current user role or all
  const relevantNotifs = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === currentUser.role
  );
  const unreadCount = relevantNotifs.filter((n) => !n.isRead).length;

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'operator':
        return '👑 Operator & Super Admin';
      case 'tu':
        return '📋 Tata Usaha (TU)';
      case 'bendahara':
        return '💰 Bendahara Sekolah';
      case 'kepsek':
        return '🏛️ Kepala Sekolah';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Left: School Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">
            {schoolProfile.namaSekolah}
          </h1>
          <p className="text-[11px] text-slate-500">
            NPSN: {schoolProfile.npsn} · {schoolProfile.kabupatenKota}
          </p>
        </div>
      </div>

      {/* Right: Notification & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowUserDropdown(false);
            }}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Pemberitahuan Kedinasan"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">
                  Pemberitahuan Kedinasan ({unreadCount} Baru)
                </span>
                <span className="text-[11px] text-slate-500">SIMAS Real-time</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {relevantNotifs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Tidak ada pemberitahuan baru
                  </div>
                ) : (
                  relevantNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationAsRead(n.id);
                        if (n.linkTab) onNavigateTab(n.linkTab);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-300">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.nama.charAt(0)
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.nama}
              </div>
              <div className="text-[10px] text-blue-700 font-semibold">{getRoleLabel()}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-800">{currentUser.nama}</div>
                <div className="text-[11px] text-slate-500 font-mono">NIP: {currentUser.nip}</div>
                <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                  {currentUser.jabatan}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Sistem</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
