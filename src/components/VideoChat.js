import React, { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

const BACKEND_API = process.env.REACT_APP_BASE_API || "http://localhost:8000";

export default function VideoChat() {
    const socket = useRef();

    const [myId, setMyId] = useState("");

    useEffect(() => {
        socket.current = io.connect("/");
        socket.current.on("setId", (id) => setMyId(id));
    }, []);

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState(null);

    const handleUsernameChange = (e) => setUsername(e.target.value);

    const joinRoom = async (roomName, username) => {
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
            // return console.log(data);
            let { token } = data;
            let room = await Video.connect(token, {
                name: roomName,
                audio: true,
            });
            console.log(room);
            setRoom(room);
        } catch (error) {
            console.log(error);
        }
    };

    const createRoom = async (roomName, username) => {
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
            // return console.log(data);
            let { token } = data;
            // return console.log(token);
            let room = await Video.connect(token, {
                name: roomName,
                audio: true,
            });
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

    const setName = (name) => socket.current.emit("setName", name);

    const setImage = (url) => socket.current.emit("setImage", url);

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
            <Room
                room={room}
                handleLogout={handleLogout}
                socket={socket}
                myId={myId}
            />
        );
    } else {
        return (
            <Lobby
                username={username}
                handleUsernameChange={handleUsernameChange}
                joinRoom={joinRoom}
                createRoom={createRoom}
                myId={myId}
                setName={setName}
                setImage={setImage}
            />
        );
    }
}
