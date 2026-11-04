import "./Info.css";

const Info = ({ hidden = false, project: providedProject }) => {
    if (!providedProject) {
        throw new Error('Info requires a localized project');
    }

    const project = providedProject;

    return (
        <aside className={hidden ? 'info-panel info-panel--hidden' : 'info-panel'}>
            <div className="info-panel__copy">
                <p className="info-panel__warning">
                    {project.widthWarning}
                </p>
                <p className="info-panel__description">
                    {project.description}
                </p>
            </div>
            <div className='info-panel__screenshots'>
                {project.screenshots.map((img, index) => {
                    return (<img className="info-panel__screenshot" key={img} src={img} alt={`${project.screenshotAlt} ${index + 1}`} />)
                })}
            </div>
        </aside>
    );
};

export default Info;
