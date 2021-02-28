import React, { useState, useEffect } from "react";
import CurrentRooms from "./CurrentRooms";
import JoinRoom from "./JoinRoom";

const SetName = ({ username, handleUsernameChange }) => (
    <div className="set-name">
        <h2>Your username is {username}</h2>
        <label>Name: </label>
        <input type="text" value={username} onChange={handleUsernameChange} />
    </div>
);

const CreateRoom = ({ createRoom, username }) => {
    const [roomName, setRoomName] = useState("");
    const handleRoomNameChange = (e) => setRoomName(e.target.value);

    return (
        <div className="create-room">
            <h2>Create Room</h2>
            <label>Enter Room Name: </label>
            <input
                type="text"
                value={roomName}
                onChange={handleRoomNameChange}
            />

            <button onClick={() => createRoom(roomName, username)}>
                Join Room
            </button>
        </div>
    );
};

export default function Lobby({
    username,
    handleUsernameChange,
    joinRoom,
    createRoom,
}) {
    return (
        <div className="lobby">
            <SetName
                username={username}
                handleUsernameChange={handleUsernameChange}
            />
            <JoinRoom joinRoom={joinRoom} username={username} />
            <CreateRoom createRoom={createRoom} username={username} />

            <CurrentRooms joinRoom={joinRoom} username={username} />
        </div>
    );
}
