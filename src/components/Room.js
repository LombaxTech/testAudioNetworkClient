import React, { useState, useEffect, useContext, useCallback } from "react";
import Participant from "./Participant";
import { RoomContext, MyIdContext } from "../RoomContext";

export default function Room() {
    console.log(room);

    const [room, setRoom] = useContext(RoomContext);
    const [myId, setMyId] = useContext(MyIdContext);

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

    return (
        <div>
            <h2>Room: {room.name}</h2>
            <button onClick={handleLogout}>Leave Room</button>
            <button onClick={() => console.log(room.localParticipant)}>
                Local Participant
            </button>

            <div className="local-participant">
                <Participant
                    key={room.localParticipant.sid}
                    participant={room.localParticipant}
                    me={true}
                    myId={myId}
                />
                <button onClick={mute}>Mute</button>
            </div>

            <div className="remote-participants">
                <h3>Other users</h3>
                {remoteParticipants}
            </div>

            <button onClick={() => console.log(participants)}>
                View participants
            </button>
        </div>
    );
}
