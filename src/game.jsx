import ConsoleAdventure from './Components/ConsoleAdVentureWeb/ConsoleAdventureWeb';
import TerminalProjectPage from './Components/TerminalProjectPage/TerminalProjectPage';
import { getLocalizedProject, projectIds } from './content/projects';
import { useI18n } from './MattediWorks/hooks/useI18n';
const Game = () => {
    const { t } = useI18n();
    const project = getLocalizedProject(projectIds.consoleAdventure, t);
    return (
        <TerminalProjectPage project={project} labels={t.terminalPage}>
            <ConsoleAdventure />
        </TerminalProjectPage>
    );
};

export default Game;
