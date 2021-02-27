import React, { useState, useEffect, useCallback } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

export default function VideoChat() {
    const [username, setUsername] = useState("");
    const [roomName, setRoomName] = useState("");
    const [room, setRoom] = useState(null);
    const [connecting, setConnecting] = useState(false);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleRoomNameChange = (e) => setRoomName(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log({ username, roomName });

        try {
            let data = await fetch(`http://localhost:8000/video/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identity: username,
                    room: roomName,
                }),
            });
            data = await data.json();
            let { token } = data;

            let room = await Video.connect(token, { name: roomName });
            console.log(room);
            setRoom(room);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = useCallback(() => {
        setRoom((prevRoom) => {
            if (prevRoom) {
                prevRoom.localParticipant.tracks.forEach((trackPub) => {
                    trackPub.track.stop();
                });
                prevRoom.disconnect();
            }
            return null;
        });
    }, []);

    useEffect(() => {
        if (room) {
            const tidyUp = (event) => {
                if (event.persisted) {
                    return;
                }
                if (room) {
                    handleLogout();
                }
            };
            window.addEventListener("pagehide", tidyUp);
            window.addEventListener("beforeunload", tidyUp);
            return () => {
                window.removeEventListener("pagehide", tidyUp);
                window.removeEventListener("beforeunload", tidyUp);
            };
        }
    }, [room, handleLogout]);

    if (room) {
        return (
            <Room roomName={roomName} room={room} handleLogout={handleLogout} />
        );
    } else {
        return (
            <Lobby
                username={username}
                handleUsernameChange={handleUsernameChange}
                roomName={roomName}
                handleRoomNameChange={handleRoomNameChange}
                handleSubmit={handleSubmit}
            />
        );
    }
}
