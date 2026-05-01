'use client'
import { useState, useEffect, useRef } from 'react'

type Props = {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export default function VoiceInput({ onTranscript, disabled = false }: Props) {
  const [listening,   setListening]   = useState(false)
  const [supported,   setSupported]   = useState(true)
  const [transcript,  setTranscript]  = useState('')
  const [pulse,       setPulse]       = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous       = true
    recognition.interimResults   = true
    recognition.lang             = 'en-US'

    recognition.onstart = () => {
      setListening(true)
      setPulse(true)
    }

    recognition.onend = () => {
      setListening(false)
      setPulse(false)
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final   = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      setTranscript(interim || final)

      if (final.trim()) {
        onTranscript(final.trim())
        setTranscript('')
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
      setPulse(false)
      setTranscript('')
    }

    recognitionRef.current = recognition
  }, [onTranscript])

  const toggle = () => {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
    } else {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  if (!supported) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Transcript preview */}
      {transcript && (
        <div style={{
          flex: 1,
          padding: '6px 12px',
          borderRadius: 10,
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          fontSize: 13,
          color: '#7c3aed',
          fontStyle: 'italic',
          maxWidth: 240,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.2s ease',
        }}>
          {transcript}...
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={toggle}
        disabled={disabled}
        title={listening ? 'Stop recording' : 'Start voice input'}
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: 12,
          border: listening
            ? '2px solid #ef4444'
            : '2px solid rgba(124,58,237,0.25)',
          background: listening
            ? 'rgba(239,68,68,0.08)'
            : 'rgba(124,58,237,0.06)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          opacity: disabled ? 0.4 : 1,
        }}
        onMouseEnter={e => {
          if (!listening) {
            e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={e => {
          if (!listening) {
            e.currentTarget.style.background = 'rgba(124,58,237,0.06)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        {/* Pulse ring when listening */}
        {pulse && (
          <>
            <span style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 18,
              border: '2px solid rgba(239,68,68,0.4)',
              animation: 'voice-pulse 1.2s ease-out infinite',
            }} />
            <span style={{
              position: 'absolute',
              inset: -12,
              borderRadius: 24,
              border: '2px solid rgba(239,68,68,0.2)',
              animation: 'voice-pulse 1.2s ease-out infinite 0.4s',
            }} />
          </>
        )}

        {/* Mic SVG */}
        {listening ? (
          // Stop icon when recording
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Mic icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8"  y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes voice-pulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
