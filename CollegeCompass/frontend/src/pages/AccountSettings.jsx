import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'
import './UserDashboard.css'; 
import { updateProfile } from 'firebase/auth';
import { updateEmail } from 'firebase/auth';
import { updatePassword } from 'firebase/auth';
import { FaEdit } from 'react-icons/fa';

const AccountSettings = () => {

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [message, setMessage] = useState('');

  useEffect(() => {

    const user = auth.currentUser;
    if (user) {
      setUserData({
        username: user.displayName || '',
        email: user.email || '',
        password: '',
      });
    }
  }, []);

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({
      ...prev, [
        field]: true
    }));
  };

  const handleChange = (e) => {

    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (field) => {
    const user = auth.currentUser;
    setMessage('');

    try {
      if (field === 'username') {
        await updateProfile(user, { displayName: userData.username });
      } else if (field === 'email') {
        await updateEmail(user, userData.email);
      } else if (field === 'password') {
        await updatePassword(user, userData.password);
        setUserData((prev) => ({ ...prev, password: '' }));
      }

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      setMessage('Changes saved!');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="account-settings-container">

      <h2>Account Settings</h2>

      {message && <p className="status-message">{message}</p>}

      <div className="settings-group">

        {/* Username */}
        <div className="setting-item">
          <label>Username</label>
          <div className="editable-field">
            <input
              type="text"
              name="username"
              value={userData.username}
              disabled={!isEditing.username}
              onChange={handleChange}
            />
            {!isEditing.username ? (
              <FaEdit aria-label="edit username" className="edit-icon" onClick={() => handleEditClick('username')} />
            ) : (
              <button className="save-button" onClick={() => handleSave('username')}>Save</button>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="setting-item">
          <label>Email</label>
          <div className="editable-field">
            <input
              type="email"
              name="email"
              value={userData.email}
              disabled={!isEditing.email}
              onChange={handleChange}
            />
            {!isEditing.email ? (
              <FaEdit aria-label="edit email" className="edit-icon" onClick={() => handleEditClick('email')} />
            ) : (
              <button className="save-button" onClick={() => handleSave('email')}>Save</button>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="setting-item">
          <label>Password</label>
          <div className="editable-field">
            <input
              type="password"
              name="password"
              value={userData.password}
              disabled={!isEditing.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            {!isEditing.password ? (
              <FaEdit aria-label="edit password" className="edit-icon" onClick={() => handleEditClick('password')} />
            ) : (
              <button className="save-button" onClick={() => handleSave('password')}>Save</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
