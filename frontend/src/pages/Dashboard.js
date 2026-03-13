import React from "react";
import "./Dashboard.css";
const user = JSON.parse(localStorage.getItem("user"));
<h1 className="title">Hi {user?.name} 👋</h1>

function Dashboard() {
  return (
    <div className="dashboard">

      <h1 className="title">Dashboard</h1>
      <p className="subtitle">
        Manage rooms, tenants, complaints and payments
      </p>

      <div className="cards">

        <div className="card">
          <div className="icon blue">🏠</div>
          <h2>Rooms</h2>
          <p>View and manage all PG rooms</p>
        </div>

        <div className="card">
          <div className="icon purple">👥</div>
          <h2>Tenants</h2>
          <p>Details of tenants staying in PG</p>
        </div>

        <div className="card">
          <div className="icon orange">📢</div>
          <h2>Complaints</h2>
          <p>Track and resolve tenant complaints</p>
        </div>

        <div className="card">
          <div className="icon green">💳</div>
          <h2>Payments</h2>
          <p>Monitor monthly rent payments</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;