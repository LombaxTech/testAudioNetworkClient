import React from "react";

export default function Lobby({
    username,
    handleUsernameChange,
    roomName,
    handleRoomNameChange,
    handleSubmit,
    connecting,
}) {
    return (
        <form onSubmit={handleSubmit}>
            <label>Name: </label>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
            />

            <label>Room Name: </label>
            <input
                type="text"
                value={roomName}
                onChange={handleRoomNameChange}
            />

            <button type="submit">Join Room</button>
        </form>
    );
}
