import React, { useEffect, useState } from "react";

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    eventStats: [],
  });

  console.log(stats);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/organizer/stats", {
            method: "GET"
        });
        const data = await res.json();
        console.log(data);
        
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Events</h2>
          <p className="text-2xl">{stats.totalEvents}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Registrations</h2>
          <p className="text-2xl">{stats.totalRegistrations}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl">Rs. {stats.totalRevenue}</p>
        </div>
      </div>

      {/* Event-wise stats table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">Event</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Ticket Type</th>
              <th className="text-left px-4 py-2">Sold / Available</th>
              <th className="text-left px-4 py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {stats.eventStats.length > 0 ? (
              stats.eventStats.map((event) =>
                event.ticketStats.map((ticket, index) => (
                  <tr key={`${event._id}-${index}`} className="border-t">
                    <td className="px-4 py-2">{event.title}</td>
                    <td className="px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{ticket.type}</td>
                    <td className="px-4 py-2">
                      {ticket.sold} / {ticket.available}
                    </td>
                    <td className="px-4 py-2">Rs. {ticket.revenue}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td className="px-4 py-4" colSpan="5">
                  No event data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
