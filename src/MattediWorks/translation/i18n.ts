export const locales = ['en', 'pt-BR'] as const

export type Locale = typeof locales[number]

type ProjectCopy = {
  name: string
  label?: string
  summary: string
  description: string
  ctaLabel?: string
  sourceLabel?: string
  sourceAria?: string
  screenshotAlt?: string
  widthWarning?: string
  highlights?: string[]
  tags: Record<string, string>
}

export type Translation = {
  languageLabel: string
  languageAppNotice: string
  common: {
    github: string
    loading: string
  }
  theme: {
    label: string
    light: string
    dark: string
    system: string
    switchTo: string
  }
  shell: {
    productName: string
    homeAria: string
    primaryNav: string
    back: string
    nav: {
      home: string
      consoleAdventure: string
      rtsim: string
    }
  }
  home: {
    catalogLabel: string
    intro: string
    mattediWorksLogoAlt: string
    appsTitle: string
    appsIntro: string
    footerLabel: string
    footerSocialLabel: string
    footerGithub: string
    footerLinkedIn: string
    footerWhatsApp: string
  }
  terminalPage: {
    overview: string
    play: string
    viewLabel: string
    theatreOn: string
    theatreOff: string
  }
  projects: {
    terminalEngine: ProjectCopy
    consoleAdventure: ProjectCopy
    rtsim: ProjectCopy
  }
  notFound: {
    title: string
    message: string
    backHome: string
  }
}

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  'pt-BR': 'PT',
}

