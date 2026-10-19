import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Shield,
  AlertTriangle,
  BarChart3,
  Users,
  Grid,
  FileText,
  CheckCircle2,
  XCircle,
  EyeOff,
  UserX,
  Search,
  Filter,
  Plus,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);

  // Data states
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);

  // Report resolution modal / state
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('none');
  const [resolvingStatus, setResolvingStatus] = useState('resolved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [repRes, metRes, logRes, catRes, workRes] = await Promise.all([
        api.get('/admin/reports'),
        api.get('/admin/metrics'),
        api.get('/admin/audit-logs'),
        api.get('/categories'),
        api.get('/workers?limit=25'),
      ]);

      if (repRes.success) setReports(repRes.data);
      if (metRes.success) setMetrics(metRes.metrics);
      if (logRes.success) setAuditLogs(logRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (workRes.success) setWorkers(workRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleResolveReport = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setIsSubmitting(true);

    try {
      const res = await api.patch(`/admin/reports/${selectedReport._id}`, {
        status: resolvingStatus,
        adminNotes,
        actionTaken,
      });

      if (res.success) {
        setSelectedReport(null);
        setAdminNotes('');
        setActionTaken('none');
        await loadAllAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleListing = async (workerId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'hidden' : 'published';
    const reason = prompt(`Enter reason for setting listing status to ${nextStatus}:`, 'Moderation safeguard check');
    if (reason === null) return;

    try {
      await api.patch(`/admin/workers/${workerId}/status`, {
        status: nextStatus,
        reason,
      });
      await loadAllAdminData();
    } catch (err) {
      alert(err.message || 'Failed to change listing status.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await api.post('/categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      if (res.success) {
        setNewCatName('');
        setNewCatDesc('');
        await loadAllAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create category.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-navy-950">KaaryaMithra Moderation Portal</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-protected safeguard panel for reviewing reports, monitoring audit trails, and listing controls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>Moderator Access Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reports Queue ({reports.filter((r) => r.status === 'pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'metrics'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Platform Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Worker Listings ({workers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Community Safeguard Reports
            </h2>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No reports submitted.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <div key={rep._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            rep.status === 'pending'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {rep.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900 capitalize">
                          {rep.reason.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Target: {rep.targetType} ({rep.targetSummary?.displayName || rep.targetId})
                        </span>
                      </div>

                      {rep.details && (
                        <p className="text-xs text-slate-600 italic">"{rep.details}"</p>
                      )}

                      <div className="text-[11px] text-slate-400">
                        Reported on {new Date(rep.createdAt).toLocaleString()}
                        {rep.adminNotes && (
                          <span className="text-indigo-700 ml-2">
                            • Admin Note: {rep.adminNotes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setAdminNotes(rep.adminNotes || '');
                        }}
                        className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold text-xs rounded-lg border border-indigo-200 transition"
                      >
                        Triage & Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Platform Metrics */}
      {activeTab === 'metrics' && metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Workers</span>
            <div className="text-2xl font-bold text-navy-950">{metrics.workers.total}</div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {metrics.workers.published} Published listings
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Enquiries</span>
            <div className="text-2xl font-bold text-teal-700">{metrics.enquiries.total}</div>
            <span className="text-[11px] text-slate-400">
              {metrics.enquiries.completed} marked Completed
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Safeguard Reports</span>
            <div className="text-2xl font-bold text-rose-600">{metrics.reports.total}</div>
            <span className="text-[11px] text-rose-600 font-medium">
              {metrics.reports.pending} Pending review
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Active Categories</span>
            <div className="text-2xl font-bold text-indigo-700">
              {metrics.categories.activeCount}
            </div>
            <span className="text-[11px] text-slate-400">Covering major home services</span>
          </div>
        </div>
      )}

      {/* TAB 3: Worker Listings Controls */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
            Worker Directory Management
          </h2>
          <div className="divide-y divide-slate-100">
            {workers.map((w) => (
              <div key={w._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{w.displayName}</span>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {w.categories?.[0]?.name || 'Trade'}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        w.profileStatus === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {w.profileStatus}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Locality: {w.locality}, {w.districtCity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleListing(w._id, w.profileStatus)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      w.profileStatus === 'published'
                        ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                    }`}
                  >
                    {w.profileStatus === 'published' ? 'Hide Listing' : 'Publish Listing'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Categories Management */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Active Trade Categories ({categories.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Add New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Mason / Civil Work"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Describe typical tasks..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
            Moderation Audit Trail
          </h2>
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No moderation logs yet.</p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 font-mono">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Target: <strong className="font-mono text-slate-800">{log.targetType}</strong> • Reason: {log.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Triage / Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border">
            <h3 className="font-bold text-sm text-navy-950">
              Resolve Report: {selectedReport.reason.replace(/_/g, ' ')}
            </h3>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div>Target: {selectedReport.targetType} ({selectedReport.targetId})</div>
              {selectedReport.details && <div className="text-slate-600 italic">"{selectedReport.details}"</div>}
            </div>

            <form onSubmit={handleResolveReport} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Resolution Decision
                </label>
                <select
                  value={resolvingStatus}
                  onChange={(e) => setResolvingStatus(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-white"
                >
                  <option value="resolved">Mark as Resolved</option>
                  <option value="dismissed">Dismiss (No violation found)</option>
                  <option value="reviewing">Keep Under Review</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Safeguard Enforcement Action
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-white"
                >
                  <option value="none">No Content Modification</option>
                  <option value="hide_content">Hide Reported Listing / Review</option>
                  <option value="suspend_user">Suspend Account</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Admin Resolution Note (Recorded in Audit Log)
                </label>
                <textarea
                  rows={2}
                  required
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record rationale for moderation action..."
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-3 py-1.5 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm"
                >
                  {isSubmitting ? 'Recording...' : 'Record Decision & Audit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
