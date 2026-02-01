"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import SearchForm from "@/components/client/SearchForm";
import BookingList from "@/components/client/BookingList";
import HotelList from "@/components/client/HotelList";

export default function ClientPortal() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"search" | "bookings">("search");

  useEffect(() => {
    if (!user) {
      router.push("/login?returnTo=client");
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-dark-purple/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-neon-lime mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h1 className="text-xl font-bold gradient-text">Client Portal</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "search"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Search Hotels
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "bookings"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                My Bookings
              </button>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
                <button
                  onClick={() => router.push("/profile")}
                  className="text-sm text-neon-lime hover:text-neon-lime/80 font-semibold flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "search" ? (
          <div>
            <SearchForm />
            <HotelList />
          </div>
        ) : (
          <BookingList />
        )}
      </div>
    </div>
  );
}
