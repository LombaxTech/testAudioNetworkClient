import React, { useState, useEffect } from "react";

export default function JoinRoom({ joinRoom, username }) {
    const [roomName, setRoomName] = useState("");

    const handleRoomNameChange = (e) => setRoomName(e.target.value);

    return (
        <div className="join-room">
            <h2>Join Room</h2>
            <label>Enter Room Name: </label>
            <input
                type="text"
                value={roomName}
                onChange={handleRoomNameChange}
            />

            <button onClick={() => joinRoom(roomName, username)}>
                Join Room
            </button>
        </div>
    );
}
