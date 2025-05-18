
"use client"

import { cn } from "@/lib/utils"
import React, { useCallback, useEffect, useRef, useState } from "react"

export type Mode = "typewriter" | "fade"

export interface UseTextStreamOptions {
  textStream: string | AsyncIterable<string>
  speed?: number // 1-100, where 1 is slowest and 100 is fastest
  mode?: Mode
  onComplete?: () => void
  fadeDuration?: number // Custom fade duration in ms for fade mode (overrides speed-based calculation)
  segmentDelay?: number // Custom delay between segments in ms for fade mode (overrides speed-based calculation)
  characterChunkSize?: number // Custom characters per frame for typewriter mode (overrides speed-based calculation)
  onError?: (error: unknown) => void
}

export interface UseTextStreamResult {
  displayedText: string
  isComplete: boolean
  segments: { text: string; index: number }[] // For fade mode
  getCalculatedFadeDuration: () => number
  getCalculatedSegmentDelay: () => number
  reset: () => void
  startStreaming: () => void
  pause: () => void
  resume: () => void
}

function useTextStream({
  textStream,
  speed = 20,
  mode = "typewriter",
  onComplete,
  fadeDuration: customFadeDuration,
  segmentDelay: customSegmentDelay,
  characterChunkSize: customCharacterChunkSize,
  onError,
}: UseTextStreamOptions): UseTextStreamResult {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [segments, setSegments] = useState<{ text: string; index: number }[]>([])

  // Refs for props and internal state to allow updates without restarting effects or ensure stability
  const speedRef = useRef(speed)
  const modeRef = useRef(mode)
  const customFadeDurationRef = useRef(customFadeDuration)
  const customSegmentDelayRef = useRef(customSegmentDelay)
  const customCharacterChunkSizeRef = useRef(customCharacterChunkSize)
  const onCompleteRef = useRef(onComplete)
  const onErrorRef = useRef(onError)

  const currentIndexRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const streamControllerRef = useRef<AbortController | null>(null)
  const completedRef = useRef(false) // To ensure onComplete is called only once

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    customFadeDurationRef.current = customFadeDuration
  }, [customFadeDuration])

  useEffect(() => {
    customSegmentDelayRef.current = customSegmentDelay
  }, [customSegmentDelay])

  useEffect(() => {
    customCharacterChunkSizeRef.current = customCharacterChunkSize
  }, [customCharacterChunkSize])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const getCharacterChunkSize = useCallback((): number => {
    if (typeof customCharacterChunkSizeRef.current === "number") {
      return Math.max(1, customCharacterChunkSizeRef.current)
    }
    const normalizedSpeed = Math.min(100, Math.max(1, speedRef.current))
    if (normalizedSpeed < 25) return 1
    return Math.max(1, Math.round((normalizedSpeed - 25) / 10))
  }, [])

  const getTypewriterDelay = useCallback((): number => {
    if (typeof customSegmentDelayRef.current === "number" && modeRef.current === 'typewriter') {
      return Math.max(0, customSegmentDelayRef.current);
    }
    const normalizedSpeed = Math.min(100, Math.max(1, speedRef.current))
    return Math.max(1, Math.round(100 / Math.sqrt(normalizedSpeed)))
  }, [])

  const getCalculatedFadeDuration = useCallback((): number => {
    if (typeof customFadeDurationRef.current === "number") {
      return Math.max(10, customFadeDurationRef.current)
    }
    const normalizedSpeed = Math.min(100, Math.max(1, speedRef.current))
    return Math.round(1000 / Math.sqrt(normalizedSpeed))
  }, [])

  const getCalculatedSegmentDelay = useCallback((): number => {
     if (typeof customSegmentDelayRef.current === "number" && modeRef.current === 'fade') {
        return Math.max(0, customSegmentDelayRef.current);
    }
    const normalizedSpeed = Math.min(100, Math.max(1, speedRef.current))
    return Math.max(1, Math.round(100 / Math.sqrt(normalizedSpeed)))
  }, [])

  const updateSegmentsForFadeMode = useCallback((text: string) => {
    if (modeRef.current === "fade") {
      try {
        const segmenter = new Intl.Segmenter(navigator.language, { granularity: "word" })
        const segmentIterator = segmenter.segment(text)
        const newSegments = Array.from(segmentIterator).map((segment, index) => ({
          text: segment.segment,
          index,
        }))
        setSegments(newSegments)
      } catch (error) {
        const whitespaceRegex = new RegExp("(\\s+)") // Capture whitespace
        const newSegments = text
          .split(whitespaceRegex)
          .filter(Boolean)
          .map((word, index) => ({
            text: word,
            index,
          }))
        setSegments(newSegments)
        if (onErrorRef.current) onErrorRef.current(error)
      }
    }
  }, [])

  const markAsComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true
      setIsComplete(true)
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (streamControllerRef.current) {
      streamControllerRef.current.abort()
      streamControllerRef.current = null
    }
    currentIndexRef.current = 0
    setDisplayedText("")
    setSegments([])
    setIsComplete(false)
    completedRef.current = false
  }, [])

  const processStringStreamForTypewriter = useCallback(
    (fullText: string) => {
      let lastFrameTime = 0
      const animate = (timestamp: number) => {
        const delay = getTypewriterDelay()
        if (delay > 0 && timestamp - lastFrameTime < delay) {
          animationFrameRef.current = requestAnimationFrame(animate)
          return
        }
        lastFrameTime = timestamp

        if (currentIndexRef.current >= fullText.length) {
          markAsComplete()
          return
        }

        const chunkSize = getCharacterChunkSize()
        const nextEndIndex = Math.min(currentIndexRef.current + chunkSize, fullText.length)
        const newTextToShow = fullText.slice(0, nextEndIndex)

        setDisplayedText(newTextToShow)
        if (modeRef.current === "fade") { // Should ideally not happen if mode is typewriter
            updateSegmentsForFadeMode(newTextToShow);
        }

        currentIndexRef.current = nextEndIndex

        if (nextEndIndex < fullText.length) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          markAsComplete()
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [getTypewriterDelay, getCharacterChunkSize, markAsComplete, updateSegmentsForFadeMode]
  )

  const processAsyncIterableStream = useCallback(
    async (stream: AsyncIterable<string>) => {
      const controller = new AbortController()
      streamControllerRef.current = controller
      let currentAggregatedText = ""

      try {
        for await (const chunk of stream) {
          if (controller.signal.aborted) return
          currentAggregatedText += chunk
          setDisplayedText(currentAggregatedText)
          if (modeRef.current === "fade") {
            updateSegmentsForFadeMode(currentAggregatedText)
          }
        }
        markAsComplete()
      } catch (error) {
        if (!controller.signal.aborted && error instanceof Error && error.name !== 'AbortError') {
          console.error("Error processing async text stream:", error)
          if (onErrorRef.current) onErrorRef.current(error)
        }
        markAsComplete() // Ensure completion even on error
      }
    },
    [updateSegmentsForFadeMode, markAsComplete]
  )

  const startStreaming = useCallback(() => {
    reset()
    if (typeof textStream === "string") {
      if (modeRef.current === "fade") {
        updateSegmentsForFadeMode(textStream);
        setDisplayedText(textStream); // For fade, show full text then animate segments
        // Fade mode completion for string stream is handled by the last segment animation callback
      } else { // typewriter
        processStringStreamForTypewriter(textStream);
      }
    } else if (textStream && typeof textStream[Symbol.asyncIterator] === 'function') {
      processAsyncIterableStream(textStream);
    } else {
       if (onErrorRef.current) onErrorRef.current(new Error("Invalid textStream prop: not a string or AsyncIterable."));
       markAsComplete();
    }
  }, [textStream, reset, processStringStreamForTypewriter, processAsyncIterableStream, updateSegmentsForFadeMode, markAsComplete])


  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    // For async iterables, abort the stream if it's active
    if (streamControllerRef.current && !streamControllerRef.current.signal.aborted) {
      streamControllerRef.current.abort()
      // Note: Aborting an async iterable typically leads to its completion/error handling.
      // Depending on the iterable's implementation, it might not be truly "pausable" in a way
      // that it can be resumed from the exact same spot. This implementation will stop it.
    }
  }, [])

  const resume = useCallback(() => {
    // Resume for typewriter string mode
    if (
      modeRef.current === 'typewriter' &&
      typeof textStream === 'string' &&
      !isComplete && // Only resume if not already complete
      animationFrameRef.current === null // Only resume if actually paused
    ) {
      // The typewriter animation needs to continue from where it left off (currentIndexRef)
      processStringStreamForTypewriter(textStream)
    }
    // Resume for async iterables is more complex and depends on the source.
    // A simple "resume" like this might restart the stream if startStreaming is called again.
    // For now, this resume focuses on the string-based typewriter.
  }, [textStream, isComplete, processStringStreamForTypewriter])


  // Effect to start streaming when textStream changes
  useEffect(() => {
    startStreaming()
    // Cleanup function to abort any ongoing stream when the component unmounts or textStream changes
    return () => {
      reset() // This will cancel animations and abort async streams
    }
  }, [textStream, startStreaming, reset]) // `reset` is included if its definition might change, though it's stable here.

  return {
    displayedText,
    isComplete,
    segments,
    getCalculatedFadeDuration,
    getCalculatedSegmentDelay,
    reset,
    startStreaming,
    pause,
    resume,
  }
}

