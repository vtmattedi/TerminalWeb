import { useNavigate } from 'react-router-dom';
import { getLocalizedProject, getLocalizedProjects, projectIds, terminalProjectIds } from './content/projects';
import MattediWorksLogo from './MattediWorks/Components/MattediWorksLogo';
import { useI18n } from './MattediWorks/hooks/useI18n';

const Home = () => {
    const nav = useNavigate();
    const { t } = useI18n();
    const engineProject = getLocalizedProject(projectIds.terminalEngine, t);
    const terminalProjects = getLocalizedProjects(terminalProjectIds, t);
    const socialLinks = [
        {
            href: 'https://github.com/vtmattedi',
            label: t.home.footerGithub,
            iconClass: 'bi bi-github',
        },
        {
            href: 'https://www.linkedin.com/in/vitor-mattedi-dev',
            label: t.home.footerLinkedIn,
            iconClass: 'bi bi-linkedin',
        },
        {
            href: 'https://wa.me/5571993152789',
            label: t.home.footerWhatsApp,
            iconClass: 'bi bi-whatsapp',
        },
    ];

    return (
        <div className="home-page">
            <section className="home-overview" aria-labelledby="home-title">
                <div className="home-overview__brand">
                    <MattediWorksLogo
                        className="home-brand-wordmark"
                        variant="wordmark"
                        label={t.home.mattediWorksLogoAlt}
                    />
                    <span className="home-kicker">{t.home.catalogLabel}</span>
                    <h1 id="home-title">{t.shell.productName}</h1>
                    <p>{t.home.intro}</p>
                </div>

                <section className="home-engine-panel" aria-labelledby="home-engine-title">
                    <div className="home-engine-panel__title">
                        <span className={engineProject.iconClass} aria-hidden="true"></span>
                        <div>
                            <span className="home-kicker">{engineProject.label}</span>
                            <h2 id="home-engine-title">{engineProject.name}</h2>
                        </div>
                    </div>
                    <p>{engineProject.summary}</p>
                    <ul className="home-tag-list" aria-label={`${engineProject.name} capabilities`}>
                        {engineProject.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                    <ul className="home-engine-highlights">
                        {engineProject.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </section>
            </section>

            <section className="home-catalog" aria-labelledby="home-catalog-title">
                <div className="home-section-heading">
                    <h2 id="home-catalog-title">{t.home.appsTitle}</h2>
                    <p>{t.home.appsIntro}</p>
                </div>
                <div className="home-project-grid">
                    {terminalProjects.map((project) => (
                        <article className="home-project-card" key={project.id} aria-labelledby={`${project.id}-title`}>
                            <div className="home-project-card__media">
                                <img src={project.primaryImage} alt={`${project.screenshotAlt} preview`} />
                            </div>
                            <div className="home-project-card__body">
                                <div>
                                    <h3 id={`${project.id}-title`}>{project.name}</h3>
                                    <p>{project.description}</p>
                                </div>
                                <ul className="home-tag-list" aria-label={`${project.name} capabilities`}>
                                    {project.tags.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                                <div className="home-project-card__actions">
                                    <button
                                        type="button"
                                        className="home-project-card__launch"
                                        onClick={() => nav(project.routePath)}
                                    >
                                        <span className={project.iconClass} aria-hidden="true"></span>
                                        {project.ctaLabel}
                                    </button>
                                    <a
                                        className="home-project-card__source"
                                        href={project.sourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={project.sourceAria}
                                    >
                                        <span className="bi bi-github" aria-hidden="true"></span>
                                        {project.sourceLabel}
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="home-footer" aria-label={t.home.footerLabel}>
                <MattediWorksLogo
                    className="home-footer__mark"
                    variant="wordmark"
                    decorative
                />
                <nav className="home-footer__links" aria-label={t.home.footerSocialLabel}>
                    {socialLinks.map((link) => (
                        <a
                            key={link.href}
                            className="home-footer__link"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={link.label}
                            title={link.label}
                        >
                            <span className={link.iconClass} aria-hidden="true"></span>
                        </a>
                    ))}
                </nav>
            </footer>
        </div>
    );
};

export default Home;