export const translations: Record<Locale, Translation> = {
  en: {
    languageLabel: 'Language',
    languageAppNotice: 'The apps themselves run in English only.',
    common: {
      github: 'GitHub',
      loading: 'Booting up',
    },
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      switchTo: 'switch to',
    },
    shell: {
      productName: 'Terminal Applications',
      homeAria: 'Terminal Applications home',
      primaryNav: 'Primary',
      back: 'Back',
      nav: {
        home: 'Home',
        consoleAdventure: 'Console Adventure',
        rtsim: 'RTSim',
      },
    },
    home: {
      catalogLabel: 'Published catalog',
      intro: 'These are console applications built for Node.js and ported to run in the browser with xterm.js.',
      mattediWorksLogoAlt: 'MattediWorks logo',
      appsTitle: 'Terminal apps',
      appsIntro: 'Browser-hosted terminal apps with canonical source links and project previews.',
      footerLabel: 'MattediWorks footer',
      footerSocialLabel: 'MattediWorks social links',
      footerGithub: 'MattediWorks on GitHub',
      footerLinkedIn: 'MattediWorks on LinkedIn',
      footerWhatsApp: 'Contact MattediWorks on WhatsApp',
    },
    terminalPage: {
      overview: 'Overview',
      play: 'Play',
      viewLabel: 'view',
      theatreOn: 'Dim everything but the terminal',
      theatreOff: 'Restore page lighting',
    },
    projects: {
      terminalEngine: {
        label: 'Core project',
        name: 'Terminal Engine',
        summary:
          'A virtual VTI-style terminal built around BasicConsole, where apps wire in stdout, stdin, input events, and column measurement once and then run without knowing the host changed.',
        description:
          'Terminal Engine gives terminal applications a host-agnostic console boundary. After BasicConsole is connected to output, input, cursor, clear, and width hooks, app code can target the engine while Node terminals or xterm.js provide the actual screen.',
        highlights: [
          'Stdout, stdin, input handling, cursor control, clearing, and column measurement live behind one virtual terminal API.',
          'Apps written for a compiling or Node terminal can be ported to xterm.js by swapping the host hooks instead of rewriting render code.',
        ],
        tags: {
          ansiOutput: 'ANSI output',
          xtermBridge: 'xterm.js bridge',
          runtimeBoundary: 'Virtual terminal',
          resizeContract: 'Column-aware layout',
        },
      },
      consoleAdventure: {
        label: 'Terminal app',
        name: 'Console Adventure',
        summary:
          'Terminal fantasy RPG for Node.js, ported to React and xterm.js so it can run in the browser.',
        description:
          'Explore the Magical Lands, fight enemies, find gear, and play a growing object-oriented terminal RPG. The source runtime runs on Node.js; this site hosts the xterm.js web port.',
        ctaLabel: 'Play Console Adventure',
        sourceLabel: 'Source: vtmattedi/ConsoleAdventure',
        sourceAria: 'Open Console Adventure source on GitHub',
        screenshotAlt: 'Console Adventure screenshot',
        widthWarning:
          'Console Adventure needs at least 1040 px of width for the live terminal.',
        tags: {
          fantasyRpg: 'Fantasy RPG',
          nodeRuntime: 'Node.js runtime',
          xtermWebPort: 'xterm.js web port',
          turnBasedCombat: 'Turn-based combat',
        },
      },
      rtsim: {
        label: 'Terminal app',
        name: 'RTSim',
        summary:
          'Discrete-time preemptive scheduler simulator for one or more CPUs, ported to xterm.js for the browser.',
        description:
          'Simulate scheduler behavior at individual time steps using EDF, FCFS, HRRN, Priority, Round Robin, and SJF. The Node.js runtime renders a console scene that is adapted to xterm.js on the web.',
        ctaLabel: 'Scheduler Simulator',
        sourceLabel: 'Source: vtmattedi/rtsim',
        sourceAria: 'Open RTSim source on GitHub',
        screenshotAlt: 'RTSim scheduler screenshot',
        widthWarning:
          'RTSim needs a wider viewport for its 60-column terminal scene.',
        tags: {
          schedulerSimulator: 'Scheduler simulator',
          nodeRuntime: 'Node.js runtime',
          xtermWebPort: 'xterm.js web port',
          preemptiveScheduling: 'Preemptive scheduling',
        },
      },
    },
    notFound: {
      title: 'Page Not Found',
      message: 'The terminal you are looking for is not in this route.',
      backHome: 'Back Home',
    },
  },
  'pt-BR': {
    languageLabel: 'Idioma',
    languageAppNotice: 'Os apps em si rodam apenas em ingles.',
    common: {
      github: 'GitHub',
      loading: 'Inicializando',
    },
    theme: {
      label: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema',
      switchTo: 'mudar para',
    },
    shell: {
      productName: 'Terminal Applications',
      homeAria: 'Inicio do Terminal Applications',
      primaryNav: 'Principal',
      back: 'Voltar',
      nav: {
        home: 'Inicio',
        consoleAdventure: 'Console Adventure',
        rtsim: 'RTSim',
      },
    },
    home: {
      catalogLabel: 'Catalogo publicado',
      intro: 'Estes sao aplicativos de console criados para Node.js e portados para rodar no navegador com xterm.js.',
      mattediWorksLogoAlt: 'Logo MattediWorks',
      appsTitle: 'Apps de terminal',
      appsIntro: 'Apps de terminal no navegador com links canonicos de codigo e previews dos projetos.',
      footerLabel: 'Rodape MattediWorks',
      footerSocialLabel: 'Links sociais MattediWorks',
      footerGithub: 'MattediWorks no GitHub',
      footerLinkedIn: 'MattediWorks no LinkedIn',
      footerWhatsApp: 'Contato MattediWorks no WhatsApp',
    },
    terminalPage: {
      overview: 'Visao geral',
      play: 'Jogar',
      viewLabel: 'visualizacao',
      theatreOn: 'Escurecer tudo menos o terminal',
      theatreOff: 'Restaurar iluminacao da pagina',
    },
    projects: {
      terminalEngine: {
        label: 'Projeto central',
        name: 'Terminal Engine',
        summary:
          'Um terminal virtual no estilo VTI em torno do BasicConsole, onde apps conectam stdout, stdin, eventos de input e medicao de colunas uma vez e rodam sem perceber a troca de host.',
        description:
          'Terminal Engine entrega uma fronteira de console agnostica ao host para apps de terminal. Depois que BasicConsole recebe hooks de saida, input, cursor, limpeza e largura, o app mira no engine enquanto terminais Node ou xterm.js fornecem a tela real.',
        highlights: [
          'Stdout, stdin, input, controle de cursor, limpeza e medicao de colunas ficam atras de uma unica API de terminal virtual.',
          'Apps escritos para terminal compilado ou Node podem ser portados para xterm.js trocando os hooks do host, sem reescrever o codigo de renderizacao.',
        ],
        tags: {
          ansiOutput: 'Saida ANSI',
          xtermBridge: 'Ponte xterm.js',
          runtimeBoundary: 'Terminal virtual',
          resizeContract: 'Layout por colunas',
        },
      },
      consoleAdventure: {
        label: 'App de terminal',
        name: 'Console Adventure',
        summary:
          'RPG de fantasia em terminal criado para Node.js e portado para React e xterm.js para rodar no navegador.',
        description:
          'Explore as Magical Lands, enfrente inimigos, encontre equipamentos e jogue um RPG de terminal orientado a objetos em expansao. O runtime fonte roda em Node.js; este site hospeda o port web com xterm.js.',
        ctaLabel: 'Jogar Console Adventure',
        sourceLabel: 'Codigo: vtmattedi/ConsoleAdventure',
        sourceAria: 'Abrir codigo do Console Adventure no GitHub',
        screenshotAlt: 'Captura de tela do Console Adventure',
        widthWarning:
          'Console Adventure precisa de pelo menos 1040 px de largura para o terminal ao vivo.',
        tags: {
          fantasyRpg: 'RPG de fantasia',
          nodeRuntime: 'Runtime Node.js',
          xtermWebPort: 'Port web xterm.js',
          turnBasedCombat: 'Combate em turnos',
        },
      },
      rtsim: {
        label: 'App de terminal',
        name: 'RTSim',
        summary:
          'Simulador de escalonamento preemptivo em tempo discreto para uma ou mais CPUs, portado para xterm.js no navegador.',
        description:
          'Simule o comportamento do escalonador em passos discretos usando EDF, FCFS, HRRN, Priority, Round Robin e SJF. O runtime Node.js renderiza uma cena de console adaptada para xterm.js na web.',
        ctaLabel: 'Simulador Escalonador',
        sourceLabel: 'Codigo: vtmattedi/rtsim',
        sourceAria: 'Abrir codigo do RTSim no GitHub',
        screenshotAlt: 'Captura de tela do RTSim',
        widthWarning:
          'RTSim precisa de uma viewport mais larga para a cena de terminal com 60 colunas.',
        tags: {
          schedulerSimulator: 'Simulador de escalonamento',
          nodeRuntime: 'Runtime Node.js',
          xtermWebPort: 'Port web xterm.js',
          preemptiveScheduling: 'Escalonamento preemptivo',
        },
      },
    },
    notFound: {
      title: 'Pagina Nao Encontrada',
      message: 'O terminal que voce procura nao esta nesta rota.',
      backHome: 'Voltar ao Inicio',
    },
  },
}
