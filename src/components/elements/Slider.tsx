import styles from "@/css/slider/Slider.module.css"
import { SLIDE_TIMEOUT } from "@/constants"
import { useCallback, useEffect, useRef, useState } from "react"
import { ISliderItem } from "@/interfaces/Slider"
import {
	IconArrowLeft,
	IconArrowRight,
	IconPlayerPause,
	IconPlayerPlay,
} from "@tabler/icons-react"

interface Props {
	data: ISliderItem[]
}

export function Slider({ data }: Props) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(true)
	const [isInteracting, setIsInteracting] = useState(false)
	const pointerStart = useRef<number | null>(null)

	const nextPerson = useCallback(() => {
		setCurrentIndex((current) => (current + 1) % data.length)
	}, [data.length])

	const prevPerson = useCallback(() => {
		setCurrentIndex((current) => (current - 1 + data.length) % data.length)
	}, [data.length])

	useEffect(() => {
		if (!isPlaying || isInteracting) return
		const intervalId = window.setInterval(nextPerson, SLIDE_TIMEOUT)
		return () => window.clearInterval(intervalId)
	}, [isPlaying, isInteracting, nextPerson])

	const handlePointerDown = (event: React.PointerEvent) => {
		pointerStart.current = event.clientX
	}

	const handlePointerUp = (event: React.PointerEvent) => {
		if (pointerStart.current === null) return
		const distance = event.clientX - pointerStart.current
		pointerStart.current = null

		if (Math.abs(distance) < 45) return
		distance > 0 ? prevPerson() : nextPerson()
	}

	const person = data[currentIndex]

	return (
		<article
			className={styles.sliderContainer}
			onMouseEnter={() => setIsInteracting(true)}
			onMouseLeave={() => setIsInteracting(false)}
			onFocus={() => setIsInteracting(true)}
			onBlur={() => setIsInteracting(false)}
		>
			<div
				className={styles.slider}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
			>
				<div
					key={person.id}
					className={styles.slideContent}
					aria-live="polite"
				>
					<div className={styles.portrait}>
						<img
							src={person.image}
							alt={person.name}
							className={styles.image}
						/>
						<span>{String(currentIndex + 1).padStart(2, "0")}</span>
					</div>

					<div className={styles.info}>
						<div className={styles.personHeading}>
							<span className={styles.context}>Personas que admiro</span>
							<h3>{person.name}</h3>
						</div>
						<div className={styles.comment}>
							{Array.isArray(person.comment) ? (
								person.comment.map((paragraph, index) => (
									<p key={index}>{paragraph}</p>
								))
							) : (
								<p>{person.comment}</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<footer className={styles.toolbar}>
				<div className={styles.navigation}>
					<button
						onClick={prevPerson}
						className={styles.navButton}
						aria-label="Ver persona anterior"
					>
						<IconArrowLeft />
					</button>
					<button
						onClick={nextPerson}
						className={styles.navButton}
						aria-label="Ver siguiente persona"
					>
						<IconArrowRight />
					</button>
				</div>

				<div className={styles.indicators} aria-label="Seleccionar persona">
					{data.map((item, index) => (
						<button
							key={item.id}
							className={`${styles.indicator} ${
								index === currentIndex ? styles.active : ""
							}`}
							onClick={() => setCurrentIndex(index)}
							aria-label={`Ver a ${item.name}`}
							aria-current={index === currentIndex ? "true" : undefined}
						/>
					))}
				</div>

				<button
					onClick={() => setIsPlaying((playing) => !playing)}
					className={styles.playButton}
					aria-label={
						isPlaying
							? "Pausar carrusel automático"
							: "Reanudar carrusel automático"
					}
				>
					{isPlaying ? (
						<IconPlayerPause size={17} />
					) : (
						<IconPlayerPlay size={17} />
					)}
				</button>
			</footer>
		</article>
	)
}
