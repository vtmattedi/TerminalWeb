import logoMarkup from '../assets/images/logo.svg?raw'
import logoWithNameMarkup from '../assets/images/logoWithName.svg?raw'
import './MattediWorksLogo.css'

type MattediWorksLogoProps = {
  className?: string
  decorative?: boolean
  label?: string
  variant?: 'mark' | 'wordmark'
}

export default function MattediWorksLogo({
  className = '',
  decorative = false,
  label = 'MattediWorks logo',
  variant = 'mark',
}: MattediWorksLogoProps) {
  const markup = variant === 'wordmark' ? logoWithNameMarkup : logoMarkup
  const classNames = ['mw-logo', `mw-logo--${variant}`, className].filter(Boolean).join(' ')
  const accessibilityProps = decorative
    ? { 'aria-hidden': true }
    : { 'aria-label': label, role: 'img' }

  return (
    <span
      className={classNames}
      dangerouslySetInnerHTML={{ __html: markup }}
      {...accessibilityProps}
    />
  )
}
