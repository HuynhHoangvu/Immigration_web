import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react'

const PLAYLIST = [
  { src: '/music/background.mp3',              name: 'Fly Labour' },
  { src: '/music/Chuyến Bay Ước Mơ.mp3',       name: 'Chuyến Bay Ước Mơ' },
  { src: '/music/Du Lịch.mp3',                 name: 'Du Lịch' },
  { src: '/music/Fly Visa ( pass 2 ).mp3',     name: 'Fly Visa' },
  { src: '/music/Viet Nam - Hello World.mp3',  name: 'Việt Nam - Hello World' },
]

function shuffledIndices(current: number, total: number): number[] {
  const others = Array.from({ length: total }, (_, i) => i).filter(i => i !== current)
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]]
  }
  return [current, ...others]
}

interface Props {
  autoPlay?: boolean
}

export default function BackgroundMusic({ autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showVolume, setShowVolume] = useState(false)
  const [started, setStarted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * PLAYLIST.length))
  const queueRef = useRef<number[]>(shuffledIndices(trackIndex, PLAYLIST.length))
  const queuePosRef = useRef(0)
  const volumeRef = useRef<HTMLDivElement>(null)

  const currentTrack = PLAYLIST[trackIndex]

  const playNext = useCallback(() => {
    queuePosRef.current = (queuePosRef.current + 1) % PLAYLIST.length
    if (queuePosRef.current === 0) {
      // reshuffle khi hết playlist
      const next = Math.floor(Math.random() * PLAYLIST.length)
      queueRef.current = shuffledIndices(next, PLAYLIST.length)
    }
    setTrackIndex(queueRef.current[queuePosRef.current])
  }, [])

  // Khi đổi bài, tự phát nếu đang chạy
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = currentTrack.src
    audio.load()
    if (playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [trackIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Autoplay sau user interaction lần đầu
  useEffect(() => {
    if (!autoPlay) return
    const handle = () => {
      if (!started) {
        setStarted(true)
        audioRef.current?.play().then(() => setPlaying(true)).catch(() => {})
        document.removeEventListener('click', handle)
        document.removeEventListener('keydown', handle)
        document.removeEventListener('scroll', handle)
      }
    }
    document.addEventListener('click', handle)
    document.addEventListener('keydown', handle)
    document.addEventListener('scroll', handle)
    return () => {
      document.removeEventListener('click', handle)
      document.removeEventListener('keydown', handle)
      document.removeEventListener('scroll', handle)
    }
  }, [autoPlay, started])

  // Đóng volume slider khi click ra ngoài
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
    setStarted(true)
  }

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    playNext()
    setStarted(true)
  }

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

      {/* Widget nổi góc dưới trái */}
      <div className="fixed bottom-8 left-5 z-40 flex flex-col items-start gap-2">

        {/* Volume slider */}
        {showVolume && (
          <div ref={volumeRef}
            className="bg-brand-card border border-brand-border rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 animate-fade-up">
            <p className="text-xs text-brand-muted mb-2 text-center">Âm lượng</p>
            <div className="flex items-center gap-2">
              <VolumeX size={12} className="text-brand-muted" />
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-brand-gold cursor-pointer"
              />
              <Volume2 size={12} className="text-brand-gold" />
            </div>
            <p className="text-center text-xs text-brand-muted mt-1">{Math.round(volume * 100)}%</p>
          </div>
        )}

        {/* Tên bài khi đang phát */}
        {playing && (
          <div className="bg-brand-card border border-brand-border rounded-xl px-3 py-1.5 shadow-lg max-w-[180px]">
            <p className="text-[10px] text-brand-muted truncate">{currentTrack.name}</p>
          </div>
        )}

        {/* Main controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 bg-brand-card border border-brand-border hover:border-brand-gold/50 rounded-2xl px-3 py-2 transition-all duration-200 group shadow-lg"
            title={playing ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {playing ? (
              <div className="flex items-end gap-0.5 h-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}
                    className="w-0.5 bg-brand-gold rounded-full"
                    style={{
                      height: `${Math.random() * 60 + 40}%`,
                      animation: `musicBar 0.${4 + i}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music size={14} className="text-brand-muted group-hover:text-brand-gold transition-colors" />
            )}
            <span className="text-xs text-brand-muted group-hover:text-white transition-colors">
              {playing ? 'Đang phát' : 'Nhạc nền'}
            </span>
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/50 flex items-center justify-center text-brand-muted hover:text-brand-gold transition-colors shadow-lg"
            title="Bài kế tiếp"
          >
            <SkipForward size={13} />
          </button>

          {/* Volume */}
          <button
            onClick={() => setShowVolume(s => !s)}
            className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/50 flex items-center justify-center text-brand-muted hover:text-brand-gold transition-colors shadow-lg"
            title="Âm lượng"
          >
            {volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>

        {/* Hint lần đầu */}
        {!started && autoPlay && (
          <p className="text-[10px] text-brand-muted ml-1 animate-pulse">
            Click bất kỳ để phát nhạc
          </p>
        )}
      </div>

      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}
