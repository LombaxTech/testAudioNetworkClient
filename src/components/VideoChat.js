import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
} from "react";
import io from "socket.io-client";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

import { RoomContext, MyIdContext } from "../RoomContext";

const BACKEND_API = process.env.REACT_APP_BASE_API || "http://localhost:8000";

export default function VideoChat() {
    const socket = useRef();
    const [myId, setMyId] = useContext(MyIdContext);

    useEffect(() => {
        socket.current = io.connect("/");
        socket.current.on("setId", (id) => setMyId(id));
    }, []);

    const [room, setRoom] = useContext(RoomContext);

    const setName = (name) => socket.current.emit("setName", name);
    const setImage = (url) => socket.current.emit("setImage", url);

    if (room) {
        return <Room />;
    } else {
        return <Lobby setName={setName} setImage={setImage} />;
    }
}
