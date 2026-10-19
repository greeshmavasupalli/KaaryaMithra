import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Send,
  UserCheck,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

const INITIAL_DEMO_TICKETS = [
  {
    ticketId: 'GRV-2026-884102',
    subject: 'Discrepancy in Sunday emergency visiting rate',
    category: 'Billing & Pricing Transparency',
    urgency: 'medium',
    slaHours: 24,
    status: 'Under Review by Triage',
    createdAt: '2 hours ago',
    targetEntity: 'Ramesh Kumar (Electrician)',
    steps: [
      { title: 'Ticket Lodged', time: '2 hours ago', done: true },
      { title: 'Assigned to Ward Coordinator', time: '1 hour ago', done: true },
      { title: 'Community Moderation Review', time: 'In Progress (Target: 22h left)', done: false },
      { title: 'Resolution & Mutual Audit Note', time: 'Pending', done: false },
    ],
    notes: 'Coordinator contacted worker to align displayed indicative pricing with weekend emergency visits.',
  },
  {
    ticketId: 'GRV-2026-913401',
    subject: 'Safety concern: Unverified visitor accompanying worker',
    category: 'Safety & Conduct Safeguards',
    urgency: 'emergency',
    slaHours: 2,
    status: 'Investigating with Local RWA',
    createdAt: '45 mins ago',
    targetEntity: 'Service Visit #98124',
    steps: [
      { title: 'Emergency Flag Logged', time: '45 mins ago', done: true },
      { title: 'Automated Account Hold Triggered', time: '40 mins ago', done: true },
      { title: 'Direct Phone Triage Call', time: '25 mins ago', done: true },
      { title: 'RWA & Resident Clarification', time: 'In Progress (Target: 1h 15m left)', done: false },
    ],
    notes: 'Worker profile temporarily placed in private queue pending safety clarification with household.',
  },
  {
    ticketId: 'GRV-2026-302194',
    subject: 'Service radius limit clarification for Kurmannapalem',
    category: 'Platform & Location Scope',
    urgency: 'low',
    slaHours: 48,
    status: 'Resolved',
    createdAt: 'Yesterday',
    targetEntity: 'Suresh Varma (Plumber)',
    steps: [
      { title: 'Query Submitted', time: 'Yesterday', done: true },
      { title: 'Location Boundary Checked', time: 'Yesterday', done: true },
      { title: 'Radius Updated with Provider', time: 'Yesterday', done: true },
      { title: 'Resolved & Closed', time: 'Today 9:30 AM', done: true },
    ],
    notes: 'Confirmed 15km service radius extending to Kurmannapalem steel plant colony. Ticket resolved satisfactorily.',
  },
];

