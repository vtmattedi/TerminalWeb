
import 'bootstrap-icons/font/bootstrap-icons.css';
import AppShell from './Components/AppShell/AppShell';
import { I18nProvider } from './MattediWorks/hooks/useI18n';
import { ThemeProvider } from './MattediWorks/hooks/useTheme';

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <div className='bgDiv'>
          <AppShell />
        </div>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
