import React, { useState, useEffect } from "react";
import CurrentRooms from "./CurrentRooms";

const SetName = ({ username, handleUsernameChange, setName, setImage }) => {
    const [imageUrl, setImageUrl] = useState("");

    return (
        <div className="set-name">
            <h2>Your username is {username}</h2>
            <label>Name: </label>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
            />
            <button onClick={() => setName(username)}>Set Name</button>

            <label>Set Image Url</label>
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <button onClick={() => setImage(imageUrl)}>Set Image</button>
        </div>
    );
};

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

const JoinRoom = ({ joinRoom, username }) => {
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
};

export default function Lobby({
    username,
    handleUsernameChange,
    joinRoom,
    createRoom,
    myId,
    setName,
    setImage,
}) {
    return (
        <div className="lobby">
            <SetName
                username={username}
                handleUsernameChange={handleUsernameChange}
                setName={setName}
                setImage={setImage}
            />
            <JoinRoom joinRoom={joinRoom} username={username} />
            <CreateRoom createRoom={createRoom} username={username} />

            <CurrentRooms joinRoom={joinRoom} username={username} />
            <button onClick={() => console.log(`My id is ${myId}`)}>
                View Id
            </button>
        </div>
    );
}
