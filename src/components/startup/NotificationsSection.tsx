import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  FolderLock,
  Check
} from 'lucide-react';

interface Props {
  standalone?: boolean;
}

export const NotificationsSection: React.FC<Props> = ({ standalone = false }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const myNotifications = notifications.filter(n => 
    n.recipientRole === 'startup' || n.recipientUserId === currentUser?.id
  );

  const displayedNotifications = filter === 'unread' 
    ? myNotifications.filter(n => !n.read) 
    : myNotifications;

  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Real-time Alerts
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 6 — Notifications
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Operational alerts on application progression, evidence audit reviews, and milestone releases.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllNotificationsRead();
                addToast('All notifications marked as read.', 'info');
              }}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#0f2b48] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5 text-slate-400" />
              <span>Mark all as read</span>
            </button>
          )}

          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filter === 'all' ? 'bg-white text-[#0f2b48] shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({myNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filter === 'unread' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-slate-500'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="neu-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 space-y-2">
        {displayedNotifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No notifications {filter === 'unread' ? 'unread' : 'found'}.</p>
          </div>
        ) : (
          displayedNotifications.map(notif => {
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`pt-3 first:pt-0 pb-3 last:pb-0 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50/80 p-2 rounded-xl transition-all ${
                  isUnread ? 'bg-orange-50/40' : ''
                }`}
              >
                {/* Icon indicator */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.title.includes('Advanced') || notif.title.includes('Evaluation')
                    ? 'bg-blue-100 text-blue-700'
                    : notif.title.includes('Verified')
                      ? 'bg-emerald-100 text-emerald-700'
                      : notif.title.includes('Shortlisted')
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-[#ea580c]'
                }`}>
                  {notif.title.includes('Verified') ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : notif.title.includes('Evaluation') || notif.title.includes('Advanced') ? (
                    <Award className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs ${isUnread ? 'font-black text-[#0f2b48]' : 'font-bold text-slate-700'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-[#ea580c]">
                    <span>View associated record</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Unread dot */}
                {isUnread && (
                  <div className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
