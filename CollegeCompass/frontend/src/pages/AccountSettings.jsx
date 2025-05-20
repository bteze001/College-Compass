import React from 'react';
import './UserDashboard.css'; // Assumes you’ll add styles to the existing CSS file

const AccountSettings = () => {
  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>

      <div className="settings-group">
        <div className="setting-item">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" disabled />
        </div>

        <div className="setting-item">
          <label>Birthday</label>
          <input type="date" disabled />
        </div>

        <div className="setting-item">
          <label>Email</label>
          <input type="email" placeholder="visitor@ucr.edu" disabled />
        </div>

        <div className="setting-item">
          <label>Privacy Settings</label>
          <button className="setting-button">Manage Privacy</button>
        </div>

        <div className="setting-item">
          <label>Password</label>
          <button className="setting-button">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
