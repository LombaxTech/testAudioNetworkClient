import React, { useState, createContext } from "react";

export const RoomContext = createContext();
export const MyIdContext = createContext();

export const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState(null);
    const [myId, setMyId] = useState("");

    return (
        <RoomContext.Provider value={[room, setRoom]}>
            <MyIdContext.Provider value={[myId, setMyId]}>
                {children}
            </MyIdContext.Provider>
        </RoomContext.Provider>
    );
};
