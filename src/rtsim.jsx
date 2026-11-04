import RTSim from './Components/RTSimWeb/rtsim';
import TerminalProjectPage from './Components/TerminalProjectPage/TerminalProjectPage';
import { getLocalizedProject, projectIds } from './content/projects';
import { useI18n } from './MattediWorks/hooks/useI18n';
const Rtsim = () => {
    const { t } = useI18n();
    const project = getLocalizedProject(projectIds.rtsim, t);
    return (
        <TerminalProjectPage project={project} labels={t.terminalPage}>
            <RTSim />
        </TerminalProjectPage>
    );
};

export default Rtsim;
