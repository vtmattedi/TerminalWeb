import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LoaderCircle } from 'lucide-react'
import logoMarkup from './logoWithName.svg?raw'
import styles from './MWLoading.module.css'

gsap.registerPlugin(useGSAP)

export type MWLoadingProps = {
  show: boolean
  repeat?: boolean
  label?: string
}

const orange = '#ff9849'
const exitDelayMs = 240

function getPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function syncLogoTheme(logo: HTMLDivElement | null) {
  if (!logo) {
    return
  }

  const logoInk = getComputedStyle(logo).getPropertyValue('--mw-loading-ink').trim() || '#000000'

  logo.querySelectorAll<SVGPathElement>('svg path').forEach((path) => {
    const finalColor = path.classList.contains('cls-1') ? orange : logoInk

    path.setAttribute('data-final-fill', finalColor)
    path.style.stroke = finalColor

    if (path.style.fill && path.style.fill !== 'transparent') {
      path.style.fill = finalColor
    }
  })
}

export default function MWLoading({ show, repeat = false, label = 'Loading' }: MWLoadingProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(show)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
      return
    }

    const timeout = window.setTimeout(() => setShouldRender(false), exitDelayMs)

    return () => window.clearTimeout(timeout)
  }, [show])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches)
    }

    updatePreference(mediaQuery)
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useGSAP(
    () => {
      const logo = logoRef.current

      if (!logo || !show) {
        return
      }

      const paths = gsap.utils.toArray<SVGPathElement>('svg path', logo)
      const mainLogoPaths = gsap.utils.toArray<SVGPathElement>('svg > path', logo)
      const logoInk = getComputedStyle(logo).getPropertyValue('--mw-loading-ink').trim() || '#101317'

      if (prefersReducedMotion) {
        paths.forEach((path) => {
          const finalColor = path.classList.contains('cls-1') ? orange : logoInk

          gsap.set(path, {
            fill: finalColor,
            strokeWidth: 0,
            strokeDashoffset: 0,
          })
        })

        gsap.set(logo, {
          autoAlpha: 1,
          filter: 'none',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          y: 0,
        })

        return
      }

      paths.forEach((path) => {
        const pathLength = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0
        const finalColor = path.classList.contains('cls-1') ? orange : logoInk

        gsap.set(path, {
          attr: {
            'data-final-fill': finalColor,
          },
          fill: 'transparent',
          stroke: finalColor,
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: mainLogoPaths.includes(path) ? 8 : 3,
        })
      })

      gsap.set(logo, {
        autoAlpha: 1,
        filter: 'drop-shadow(0 22px 42px rgba(0, 0, 0, 0.34))',
        rotateX: 0,
        rotateY: 0,
        scale: 1.06,
        transformPerspective: 900,
        y: 0,
      })

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.8 : 0,
      })

      timeline
        .to(paths, {
          duration: 1.05,
          ease: 'power3.inOut',
          stagger: {
            amount: 0.56,
            from: 'start',
          },
          strokeDashoffset: 0,
        })
        .to(paths, {
          duration: 0.36,
          fill: (_, path) => path.getAttribute('data-final-fill') ?? orange,
          strokeWidth: 0,
        }, '-=0.18')
        .to(logo, {
          duration: 0.28,
          ease: 'back.out(2.2)',
          filter: 'drop-shadow(0 28px 46px rgba(0, 0, 0, 0.42))',
          rotateX: -6,
          rotateY: 4,
          scale: 1.12,
          y: -6,
        }, '-=0.04')
        .to(logo, {
          duration: 0.48,
          ease: 'elastic.out(1, 0.62)',
          filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.34))',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          y: 0,
        })

      return () => {
        timeline.kill()
      }
    },
    {
      dependencies: [show, repeat, shouldRender, prefersReducedMotion],
      scope: logoRef,
      revertOnUpdate: true,
    },
  )

  useEffect(() => {
    if (!shouldRender) {
      return
    }

    syncLogoTheme(logoRef.current)

    const observer = new MutationObserver(() => syncLogoTheme(logoRef.current))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    return () => observer.disconnect()
  }, [shouldRender])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={[styles.overlay, show ? styles.overlayVisible : ''].filter(Boolean).join(' ')}
      aria-live="polite"
      aria-busy={show}
      aria-hidden={!show}
      role="status"
    >
      <div className={styles.content}>
        <div
          ref={logoRef}
          className={styles.logo}
          aria-label="Mattedi Works"
          dangerouslySetInnerHTML={{ __html: logoMarkup }}
        />

        <div className={styles.status}>
          <LoaderCircle aria-hidden="true" />
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}
