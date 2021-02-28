import React, { useState, useEffect, useRef } from "react";

export default function Participant({ participant, me, profilePictureId }) {
    const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = (trackMap) =>
        Array.from(trackMap.values())
            .map((publication) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {
        const trackSubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => [...videoTracks, track]);
            } else {
                setAudioTracks((audioTracks) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) =>
                    videoTracks.filter((v) => v !== track)
                );
            } else {
                setAudioTracks((audioTracks) =>
                    audioTracks.filter((a) => a !== track)
                );
            }
        };

        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackSubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    return (
        <div
            className="participant"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {/* <video ref={videoRef} autoPlay={true} /> */}
            <img
                src={
                    profilePictureId ||
                    "https://t4.ftcdn.net/jpg/01/18/03/35/360_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg"
                }
                style={{
                    background: "green",
                    maxWidth: "150px",
                    maxHeight: "150px",
                }}
            />
            <h2>{participant.identity}</h2>
            <audio ref={audioRef} autoPlay={true} muted={me} />
        </div>
    );
}
