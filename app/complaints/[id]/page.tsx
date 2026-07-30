"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share, AlertTriangle, CheckCircle2, Loader2, Trash2, Edit3, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Badge from "@/components/Badge";
import ComplaintMetrics from "@/components/ComplaintMetrics";
import Timeline from "@/components/Timeline";
import { fetchComplaintById, updateComplaintStatus, deleteComplaint, fetchUsers } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ComplaintDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [complaint, setComplaint] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update form states
  const [newStatus, setNewStatus] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category override states
  const [overrideCategory, setOverrideCategory] = useState("");
  const [isOverriding, setIsOverriding] = useState(false);
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Dynamic worker states
  const [workers, setWorkers] = useState<any[]>([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [workersError, setWorkersError] = useState<string | null>(null);

  useEffect(() => {
    if (!complaint?.department_id || !user) return;
    if (user.role !== "dept_admin" && user.role !== "super_admin") return;

    async function getWorkers() {
      setWorkersLoading(true);
      setWorkersError(null);
      try {
        const res = await fetchUsers({
          role: "field_worker",
          department_id: complaint.department_id,
        });
        const list = res.users ?? res ?? [];
        setWorkers(list);
      } catch (err: any) {
        setWorkersError("Failed to load workers. Please refresh.");
      } finally {
        setWorkersLoading(false);
      }
    }

    getWorkers();
  }, [complaint?.department_id, user?.role]);

  const id = params?.id as string;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchComplaintById(id);
      if (res.success) {
        const c = res.complaint;
        const mapped = {
          id: c.id,
          title: c.category + " Issue - " + (c.citizen_name || "Citizen Report"),
          description: c.description,
          priority: c.priority === "critical" || c.priority === "high" ? "CRITICAL" : c.priority === "low" ? "LOW" : "MEDIUM",
          status: c.status === "assigned" ? "Dispatched" : c.status === "in_progress" ? "In Progress" : c.status === "resolved" ? "Resolved" : c.status === "cancelled" ? "Cancelled" : "Pending Approval",
          location: c.latitude && c.longitude ? `${c.latitude}, ${c.longitude}` : "Chattogram City",
          time: `Reported on ${new Date(c.created_at).toLocaleDateString()} • ${new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          image: Array.isArray(c.image_url) && c.image_url.length > 0 ? c.image_url[0] : (typeof c.image_url === "string" ? c.image_url : null),
          category: c.category,
          date: c.created_at,
          reporter: c.citizen_name,
          department_id: c.department_id,
          original: c
        };
        setComplaint(mapped);
        setAssignment(res.assignment);
        setHistory(res.history);
        setNewStatus(c.status);
        setOverrideCategory(c.category || "");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;
    try {
      setIsUpdatingStatus(true);
      const payload: any = { status: newStatus, notes: updateNotes };
      if (newStatus === "assigned") {
        payload.worker_id = selectedWorkerId;
      }
      const res = await updateComplaintStatus(id, payload);
      if (res.success) {
        triggerToast("Complaint progress updated successfully!");
        setUpdateNotes("");
        loadData();
      }
    } catch (err: any) {
      triggerToast(`Failed to update: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCategoryOverride = async () => {
    if (!overrideCategory) return;
    setIsOverriding(true);
    setOverrideError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/complain/${id}/category`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            category: overrideCategory,
            ai_override: true 
          })
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      triggerToast('Category updated successfully');
      // Refresh complaint data
      await loadData();
    } catch (err: any) {
      setOverrideError(err.message);
    } finally {
      setIsOverriding(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      setIsDeleting(true);
      const res = await deleteComplaint(id);
      if (res.success) {
        router.push("/complaints");
      }
    } catch (err: any) {
      triggerToast(`Failed to delete: ${err.message}`);
      setIsDeleting(false);
    }
  };

  const handleCancelComplaint = async () => {
    if (!window.confirm("Are you sure you want to cancel this complaint?")) return;
    try {
      setLoading(true);
      const res = await updateComplaintStatus(id, { status: "cancelled", notes: "Cancelled by citizen." });
      if (res.success) {
        triggerToast("Complaint cancelled successfully!");
        loadData();
      }
    } catch (err: any) {
      triggerToast(`Failed to cancel: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      try {
        navigator.clipboard.writeText(window.location.href)
          .then(() => triggerToast("Ticket link copied to clipboard!"))
          .catch((err) => {
            console.warn("Clipboard copy failed, using fallback toast:", err);
            triggerToast("Ticket link copied to clipboard!");
          });
      } catch (err) {
        console.warn("Clipboard access failed:", err);
        triggerToast("Ticket link copied to clipboard!");
      }
    }
  };

  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      triggerToast("Preparing report print view...");
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar activeNav="complaints" isDashboard />
        <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
            <p className="text-gray-500 text-sm font-bold mt-4 animate-pulse">Loading complaint details...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar activeNav="complaints" isDashboard />
        <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 flex items-center justify-center py-20">
            <div className="bg-white rounded-3xl border border-gray-150 py-16 px-6 text-center shadow-sm max-w-md w-full">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-lg font-bold text-gray-900">Complaint Not Found</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {error || `We couldn't find a report with ID "${id}".`}
              </p>
              <Link href="/complaints">
                <button className="mt-6 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer">
                  Back to Directory
                </button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans print:bg-white print:p-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-scale-up print:hidden">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <div className="print:hidden">
        <Navbar activeNav="complaints" isDashboard />
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 print:py-0 print:px-0">
        
        {/* Sidebar Nav */}
        <div className="hidden md:block print:hidden">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 space-y-6 print:space-y-4">
          
          {/* Breadcrumbs & Action Header */}
          <div className="flex flex-col gap-4">
            {/* Breadcrumb line */}
            <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5 uppercase tracking-wider print:hidden">
              <Link href="/dashboard" className="hover:text-brand-teal transition-colors">
                Dashboard
              </Link>
              <span>&gt;</span>
              <Link href="/complaints" className="hover:text-brand-teal transition-colors">
                Complaints
              </Link>
              <span>&gt;</span>
              <span className="text-brand-teal font-extrabold">{complaint.id}</span>
            </div>

            {/* Back button for mobile/tablet print fallback */}
            <Link
              href="/complaints"
              className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-brand-teal transition-colors uppercase tracking-wider gap-1.5 md:hidden print:hidden"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              Back to list
            </Link>

            {/* Details Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {complaint.title}
                </h1>
                <p className="text-gray-500 text-sm font-semibold mt-1">
                  Reported by <span className="text-gray-700 font-extrabold">{complaint.reporter || "Ahmed Kabir"}</span> on {complaint.time}
                </p>
              </div>

              {/* Action buttons (Share & Export) */}
              <div className="flex items-center gap-3 shrink-0 print:hidden">
                {user && (user.role === "super_admin" || user.id === complaint.original?.citizen_id) && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 stroke-[2.5]" />
                    <span>Delete</span>
                  </button>
                )}
                {user && user.id === complaint.original?.citizen_id && complaint.original?.status === "pending" && (
                  <>
                    <Link href={`/complaints/edit?id=${complaint.id}`}>
                      <button className="flex items-center gap-2 border border-gray-205 hover:border-gray-300 text-gray-700 bg-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer">
                        <Edit3 className="w-4 h-4 text-gray-400 stroke-[2.5]" />
                        <span>Edit</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleCancelComplaint}
                      className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 bg-white px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <Share className="w-4 h-4 text-gray-400 stroke-[2.5]" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
                >
                  {/* Custom PDF download icon */}
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
                  </svg>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Split Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:grid-cols-12 print:gap-4">
            
            {/* Left Card: Evidence / Core Info */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-150 p-5 shadow-sm space-y-5 flex flex-col justify-between print:col-span-5 print:shadow-none">
              
              {complaint.image && (
                <div className="space-y-3 shrink-0">
                  <div className="w-full h-56 relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner border border-gray-100">
                    <img
                      src={complaint.image}
                      alt={complaint.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlaid Priority Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge type="priority" value={complaint.priority} />
                    </div>
                  </div>

                  {/* Thumbnail gallery for multiple uploaded images */}
                  {Array.isArray(complaint.original?.image_url) && complaint.original.image_url.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {complaint.original.image_url.map((imgUrl: string, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => setComplaint((prev: any) => ({ ...prev, image: imgUrl }))}
                          className={`aspect-video rounded-lg overflow-hidden border cursor-pointer hover:border-brand-teal transition-all ${
                            complaint.image === imgUrl ? "border-brand-teal ring-2 ring-brand-teal/20" : "border-gray-255"
                          }`}
                        >
                          <img src={imgUrl} className="w-full h-full object-cover" alt={`Evidence ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Core Info Metadata Grid */}
              <div className="grid grid-cols-1 gap-4.5 py-2 border-t border-slate-50">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-0.5">
                    Category
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-xl text-xs border border-gray-150/40">
                      {complaint.category}
                    </span>
                    {(() => {
                      const scoreVal = parseFloat(complaint.ai_confidence_score ?? complaint.original?.ai_confidence_score);
                      if (isNaN(scoreVal)) return null;
                      return scoreVal < 70 ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase border border-amber-200 select-none">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>Low AI confidence — manual review recommended</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase border border-emerald-200 select-none">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>AI categorized with high confidence</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-0.5 shrink-0">
                    Location
                  </span>
                  <p className="text-right text-xs font-semibold text-gray-700 leading-relaxed max-w-[200px]">
                    {complaint.location}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Assigned to:
                  </span>
                  {assignment ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 text-xxs font-black flex items-center justify-center border border-emerald-100 uppercase shrink-0">
                        {assignment.worker_name ? assignment.worker_name[0] : "W"}
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {assignment.worker_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 italic">
                      Pending Assignment
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Right Card: Description & Metrics */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between print:col-span-7 print:shadow-none">
              
              <div className="space-y-3.5">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">
                  Detailed Description
                </h3>
                <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {/* Performance Metrics Cards */}
              <div className="pt-6 border-t border-slate-50">
                <ComplaintMetrics
                  responseTime={complaint.responseTime}
                  citizensImpacted={complaint.citizensImpacted}
                />
              </div>

            </div>

          </div>

          {/* Admin / Dept Admin operations panel */}
          {user && (user.role === "dept_admin" || user.role === "super_admin") && (
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-brand-teal">
                <Edit3 className="w-5 h-5 stroke-[2.5]" />
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">Admin Action Console</h3>
              </div>
              <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {newStatus === "assigned" && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Assign Field Worker</label>
                    <select
                      value={selectedWorkerId}
                      onChange={(e) => setSelectedWorkerId(e.target.value)}
                      disabled={workersLoading || workers.length === 0}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {workersLoading ? (
                        <option value="">Loading workers...</option>
                      ) : workersError ? (
                        <option value="">Failed to load workers</option>
                      ) : workers.length === 0 ? (
                        <option value="" disabled>No workers available in this department</option>
                      ) : (
                        <>
                          <option value="">Select a field worker...</option>
                          {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>
                              {worker.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {workersError && (
                      <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{workersError}</span>
                    )}
                  </div>
                )}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Transition Notes</label>
                  <input
                    type="text"
                    placeholder="Provide details about status update or assignment..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="w-full bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingStatus ? "Updating..." : "Update Progress"}
                  </button>
                </div>
              </form>

              {/* Category Override Section */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">AI Category Override</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Change the AI-assigned category of this complaint if it was misclassified.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="space-y-1.5 w-full sm:max-w-xs">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">New Category</label>
                    <select
                      value={overrideCategory}
                      onChange={(e) => setOverrideCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-teal bg-white font-semibold text-gray-800"
                    >
                      <option value="Waterlogging">Waterlogging</option>
                      <option value="Road Repair">Road Repair</option>
                      <option value="Waste Management">Waste Management</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleCategoryOverride}
                    disabled={isOverriding || !overrideCategory}
                    className="bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isOverriding ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Override Category"
                    )}
                  </button>
                </div>
                {overrideError && (
                  <p className="text-red-500 text-xs font-semibold">{overrideError}</p>
                )}
              </div>
            </div>
          )}

          {/* Timeline resolution progress */}
          {history.length > 0 && (
            <div className="w-full print:break-inside-avoid">
              <Timeline steps={
                history.map((h, index) => {
                  const isLast = index === history.length - 1;
                  let title = "Report Filed";
                  if (h.new_status === "assigned") title = "Agency Dispatched";
                  else if (h.new_status === "in_progress") title = "Work Started";
                  else if (h.new_status === "resolved") title = "Issue Resolved";
                  else if (h.new_status === "cancelled") title = "Report Cancelled";

                  return {
                    title,
                    status: h.new_status === "assigned" ? "Assigned" : h.new_status === "in_progress" ? "In Progress" : h.new_status === "resolved" ? "Resolved" : h.new_status === "cancelled" ? "Cancelled" : "Pending",
                    description: h.notes || `Complaint status changed to ${h.new_status}.`,
                    time: new Date(h.changed_at).toLocaleDateString() + " • " + new Date(h.changed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    completed: true,
                    current: isLast,
                    bubbleText: h.new_status === "in_progress" ? h.notes : undefined,
                    bubbleImages: []
                  };
                })
              } />
            </div>
          )}

        </main>
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-100/50 border-t border-slate-200 mt-auto print:hidden">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-4">
          <span>&copy; {new Date().getFullYear()} MuniFix Ctg. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#departments" className="hover:text-brand-teal transition-colors">Departments</a>
            <a href="#privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            <a href="https://ccc.gov.bd" target="_blank" rel="noreferrer" className="hover:text-brand-teal transition-colors">
              Chattogram City Corporation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
