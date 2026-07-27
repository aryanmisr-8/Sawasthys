import React, { useState, useEffect } from "react";
import {
  MapPin,
  PhoneCall,
  Star,
  CheckCircle2,
  Building,
  Navigation,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Search,
  Crosshair,
} from "lucide-react";
import { Doctor } from "../types";
import { SAMPLE_DOCTORS, INDIAN_CITIES } from "../data/doctorsDatabase";

export const NearbyDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(SAMPLE_DOCTORS);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Location set to Bengaluru");

  // Calculate Haversine distance in KM between user coordinates and doctor coordinates
  const calculateDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Browser Geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting GPS location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);
        setLocationStatus(`GPS coordinates detected (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`);

        // Recalculate distances
        const updated = SAMPLE_DOCTORS.map((d) => ({
          ...d,
          distanceKm: calculateDistanceKm(coords.lat, coords.lng, d.lat, d.lng),
        }));
        setDoctors(updated);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus("GPS access denied. Select your city manually below.");
      },
      { timeout: 10000 }
    );
  };

  // Handle city selection fallback
  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const cityObj = INDIAN_CITIES.find((c) => c.name === cityName);
    if (cityObj) {
      setUserLocation({ lat: cityObj.lat, lng: cityObj.lng });
      setLocationStatus(`Showing doctors near ${cityName}`);

      const updated = SAMPLE_DOCTORS.map((d) => ({
        ...d,
        distanceKm: calculateDistanceKm(cityObj.lat, cityObj.lng, d.lat, d.lng),
      }));
      setDoctors(updated);
    }
  };

  useEffect(() => {
    // Initial distance calculation based on Bengaluru default
    handleCityChange("Bengaluru");
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    if (specialtyFilter === "All") return true;
    return doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                ABHA & Tele-MANAS Directory
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Browser GPS & Metro City Locator
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Verified Doctors & Clinical Specialists Near You
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Find verified Indian Psychiatrists, Clinical Pharmacologists, Cardiologists, and General Physicians linked with ABHA digital health accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Crosshair className="w-4 h-4 text-emerald-100" />
              {isLocating ? "Locating GPS..." : "Auto-Detect My GPS Location"}
            </button>
          </div>
        </div>

        {/* Location status bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium text-slate-800">
            <MapPin className="w-4 h-4 text-emerald-600" /> {locationStatus}
          </span>
          <a
            href="tel:108"
            className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-bounce" /> Emergency Ambulance: 108
          </a>
        </div>
      </div>

      {/* Filter Controls: City Dropdown & Specialty Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* City Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-600 font-semibold shrink-0">City in India:</span>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-full md:w-48"
          >
            {INDIAN_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
          {["All", "Psychiatrist", "Pharmacologist", "Cardiologist", "Medicine"].map((s) => (
            <button
              key={s}
              onClick={() => setSpecialtyFilter(s)}
              className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
                specialtyFilter === s
                  ? "bg-emerald-600 border-emerald-700 text-white font-semibold shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                  <span className="text-xs text-emerald-700 font-semibold block">{doc.specialty}</span>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">{doc.qualification}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs px-2 py-0.5 rounded font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {doc.rating}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{doc.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Distance: <strong className="text-emerald-700">{doc.distanceKm ?? 2.5} km away</strong></span>
                <span>Consultation Fee: <strong className="text-slate-900">₹{doc.consultationFeeINR}</strong></span>
              </div>

              <div className="flex items-center justify-between">
                {doc.abhaConnected && (
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> ABHA ID Queue Ready
                  </span>
                )}
                <span className="text-[10px] text-slate-500">{doc.experienceYears} Yrs Exp.</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${doc.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Call Clinic
                </a>
                <button
                  onClick={() => alert(`Appointment request queued with ${doc.name} via ABHA ID!`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs shadow-sm transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Consultation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