export const GrievanceTicketSystem = () => {
  const [activeTab, setActiveTab] = useState('track'); // 'track' | 'submit'
  const [tickets, setTickets] = useState(INITIAL_DEMO_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(INITIAL_DEMO_TICKETS[0]);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Safety & Conduct Safeguards');
  const [urgency, setUrgency] = useState('medium');
  const [targetEntity, setTargetEntity] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newTicketId = 'GRV-2026-' + Math.floor(100000 + Math.random() * 900000);
    const sla = urgency === 'emergency' ? 2 : urgency === 'high' ? 6 : urgency === 'medium' ? 24 : 48;

    const newTicket = {
      ticketId: newTicketId,
      subject: subject.trim(),
      category,
      urgency,
      slaHours: sla,
      status: 'Submitted',
      createdAt: 'Just now',
      targetEntity: targetEntity || 'General Community Report',
      steps: [
        { title: 'Ticket Lodged', time: 'Just now', done: true },
        { title: 'Triage Queue Assignment', time: `In Progress (Target: within ${sla}h)`, done: false },
        { title: 'Independent Review', time: 'Pending', done: false },
        { title: 'Resolution Notice', time: 'Pending', done: false },
      ],
      notes: 'New grievance logged into KaaryaMithra community safety tracker. Supervisor notified.',
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setSubmittedTicket(newTicket);
    setActiveTab('track');

    // Reset fields
    setSubject('');
    setDescription('');
    setTargetEntity('');
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Module Title Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Pillar 3: RESOLVE</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Grievance Redressal & Support Ticket Portal
          </h3>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Transparent dispute resolution with time-bound response SLAs (2h Emergency / 24h Standard) and automated review triggers for repeat complaints.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-xl border border-slate-300/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-teal-800 shadow-xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Track Existing Tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-white text-teal-800 shadow-xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            + File New Grievance
          </button>
        </div>
      </div>

      {/* Main Body */}
      {activeTab === 'track' ? (
        <div className="p-6 space-y-6">
          {submittedTicket && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-950 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Ticket <strong>{submittedTicket.ticketId}</strong> created successfully! Guaranteed response within <strong>{submittedTicket.slaHours} hours</strong>.
                </span>
              </div>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
            <input
              type="text"
              placeholder="Search by Ticket ID (e.g. GRV-2026-884102) or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent border-none outline-hidden text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Master Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ticket List (Left Col) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active & Tracked Tickets
              </span>

              {filteredTickets.map((t) => (
                <div
                  key={t.ticketId}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.ticketId === t.ticketId
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {t.ticketId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.urgency === 'emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-navy-950 mt-1 line-clamp-1">
                    {t.subject}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{t.category}</span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <Clock className="w-3 h-3" />
                      {t.slaHours}h SLA
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ticket Detail (Right Col) */}
            <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-5">
              {selectedTicket ? (
                <>
                  <div className="space-y-2 border-b border-slate-200 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-extrabold text-teal-800 bg-teal-100 px-3 py-1 rounded-lg">
                        {selectedTicket.ticketId}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Logged: <strong>{selectedTicket.createdAt}</strong>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-navy-950">
                      {selectedTicket.subject}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 font-medium">
                        Target: {selectedTicket.targetEntity}
                      </span>
                      <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200 font-semibold">
                        SLA Window: {selectedTicket.slaHours} Hours
                      </span>
                    </div>
                  </div>

                  {/* Audit Trail Steps */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">
                      Investigation & Resolution Timeline
                    </span>

                    <div className="space-y-3 pl-2 border-l-2 border-teal-200 ml-2">
                      {selectedTicket.steps.map((st, idx) => (
                        <div key={idx} className="relative pl-5 text-xs">
                          <div
                            className={`absolute -left-[19px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              st.done
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-300 text-slate-600 ring-2 ring-white'
                            }`}
                          >
                            {st.done ? '✓' : idx + 1}
                          </div>
                          <div className="font-semibold text-slate-900">{st.title}</div>
                          <div className="text-[11px] text-slate-500">{st.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Triage / Resolution Notes */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      Moderation Triage Action Note:
                    </span>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{selectedTicket.notes}"
                    </p>
                  </div>

                  {/* Redressal Policy Note */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Automated Threshold Policy:</strong> If any worker or customer accumulates 2+ verified safety/conduct grievances within 30 days, their listing is automatically paused and escalated to the Seva Community Council.
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  Select a ticket to inspect live tracking and resolution milestones.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleCreateTicket} className="p-6 space-y-4 max-w-2xl mx-auto">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
            <h4 className="font-bold text-slate-900">Submit a Formal Community Grievance</h4>
            <p className="text-slate-500">
              All submissions are timestamped, encrypted, and governed by strict response deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="Safety & Conduct Safeguards">🚨 Safety & Conduct Safeguards (2h SLA)</option>
                <option value="Billing & Pricing Transparency">💰 Billing & Pricing Transparency (6h SLA)</option>
                <option value="Service Quality & Dispute">⚠️ Service Quality & Workmanship Dispute (24h SLA)</option>
                <option value="Platform & Location Scope">📍 Platform & Location Scope</option>
                <option value="Verification & Badge Inquiry">🛡️ Verification & Badge Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Urgency Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="emergency">Emergency (2-Hour Triage Response)</option>
                <option value="high">High Priority (6-Hour Triage Response)</option>
                <option value="medium">Standard (24-Hour Redressal Response)</option>
                <option value="low">General (48-Hour Response)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unfair visiting rate charged above indicative quote"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Related Worker or Service Visit ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar or VISIT-98412"
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Narrative & Evidence Summary
            </label>
            <textarea
              rows={4}
              placeholder="Provide specific dates, timings, agreed terms, and details of the incident..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket & Generate Tracking ID</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
