'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { User, MapPin, Globe2, Award, Calendar, Wallet, Heart, Edit3, X, Check, Camera } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, trips, refreshData } = useTripContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editBio, setEditBio] = useState(user.bio);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditAvatar(user.avatar);
    setEditBio(user.bio);
    setFeedback(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          avatar: editAvatar,
          bio: editBio,
        }),
      });

      const data = await res.json();
      if (data?.success) {
        await refreshData();
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => {
          setIsEditing(false);
          setFeedback(null);
        }, 1200);
      } else {
        setFeedback({ type: 'error', message: data?.message || 'Failed to update profile.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-5xl mx-auto w-full">
          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-100 shadow-md"
              />
              <span className="absolute bottom-1 right-1 bg-sky-500 text-slate-950 p-1.5 rounded-full border-2 border-white">
                <Award className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                  <span className="text-sky-600 font-semibold text-xs uppercase tracking-wider">
                    {user.memberType} • {user.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenEdit}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      await refreshData();
                      router.push('/login');
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xl mb-4">{user.bio}</p>

              <div className="flex flex-wrap gap-2">
                {user.favoriteDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-sky-600" />
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">{user.countriesVisited}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Countries Visited
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">{trips.length}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Trips Planned
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-slate-900 block">
                ₹{(user.totalBudgetSpent / 100000).toFixed(2)}L
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total Lifetime Spend
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                <p className="text-xs text-slate-500">Update your account profile & avatar information.</p>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3.5 mb-5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Preview & Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={editAvatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-sky-500 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
                    }}
                  />
                  <div className="flex-1">
                    <span className="text-xs text-slate-500 block mb-1">Pick a preset avatar:</span>
                    <div className="flex items-center gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatar(url)}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            editAvatar === url ? 'border-sky-600 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Or enter custom Image URL (https://...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short bio about your travel style..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-sm hover:shadow cursor-pointer inline-flex items-center gap-2"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

