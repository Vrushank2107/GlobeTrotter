'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import {
  User as UserIcon,
  MapPin,
  Globe2,
  Award,
  Calendar,
  Wallet,
  Heart,
  Edit3,
  Trash2,
  Globe,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Upload,
  Loader2,
  LogOut,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, trips, refreshData } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
  });

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setProfileForm((prev) => ({ ...prev, avatar: dataUrl }));
          user.avatar = dataUrl;
          await showAlert({
            title: 'Profile Photo Updated',
            message: 'Your profile picture has been updated successfully!',
            variant: 'success',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState('English');
  const [savedDests, setSavedDests] = useState<string[]>(user.favoriteDestinations);
  const [newDestInput, setNewDestInput] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      user.name = profileForm.name;
      user.email = profileForm.email;
      user.avatar = profileForm.avatar;
      user.bio = profileForm.bio;
      await new Promise((resolve) => setTimeout(resolve, 400));
      setShowEditModal(false);
      await showAlert({
        title: 'Profile Updated',
        message: 'Your profile details have been successfully updated!',
        variant: 'success',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshData();
      router.push('/login');
    } catch {
      setLoggingOut(false);
    }
  };

  const handleAddSavedDest = () => {
    if (newDestInput.trim() && !savedDests.includes(newDestInput.trim())) {
      setSavedDests([...savedDests, newDestInput.trim()]);
      setNewDestInput('');
    }
  };

  const handleRemoveSavedDest = (destName: string) => {
    setSavedDests(savedDests.filter((d) => d !== destName));
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      await showAlert({
        title: 'Confirmation Required',
        message: 'Please type DELETE to confirm account deletion.',
        variant: 'warning',
      });
      return;
    }
    setDeletingAccount(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await refreshData();
      router.push('/login');
    } catch {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-24 pb-16 px-10 min-h-screen max-w-5xl mx-auto w-full space-y-8">
          {/* Hidden File Input for Image Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageFileUpload}
            className="hidden"
            id="global-profile-image-upload"
          />

          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col md:flex-row items-center gap-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to change profile photo"
            >
              <img
                src={profileForm.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={profileForm.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-100 shadow-md group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-slate-950/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-sky-400 mb-0.5" />
                <span className="text-[10px] font-bold">Edit Photo</span>
              </div>
              <span className="absolute bottom-1 right-1 bg-sky-500 text-slate-950 p-1.5 rounded-full border-2 border-white z-10">
                <Award className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{profileForm.name}</h1>
                  <span className="text-sky-600 font-semibold text-xs uppercase tracking-wider">
                    {user.memberType} • {profileForm.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-700 border border-red-200 font-semibold text-xs px-5 py-2.5 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-3.5 h-3.5 text-red-600 animate-spin" />
                    ) : (
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xl mb-4">{profileForm.bio}</p>

              <div className="flex flex-wrap gap-2">
                {savedDests.map((dest) => (
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

          {/* Preferences & Saved Destinations Settings Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Preferences & Saved Destinations</h2>

            {/* Language Preference */}
            <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" /> Language Preference
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Select your preferred system interface language</p>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-sky-500"
              >
                <option value="English">English (US)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>

            {/* Saved Destinations Manager */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Saved Destinations List
              </h3>
              <p className="text-xs text-slate-500 mb-4">Manage your bookmarked cities of interest for future itineraries</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {savedDests.map((dest) => (
                  <span
                    key={dest}
                    className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2"
                  >
                    <span>{dest}</span>
                    <button
                      onClick={() => handleRemoveSavedDest(dest)}
                      className="text-slate-400 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newDestInput}
                  onChange={(e) => setNewDestInput(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddSavedDest}
                  className="bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-red-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Danger Zone: Delete Account
              </h3>
              <p className="text-xs text-red-700 mt-1">
                Permanently remove your account, saved itineraries, expense history, and profile data.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-full transition-all shrink-0 cursor-pointer shadow-xs"
            >
              Delete Account
            </button>
          </div>
        </main>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Profile Details</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={profileForm.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-100 shrink-0 shadow-xs"
                    />
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>Upload Image File...</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Traveler Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md inline-flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Account Permanently</h3>
              <p className="text-xs text-slate-500 mb-6">
                Are you sure you want to delete your account? Type <strong>DELETE</strong> below to confirm.
              </p>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-center font-bold tracking-widest outline-none focus:border-red-500 mb-6"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-full text-xs shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {deletingAccount ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
