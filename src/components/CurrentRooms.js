import React, { useState, useEffect, useContext } from "react";
import { RoomContext, MyIdContext } from "../RoomContext";
import Video from "twilio-video";

export default function CurrentRooms() {
    const [rooms, setRooms] = useState([]);
    const [myId, setMyId] = useContext(MyIdContext);
    const [room, setRoom] = useContext(RoomContext);

    async function getRooms() {
        try {
            let rooms = await fetch(`http://localhost:8000/rooms`);
            rooms = await rooms.json();
            rooms = rooms.map((room) => ({
                accountSid: room.accountSid,
                links: room.links,
                sid: room.sid,
                status: room.status,
                uniqueName: room.uniqueName,
                url: room.url,
            }));
            console.log(rooms);
            setRooms(rooms);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRooms();
    }, []);

    const joinRoom = async (roomName) => {
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
        <div>
            <h1>Current Rooms</h1>
            {rooms.map((room, i) => (
                <div className="room" key={i}>
                    <button onClick={() => joinRoom(room.uniqueName)}>
                        Join {room.uniqueName}
                    </button>
                </div>
            ))}
        </div>
    );
}
