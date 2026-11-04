import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, Navigate, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import Home from './home'
import NotFound from './Components/AppShell/NotFound'

function renderRoute(path) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'console-adventure',
            element: <div>Console Adventure Route</div>,
          },
          {
            path: 'game',
            element: <Navigate to="/console-adventure" replace />,
          },
          {
            path: 'rtsim',
            element: <div>RTSim Route</div>,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
    {
      initialEntries: [path],
    },
  )

  render(<RouterProvider router={router} />)

  return router
}

describe('app shell routing', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('terminal-applications-locale', 'en')
    document.documentElement.className = ''
    document.documentElement.lang = 'en'
    delete document.documentElement.dataset.theme
    delete document.documentElement.dataset.themePreference
  })

  it('renders the home catalog inside the shell', () => {
    renderRoute('/')

    expect(screen.getAllByText('Terminal Applications')).not.toHaveLength(0)
    expect(screen.getByRole('button', { name: /play console adventure/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /scheduler simulator/i })).toBeInTheDocument()
    expect(screen.getByText(/explore the magical lands/i)).toBeInTheDocument()
    expect(screen.getByText(/simulate scheduler behavior/i)).toBeInTheDocument()
    expect(screen.getAllByText('xterm.js web port')).toHaveLength(2)
    expect(screen.getByRole('img', { name: /console adventure screenshot preview/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /rtsim scheduler screenshot preview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open console adventure source/i })).toHaveAttribute(
      'href',
      'https://github.com/vtmattedi/ConsoleAdventure',
    )
    expect(screen.getByRole('link', { name: /open rtsim source/i })).toHaveAttribute(
      'href',
      'https://github.com/vtmattedi/rtsim',
    )
  })

  it('navigates from the home catalog project actions', async () => {
    renderRoute('/')

    fireEvent.click(screen.getByRole('button', { name: /scheduler simulator/i }))

    expect(await screen.findByText('RTSim Route')).toBeInTheDocument()
  })

  it('renders MattediWorks branding and clears the initial boot overlay', async () => {
    renderRoute('/')

    expect(screen.getByRole('img', { name: 'MattediWorks logo' })).toBeInTheDocument()
    expect(screen.getByLabelText(/apps themselves run in english only/i)).toHaveAttribute(
      'title',
      'The apps themselves run in English only.',
    )
    expect(screen.getByRole('navigation', { name: /mattediworks social links/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mattediworks on github/i })).toHaveAttribute(
      'href',
      'https://github.com/vtmattedi',
    )
    expect(screen.getByRole('link', { name: /mattediworks on linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/vitor-mattedi-dev',
    )
    expect(screen.getByRole('link', { name: /contact mattediworks on whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/5571993152789',
    )
    expect(screen.getByText('Booting up')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Booting up')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('presents Terminal Engine as core project copy without adding an engine route link', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { name: 'Terminal Engine' })).toBeInTheDocument()
    expect(screen.getByText(/virtual vti-style terminal/i)).toBeInTheDocument()
    expect(screen.getByText(/xterm\.js by swapping the host hooks/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /terminal engine/i })).not.toBeInTheDocument()
  })

  it('keeps Terminal Engine out of the route map', () => {
    renderRoute('/terminal-engine')

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  it('redirects the legacy game route to Console Adventure', async () => {
    renderRoute('/game')

    expect(await screen.findByText('Console Adventure Route')).toBeInTheDocument()
  })

  it('renders a not-found page under the shell', () => {
    renderRoute('/missing-route')

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back home/i })).toBeInTheDocument()
  })

  it('persists theme selections and updates the document theme state', () => {
    renderRoute('/')

    const light = screen.getByRole('button', { name: 'Light' })
    const dark = screen.getByRole('button', { name: 'Dark' })
    const system = screen.getByRole('button', { name: 'System' })

    fireEvent.click(light)

    expect(window.localStorage.getItem('terminal-applications-theme')).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.dataset.themePreference).toBe('light')

    fireEvent.click(dark)

    expect(window.localStorage.getItem('terminal-applications-theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.dataset.themePreference).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    fireEvent.click(system)

    expect(window.localStorage.getItem('terminal-applications-theme')).toBe('system')
    expect(document.documentElement.dataset.themePreference).toBe('system')
  })

  it('persists Portuguese and translates the visible shell and catalog copy', async () => {
    renderRoute('/')

    fireEvent.click(screen.getByRole('button', { name: 'PT' }))

    expect(window.localStorage.getItem('terminal-applications-locale')).toBe('pt-BR')
    await waitFor(() => expect(document.documentElement.lang).toBe('pt-BR'))
    expect(screen.getByRole('button', { name: /jogar console adventure/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /simulador escalonador/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /apps de terminal/i })).toBeInTheDocument()
    expect(screen.getByText(/apps de terminal no navegador/i)).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /principal/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /tema/i })).toBeInTheDocument()
  })
})
