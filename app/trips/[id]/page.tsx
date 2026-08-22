'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useTripContext } from '@/context/TripContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Share2,
  Edit3,
  PieChart,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';

export default function TripOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const { trips, updateTrip } = useTripContext();
  const { showAlert } = useConfirmDialog();
  const trip = trips.find((t) => t.id === tripId) || trips[0];

  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<number | ''>(trip?.totalBudget || 50000);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget && Number(newBudget) > 0 && trip) {
      await updateTrip(trip.id, { totalBudget: Number(newBudget) });
      setShowBudgetModal(false);
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Trip not found.</p>
      </div>
    );
  }

  const remainingBudget = trip.totalBudget - trip.spentBudget;
  const daysCount = 7;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        <Header />

        <main className="pt-20 pb-16 min-h-screen">
          {/* Hero Banner */}
          <div
            className="relative w-full h-80 mb-8 flex items-end p-10 bg-cover bg-center shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4), transparent), url('${trip.coverImage}')`,
            }}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between w-full gap-4 text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-sky-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {trip.status}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white font-medium text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{trip.title}</h1>
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" /> {trip.startDate} to {trip.endDate} ({daysCount} Days)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showAlert({ title: 'Link Copied', message: 'Shareable trip link copied to clipboard!', variant: 'success' });
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer border border-white/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Trip</span>
                </button>
                <Link
                  href={`/trips/${trip.id}/builder`}
                  className="bg-sky-500 text-slate-950 hover:bg-sky-400 text-xs font-bold px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Itinerary</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="px-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">
                  Destinations
                </span>
                <span className="text-xl font-bold text-slate-900 truncate block">
                  {trip.destinations.map((d) => d.cityName).join(', ')}
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">
                  Activities Planned
                </span>
                <span className="text-xl font-bold text-slate-900">{trip.activities.length} Events</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">
                    Total Budget
                  </span>
                  <button
                    onClick={() => {
                      setNewBudget(trip.totalBudget);
                      setShowBudgetModal(true);
                    }}
                    className="text-sky-600 hover:text-sky-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <span className="text-xl font-bold text-slate-900">₹{trip.totalBudget.toLocaleString()}</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block mb-1">
                  Remaining Margin
                </span>
                <span className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  ₹{remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Route Sequence Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Multi-City Sequence Route</h2>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {trip.destinations.map((dest, i) => (
                  <React.Fragment key={dest.id}>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 pr-5 shrink-0">
                      <img
                        src={dest.image}
                        alt={dest.cityName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{dest.cityName}</h4>
                        <p className="text-xs text-slate-500">{dest.country}</p>
                      </div>
                    </div>

                    {i < trip.destinations.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-sky-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Day Breakdown Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Itinerary Overview</h2>
                <Link
                  href={`/trips/${trip.id}/builder`}
                  className="text-sky-600 font-semibold text-xs hover:underline flex items-center gap-1"
                >
                  Open Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((dayNum) => {
                  const acts = trip.activities.filter((a) => a.dayNumber === dayNum);
                  return (
                    <div key={dayNum} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                            {dayNum}
                          </span>
                          <span>Day {dayNum} Plan</span>
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">{acts.length} Activities</span>
                      </div>

                      {acts.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No activities assigned for this day yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {acts.map((a) => (
                            <div key={a.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                              <span className="text-sky-700 font-semibold text-[10px] block uppercase">
                                {a.category} • {a.time}
                              </span>
                              <span className="font-bold text-slate-900 block truncate">{a.title}</span>
                              <span className="text-slate-500 text-[11px] block">₹{a.cost.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Edit Total Budget Modal Drawer */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Total Trip Budget</h3>
                <button onClick={() => setShowBudgetModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBudget} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Total Planned Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={newBudget === 0 ? '' : newBudget}
                    onChange={(e) => setNewBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-full text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-full text-xs shadow-md cursor-pointer"
                  >
                    Save Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
