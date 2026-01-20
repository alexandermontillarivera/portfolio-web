import styles from '@/css/slider/Slider.module.css'
import { SLIDE_TIMEOUT, SLIDE_TRANSITION_DURATION } from '@/constants'
import { useState, useEffect, useCallback } from 'react'
import { ISliderItem } from '@/interfaces/Slider'
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlayerPause,
  IconPlayerPlay
} from '@tabler/icons-react'

interface Props {
  data: ISliderItem[]
}

export function Slider({ data }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const changeSlide = useCallback((newIndex: number) => {
    if (isAnimating) return

    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex(newIndex)
    }, SLIDE_TRANSITION_DURATION)

    setTimeout(() => {
      setIsAnimating(false)
    }, SLIDE_TRANSITION_DURATION)
  }, [isAnimating])

  const nextPerson = useCallback(() => {
    const newIndex = (currentIndex + 1) % data.length
    changeSlide(newIndex)
  }, [currentIndex, data.length, changeSlide])

  const prevPerson = useCallback(() => {
    const newIndex = (currentIndex - 1 + data.length) % data.length
    changeSlide(newIndex)
  }, [currentIndex, data.length, changeSlide])

  const goToSlide = (index: number) => {
    changeSlide(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPlaying && !isAnimating) {
      intervalId = setInterval(nextPerson, SLIDE_TIMEOUT)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPlaying, nextPerson, isAnimating])

  return (
    <article className={styles.sliderContainer}>
      <div className={styles.slider}>
        {data.map((person, index) => (
          <div
            key={person.id}
            className={`${styles.slideContent} ${index === currentIndex ? styles.active : ''
              } ${isAnimating && index === currentIndex ? styles.exit : ''}`}
          >
            <img
              src={person.image || "/person-placeholder.jpg"}
              alt={person.name}
              className={styles.image}
              loading="lazy"
              width={200}
              height={200}
            />
            <div className={styles.info}>
              <h3>{person.name}</h3>
              {Array.isArray(person.comment) ? (
                person.comment.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{person.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <menu className={styles.navigation}>
        <button
          onClick={prevPerson}
          className={styles.navButton}
          disabled={isAnimating}
        >
          <IconArrowLeft />
        </button>

        <button
          onClick={togglePlayPause}
          className={styles.navButton}
          disabled={isAnimating}
        >
          {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
        </button>

        <div className={styles.indicators}>
          {data.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => !isAnimating && index !== currentIndex && goToSlide(index)}
            />
          ))}
        </div>

        <button
          onClick={nextPerson}
          className={styles.navButton}
          disabled={isAnimating}
        >
          <IconArrowRight />
        </button>
      </menu>

      <footer className={styles.counter}>
        {currentIndex + 1} / {data.length}
      </footer>
    </article>
  )
}