export interface ResponseStreamProps {
  textStream: string | AsyncIterable<string>;
  mode?: Mode;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  as?: React.ElementType; // Changed from keyof React.JSX.IntrinsicElements
  fadeDuration?: number;
  segmentDelay?: number;
  characterChunkSize?: number;
  onError?: (error: unknown) => void;
}

function ResponseStream({
  textStream,
  mode = "typewriter",
  speed = 20,
  className, // className prop can be undefined
  onComplete,
  as: WrapperComponent = "div", // Default to "div"
  fadeDuration,
  segmentDelay,
  characterChunkSize,
  onError,
}: ResponseStreamProps) {
  const onCompleteRef = useRef(onComplete) // Use ref for stable callback
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const {
    displayedText,
    isComplete: hookIsComplete, // Renamed to avoid conflict with any component-level isComplete
    segments,
    getCalculatedFadeDuration,
    getCalculatedSegmentDelay,
    // reset, startStreaming, pause, resume // These are available if needed, but not directly used by ResponseStream rendering
  } = useTextStream({
    textStream,
    speed,
    mode,
    onComplete: () => {
      // For typewriter mode, or async iterable mode, call onCompleteRef when the hook says it's complete.
      // For fade mode with a string, completion is triggered by the last segment's animation end.
      if (mode !== 'fade' || typeof textStream !== 'string') {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    },
    fadeDuration,
    segmentDelay,
    characterChunkSize,
    onError,
  })

  const fadeAnimationCompletedRef = useRef(false);

  // Reset fade animation completion state when textStream or mode changes
  useEffect(() => {
    fadeAnimationCompletedRef.current = false;
  }, [textStream, mode]);


  const handleLastSegmentAnimationEnd = useCallback(() => {
    // This callback is specifically for fade mode with a string input
    if (mode === 'fade' && typeof textStream === 'string' && !fadeAnimationCompletedRef.current) {
      // Ensure onComplete is called only once for this specific scenario
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      fadeAnimationCompletedRef.current = true; // Mark as completed to prevent multiple calls
    }
  }, [mode, textStream]); // Dependencies include mode and textStream


  if (mode === "typewriter") {
    return <WrapperComponent className={className || undefined}>{displayedText}</WrapperComponent>
  }

  if (mode === "fade") {
    const whitespaceRegex = new RegExp(/^\\s+$/); // Use RegExp constructor
    return (
      <WrapperComponent className={className || undefined}>
        {segments.map((segment, idx) => {
          const isWhitespace = whitespaceRegex.test(segment.text)
          // Determine if this is the last segment for the onAnimationEnd callback
          // This condition is true if the hook reports completion AND this is the last segment in the array
          const isLastSegmentForAnimationCallback = idx === segments.length - 1 && hookIsComplete;

          return (
            <span
              key={`${segment.index}-${segment.text.slice(0,5)}`} // More robust key
              className={cn("fade-segment", isWhitespace && "fade-segment-space")}
              style={{
                // CSS variables for fade duration and delay are set in globals.css
                // This component now relies on those global styles.
                // However, if specific dynamic values per instance are needed,
                // they can be passed via style prop like this:
                animationDuration: `${getCalculatedFadeDuration()}ms`,
                animationDelay: `${idx * getCalculatedSegmentDelay()}ms`,
              }}
              // Attach animation end handler only to the last segment when in fade mode with a string
              onAnimationEnd={mode === 'fade' && typeof textStream === 'string' && isLastSegmentForAnimationCallback ? handleLastSegmentAnimationEnd : undefined}
            >
              {segment.text}
            </span>
          )
        })}
      </WrapperComponent>
    )
  }

  // Default fallback (e.g., if mode is undefined or an unknown value)
  return <WrapperComponent className={className || undefined}>{displayedText}</WrapperComponent>;
}

export { useTextStream, ResponseStream }

    