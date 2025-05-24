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
  PieChart,
  Area
} from "recharts";
import { Calendar, ChevronDown, LayoutDashboard, Users, DollarSign, TrendingUp, BarChart2, CreditCard, PieChart as PieIcon, Ticket } from "lucide-react";

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all"); // "all", "month", "sixMonths", "year"
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Updated color scheme with more modern palette
  const COLORS = {
    VIP: "#4F46E5", // indigo
    General: "#7C3AED", // purple
    Free: "#EC4899", // pink
    Other: "#8B5CF6", // violet
  };

  const getColor = (type) => COLORS[type] || COLORS["Other"];

  const fetchStats = async (period = "all") => {
    setLoading(true);
    try {
      // Add period as a query parameter
      const res = await fetch(`/api/organizer/stats?period=${period}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data);

      setStats(data);
    } catch (err) {
      console.error("Error fetching organizer stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (period) => {
    setTimeFilter(period);
    setIsFilterOpen(false);
  };

  // Get filter display text
  const getFilterText = () => {
    switch (timeFilter) {
      case "month":
        return "Last Month";
      case "sixMonths":
        return "Last 6 Months";
      case "year":
        return "Last Year";
      default:
        return "All Time";
    }
  };

  // First useEffect - fetch stats when timeFilter changes
  useEffect(() => {
    fetchStats(timeFilter);
  }, [timeFilter]);

  // Second useEffect - debug sales trend data
  useEffect(() => {
    if (stats && stats.salesTrend) {
      console.log("Sales trend data:", stats.salesTrend);
    }
  }, [stats]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-2"></div>
          <div className="h-4 w-48 bg-indigo-100 rounded"></div>
        </div>
      </div>
    );

  if (!stats)
    return (
      <div className="text-center mt-10 p-6 bg-red-50 rounded-xl border border-red-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-600 font-medium">Failed to load dashboard data.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header with filter */}
      <div className="bg-white rounded-2xl shadow-sm px-6 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <LayoutDashboard size={24} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-marcellus">Analytics Dashboard</h2>
        </div>

        {/* Time Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors font-inter text-gray-700"
          >
            <Calendar size={18} className="text-indigo-600" />
            <span>{getFilterText()}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 font-inter overflow-hidden">
              {["all", "month", "sixMonths", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => handleFilterChange(period)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors ${timeFilter === period
                    ? "bg-indigo-50 text-indigo-700 font-medium border-l-4 border-indigo-600"
                    : "text-gray-700"
                    }`}
                >
                  {period === "all" && "All Time"}
                  {period === "month" && "Last Month"}
                  {period === "sixMonths" && "Last 6 Months"}
                  {period === "year" && "Last Year"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Calendar size={24} className="text-indigo-600" />}
          trend="+12%"
          color="indigo"
        />
        <StatCard
          title="Registrations"
          value={stats.totalRegistrations}
          icon={<Users size={24} className="text-purple-600" />}
          trend="+8%"
          color="purple"
        />
        <StatCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} className="text-emerald-600" />}
          trend="+15%"
          color="emerald"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Line Chart */}
        <DashboardSection
          title="Ticket Sales Over Time"
          icon={<TrendingUp size={20} className="text-indigo-600" />}
        >
          {stats.salesTrend && stats.salesTrend.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.salesTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="_id"
                    stroke="#6B7280"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500 font-medium">No sales data available</p>
              <p className="text-gray-400 text-sm mt-1">Create events and get bookings to see sales trends</p>
            </div>
          )}
        </DashboardSection>

        {/* Bookings per Event Bar Chart */}
        <DashboardSection
          title="Bookings per Event"
          icon={<BarChart2 size={20} className="text-purple-600" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bookingsPerEvent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="eventName" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                barSize={40}
              >
                {stats.bookingsPerEvent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(124, 58, 237, ${0.5 + (index * 0.1)})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardSection>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paid vs Unpaid Registrations */}
        <DashboardSection
          title="Paid vs. Unpaid Registrations"
          icon={<CreditCard size={20} className="text-pink-600" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.paidStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="_id" type="category" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                barSize={30}
              >
                {stats.paidStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry._id.toLowerCase().includes('paid') ? '#10B981' : '#F59E0B'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardSection>

        {/* Ticket Type Distribution Pie Chart */}
        <DashboardSection
          title="Ticket Type Distribution"
          icon={<PieIcon size={20} className="text-violet-600" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.ticketTypeDistribution}
                dataKey="value"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {stats.ticketTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry._id)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`${value} tickets`, name]}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardSection>
      </div>

      {/* Event Ticket Stats */}
      <DashboardSection
        title="Ticket Breakdown per Event"
        icon={<Ticket size={20} className="text-indigo-600" />}
        fullWidth
      >
        <div className="space-y-6">
          {stats.eventStats.map((event) => (
            <div
              key={event.eventId}
              className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Calendar size={18} className="text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 font-inter">
                    {event.title}
                  </h4>
                </div>
                <div className="px-3 py-1 bg-indigo-50 rounded-full text-xs text-indigo-700 font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                {event.ticketStats.map((ticket) => (
                  <div
                    key={ticket.type}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-800 font-inter">{ticket.type}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.type === 'VIP' ? 'bg-indigo-100 text-indigo-700' :
                        ticket.type === 'General' ? 'bg-purple-100 text-purple-700' :
                          'bg-pink-100 text-pink-700'
                        }`}>
                        {ticket.type}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Sold</span>
                        <span className="font-semibold text-gray-800">{ticket.sold}</span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${ticket.type === 'VIP' ? 'bg-indigo-500' :
                            ticket.type === 'General' ? 'bg-purple-500' :
                              'bg-pink-500'
                            }`}
                          style={{ width: `${Math.min(100, (ticket.sold / (ticket.sold + ticket.available)) * 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Available</span>
                        <span className="font-semibold text-gray-800">{ticket.available}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Revenue</span>
                        <span className="font-semibold text-emerald-600">Rs. {ticket.revenue.toLocaleString()}</span>
                      </div>
                    </div>
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

// Updated StatCard component with trend indicator
const StatCard = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
            {trend}
          </span>
        )}
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1 font-inter">{title}</h4>
      <p className="text-2xl font-bold text-gray-800 font-inter">{value}</p>
    </div>
  );
};

// Updated DashboardSection component with icon
const DashboardSection = ({ title, icon, children, fullWidth }) => (
  <div className={fullWidth ? "col-span-1 lg:col-span-2" : ""}>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800 font-marcellus">{title}</h3>
    </div>
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">{children}</div>
  </div>
);

export default OrganizerDashboard;
