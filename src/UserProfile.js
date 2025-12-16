import React, { useState } from 'react';
import { COMPOSITE_BASE_URL } from './config';

// --- Placeholder Data and Functions (Replace with your actual context) ---

// Assume this comes from your Redux store, Context, or API call
const mockUserProfile = {
    email: "jsmith@columbia.edu",
    uni: "jsmith",
    role: "student", // Current role
};

// Placeholder for your actual system's logout and redirect function
const logoutAndRedirect = () => {
    // 1. In a real app, this would clear the Firebase/Identity Platform token
    //    e.g., firebase.auth().signOut();
    // 2. Clear local storage/cookies
    console.log("LOGOUT TRIGGERED: Clearing session and forcing re-login...");
    localStorage.clear();
    window.location.reload(); // Simple way to force re-login in this mockup
    // 3. Redirect to the login page
    // window.location.href = '/login'; 
};

// --- Main Component ---

const UserProfile = () => {
    // State to hold the current profile data
    const [profile, setProfile] = useState({
    email: localStorage.getItem("userEmail") || "",
    uni: localStorage.getItem("userUni") || "",
    role: localStorage.getItem("userRole") || "student", // Current role
});
    
    // State to manage the selected role in the dropdown
    const [selectedRole, setSelectedRole] = useState(profile.role);
    
    // State for UI feedback
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Array of available roles for the dropdown
    const availableRoles = ["student", "faculty"];

    // Handler for when the dropdown selection changes
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    // Handler for the Save button
    const handleSave = async () => {
        // Prevent saving if the role hasn't actually changed
        if (selectedRole === profile.role) {
            setStatusMessage("Role is already set to " + selectedRole);
            return;
        }

        setIsSaving(true);
        setStatusMessage('Updating role...');
        
        try {
            // 1. 🚨 Call your backend API to update the role in your custom DB
            console.log(`API Call: Updating role for ${profile.email} to ${selectedRole}`);
            
            // --- Simulated API Delay ---
            const res = await fetch(`${COMPOSITE_BASE_URL}/auth/update-role`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: profile.email, role: selectedRole }),
                });
            if (!res.ok) {
                throw new Error(`API Error: ${res.statusText}`);    
            };
            // ---------------------------
            
            // 2. Update successful in DB. Now, trigger the required re-login.
            setStatusMessage(`Role updated to ${selectedRole}. Re-login required.`);
            
            // This is the core logic: force a logout immediately after updating the role
            // The system will then use the new role upon the next login.
            logoutAndRedirect(); 

        } catch (error) {
            setStatusMessage(`Error updating role: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>User Profile</h2>
            
            {/* Non-Editable Fields */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Email:</label>
                <input 
                    type="text" 
                    value={profile.email} 
                    readOnly 
                    style={styles.inputReadOnly}
                />
            </div>

            <div style={styles.fieldGroup}>
                <label style={styles.label}>UNI:</label>
                <input 
                    type="text" 
                    value={profile.uni} 
                    readOnly 
                    style={styles.inputReadOnly}
                />
            </div>

            {/* Editable Dropdown Field */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Role:</label>
                <select 
                    value={selectedRole} 
                    onChange={handleRoleChange} 
                    disabled={isSaving}
                    style={styles.select}
                >
                    {availableRoles.map(role => (
                        <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Action Button */}
            <button 
                onClick={handleSave} 
                disabled={isSaving || selectedRole === profile.role}
                style={styles.saveButton}
            >
                {isSaving ? 'Saving...' : 'Update Role & Re-login'}
            </button>

            {/* Status Message */}
            {statusMessage && <p style={styles.status}>{statusMessage}</p>}
            
            {/* Reminder for the user */}
            {selectedRole !== profile.role && (
                <p style={styles.warning}>
                    * Changing the role requires a full system reset. You will be logged out upon saving.
                </p>
            )}
        </div>
    );
};

// Basic Styling for readability
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    fieldGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    },
    inputReadOnly: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#eee',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        boxSizing: 'border-box',
    },
    saveButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    status: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        color: '#856404',
        borderRadius: '4px',
    },
    warning: {
        marginTop: '15px',
        fontSize: '0.9em',
        color: '#d9534f',
    }
};

export default UserProfile;