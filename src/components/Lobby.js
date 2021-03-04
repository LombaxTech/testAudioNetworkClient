import React, { useState, useEffect, useContext } from "react";
import CurrentRooms from "./CurrentRooms";
import { RoomContext, MyIdContext } from "../RoomContext";
import Video from "twilio-video";

const SetName = ({ setName, setImage }) => {
    const [imageUrl, setImageUrl] = useState("");
    const [username, setUsername] = useState("");

    return (
        <div className="set-name">
            <h2>Your username is: {username}</h2>
            <label>Name</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

const CreateRoom = () => {
    const [room, setRoom] = useContext(RoomContext);
    const [myId, setMyId] = useContext(MyIdContext);

    const [roomName, setRoomName] = useState("");

    const createRoom = async (roomName) => {
        try {
            let data = await fetch(
                // `https://audio-test-network.herokuapp.com/room`,
                `http://localhost:8000/room`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identity: myId,
                        roomName,
                    }),
                }
            );
            data = await data.json();
            if (data === 53113) {
                return console.log("Room already exists. Change Room name");
            }
            let { token } = data;
            let room = await Video.connect(token, {
                name: roomName,
                audio: true,
            });
            setRoom(room);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="create-room">
            <h2>Create Room</h2>
            <label>Enter Room Name: </label>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />

            <button onClick={() => createRoom(roomName)}>Join Room</button>
        </div>
    );
};

const JoinRoom = () => {
    const [myId, setMyId] = useContext(MyIdContext);
    const [room, setRoom] = useContext(RoomContext);
    const [roomName, setRoomName] = useState("");

    const joinRoom = async () => {
        // return console.log({ username, roomName });
        try {
            let data = await fetch(
                // `https://audio-test-network.herokuapp.com/video/token`,
                `http://localhost:8000/video/token`,

                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identity: myId,
                        roomName,
                    }),
                }
            );
            data = await data.json();
            console.log(data);
            if (data === 20404) {
                return console.log("Room does not exist.");
            }
            let { token } = data;
            let room = await Video.connect(token, {
                name: roomName,
                audio: true,
            });
            setRoom(room);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="join-room">
            <h2>Join Room</h2>
            <label>Enter Room Name: </label>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
};

export default function Lobby({ setName, setImage }) {
    const [myId, setMyId] = useContext(MyIdContext);

    return (
        <div className="lobby">
            <SetName setName={setName} setImage={setImage} />
            <JoinRoom />
            <CreateRoom />
            <CurrentRooms />

            <button onClick={() => console.log(`My id is ${myId}`)}>
                View Id
            </button>
        </div>
    );
}
