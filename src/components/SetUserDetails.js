import React, { useState, useEffect } from "react";

export default function SetUserDetails({ username, handleUsernameChange }) {
    return (
        <div>
            <label>Name: </label>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
            />
        </div>
    );
}
