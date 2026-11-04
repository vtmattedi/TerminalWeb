import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../MattediWorks/hooks/useI18n'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <section className="not-found-page">
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.message}</p>
      <button type="button" onClick={() => navigate('/')}>
        <span className="bi bi-house-fill" aria-hidden="true" />
        <span>{t.notFound.backHome}</span>
      </button>
    </section>
  )
}
