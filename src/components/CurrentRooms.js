import React, { useState, useEffect } from "react";

export default function CurrentRooms({ joinRoom, username }) {
    const [rooms, setRooms] = useState([]);

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

    return (
        <div>
            <h1>Current Rooms</h1>
            {rooms.map((room) => (
                <div className="room">
                    <button onClick={() => joinRoom(room.uniqueName, username)}>
                        Join {room.uniqueName}
                    </button>
                </div>
            ))}
        </div>
    );
}
