import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Pie,
  Legend,
  PieChart
} from "recharts";

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);



  const COLORS = {
    VIP: "#4F46E5",
    General: "#F59E0B",
    Free: "#10B981",
    Other: "#EF4444", // fallback
  };

  const getColor = (type) => COLORS[type] || COLORS["Other"];


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/organizer/stats", {
          method: "GET",
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching organizer stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );

  if (!stats)
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        Failed to load dashboard data.
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 Organizer Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Events" value={stats.totalEvents} icon="📅" />
        <StatCard title="Registrations" value={stats.totalRegistrations} icon="🧾" />
        <StatCard title="Revenue" value={`Rs. ${stats.totalRevenue}`} icon="💰" />
      </div>

      {/* Sales Trend Line Chart */}
      <DashboardSection title="📈 Ticket Sales Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardSection>

      {/* Bookings per Event Bar Chart */}
      <DashboardSection title="📌 Bookings per Event">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.bookingsPerEvent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="eventName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardSection>

      {/* Paid vs Unpaid Registrations */}
      <DashboardSection title="💳 Paid vs. Unpaid Registrations">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.paidStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardSection>

      {/* Ticket Type Distribution Pie Chart */}
      <DashboardSection title="🥧 Ticket Type Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.ticketTypeDistribution}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.ticketTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry._id)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              payload={stats.ticketTypeDistribution.map((entry) => ({
                value: entry._id,
                type: "square",
                color: getColor(entry._id),
              }))}
            />
          </PieChart>
        </ResponsiveContainer>
      </DashboardSection>

      {/* Event Ticket Stats */}
      <DashboardSection title="🎫 Ticket Breakdown per Event">
        <div className="space-y-6">
          {stats.eventStats.map((event) => (
            <div
              key={event.eventId}
              className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-2 flex justify-between items-center">
                <h4 className="text-lg font-semibold text-indigo-700">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {event.ticketStats.map((ticket) => (
                  <div
                    key={ticket.type}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <h5 className="font-medium text-gray-800">{ticket.type}</h5>
                    <p className="text-sm text-green-600">
                      Sold: {ticket.sold}
                    </p>
                    <p className="text-sm text-yellow-600">
                      Available: {ticket.available}
                    </p>
                    <p className="text-sm text-blue-600">
                      Revenue: Rs. {ticket.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-xl p-5 text-center border border-gray-100 hover:shadow-md transition">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="text-gray-700 text-sm font-medium mb-1">{title}</h4>
    <p className="text-xl font-bold text-indigo-600">{value}</p>
  </div>
);

const DashboardSection = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="bg-white border rounded-xl p-4 shadow-sm">{children}</div>
  </div>
);

export default OrganizerDashboard;
