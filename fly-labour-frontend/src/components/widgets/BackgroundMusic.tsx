import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Music, SkipForward } from "lucide-react";
import clsx from "clsx";
import s from "./BackgroundMusic.module.scss";

const PLAYLIST = [
  { src: "/music/background.mp3", name: "Fly Labour" },
  { src: "/music/Chuyến Bay Ước Mơ.mp3", name: "Chuyến Bay Ước Mơ" },
  { src: "/music/Du Lịch.mp3", name: "Du Lịch" },
  { src: "/music/Fly Visa ( pass 2 ).mp3", name: "Fly Visa" },
  { src: "/music/Viet Nam - Hello World.mp3", name: "Việt Nam - Hello World" },
];

function shuffledIndices(current: number, total: number): number[] {
  const others = Array.from({ length: total }, (_, i) => i).filter(
    (i) => i !== current,
  );
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [current, ...others];
}

interface Props {
  autoPlay?: boolean;
}

export default function BackgroundMusic({ autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [started, setStarted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(() =>
    Math.floor(Math.random() * PLAYLIST.length),
  );
  const queueRef = useRef<number[]>(shuffledIndices(trackIndex, PLAYLIST.length));
  const queuePosRef = useRef(0);
  const volumeRef = useRef<HTMLDivElement>(null);

  const currentTrack = PLAYLIST[trackIndex];

  const playNext = useCallback(() => {
    queuePosRef.current = (queuePosRef.current + 1) % PLAYLIST.length;
    if (queuePosRef.current === 0) {
      const next = Math.floor(Math.random() * PLAYLIST.length);
      queueRef.current = shuffledIndices(next, PLAYLIST.length);
    }
    setTrackIndex(queueRef.current[queuePosRef.current]);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.src;
    audio.load();
    if (playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [trackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!autoPlay) return;
    const handle = () => {
      if (!started) {
        setStarted(true);
        audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
        document.removeEventListener("click", handle);
        document.removeEventListener("keydown", handle);
        document.removeEventListener("scroll", handle);
      }
    };
    document.addEventListener("click", handle);
    document.addEventListener("keydown", handle);
    document.addEventListener("scroll", handle);
    return () => {
      document.removeEventListener("click", handle);
      document.removeEventListener("keydown", handle);
      document.removeEventListener("scroll", handle);
    };
  }, [autoPlay, started]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
    setStarted(true);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext();
    setStarted(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={playNext}
      />

      <div className={s.wrap}>
        {showVolume && (
          <div ref={volumeRef} className={s.volumePanel}>
            <p className={s.volumeTitle}>Âm lượng</p>
            <div className={s.volumeRow}>
              <VolumeX size={12} className={s.volumeIconSoft} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={s.range}
              />
              <Volume2 size={12} className={s.volumeIconStrong} />
            </div>
            <p className={s.volumePct}>{Math.round(volume * 100)}%</p>
          </div>
        )}

        {playing && (
          <div className={s.trackLabel}>
            <p className={s.trackName}>{currentTrack.name}</p>
          </div>
        )}

        <div className={s.controls}>
          <button
            type="button"
            onClick={togglePlay}
            className={s.playBtn}
            style={{
              background:
                "linear-gradient(135deg, #e4a808 0%, #fdd52f 60%, #f2ee8c 100%)",
            }}
            title={playing ? "Tắt nhạc" : "Bật nhạc"}
          >
            {playing ? (
              <div className={s.playBars}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={s.playBar}
                    style={{
                      height: `${Math.random() * 60 + 40}%`,
                      animation: `musicBar 0.${4 + i}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music size={14} className={s.iconAmber} />
            )}
            <span className={s.playLabel}>
              {playing ? "Đang phát" : "Nhạc nền"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className={s.skipBtn}
            style={{
              background: "linear-gradient(135deg, #fdd52f 0%, #e4a808 100%)",
            }}
            title="Bài kế tiếp"
          >
            <SkipForward size={13} className={s.iconAmber} />
          </button>

          <button
            type="button"
            onClick={() => setShowVolume((v) => !v)}
            className={clsx(
              s.volToggle,
              showVolume ? s.volToggleActive : s.volToggleInactive,
            )}
            style={{
              background: showVolume
                ? "linear-gradient(135deg, #e4a808, #fdd52f)"
                : "linear-gradient(135deg, #fdd52f 0%, #e4a808 100%)",
            }}
            title="Âm lượng"
          >
            {volume === 0 ? (
              <VolumeX size={13} className={s.iconAmber} />
            ) : (
              <Volume2 size={13} className={s.iconAmber} />
            )}
          </button>
        </div>

        {!started && autoPlay && (
          <p className={s.hint}>Click bất kỳ để phát nhạc</p>
        )}
      </div>

      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
