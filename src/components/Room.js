import React, { useState, useEffect } from "react";
import Participant from "./Participant";

export default function Room({ room, handleLogout }) {
    console.log(room);

    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const participantConnected = (participant) => {
            // console.log(`${participant.identity} has joined`);
            setParticipants((prevParticipants) => [
                ...prevParticipants,
                participant,
            ]);
        };

        const participantDisconnected = (participant) => {
            console.log(`${participant.identity} has left`);
            setParticipants((prevParticipants) =>
                prevParticipants.filter((p) => p !== participant)
            );
        };

        // room.on("roomCreated", () => console.log("ROOM HAS BEEN CREATED"));
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);

        room.participants.forEach(participantConnected);
        return () => {
            room.off("participantConnected", participantConnected);
            room.off("participantDisconnected", participantDisconnected);
        };
    }, [room]);

    const remoteParticipants = participants.map((participant) => (
        <Participant
            key={participant.sid}
            participant={participant}
            me={false}
        />
    ));

    const mute = () => {
        room.localParticipant.videoTracks.forEach((publication) => {
            publication.track.disable();
        });
    };

    return (
        <div>
            <h2>Room: {room.name}</h2>
            <button onClick={handleLogout}>Leave Room</button>
            {/* <button onClick={() => console.log(room.participants.size)}>
                size
            </button> */}

            <div className="local-participant">
                <Participant
                    key={room.localParticipant.sid}
                    participant={room.localParticipant}
                    me={true}
                />
                <button onClick={mute}>Mute</button>
            </div>
            <div className="remote-participants">
                <h3>Other users</h3>
                {remoteParticipants}
            </div>
        </div>
    );
}
