import { FitAddon } from '@xterm/addon-fit'
import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { BasicConsole, DefaultColors } from '../../ConsoleAdventure/Game/Base/ConsoleHelp'
import { Game, GameStates } from '../../ConsoleAdventure/Game/Game'
import { GameColors } from '../../ConsoleAdventure/Game/Base/GameColors'
import { DevMode } from '../../ConsoleAdventure/Game/Base/DevMode'
import './Terminal.css'
import { Genie } from '../../ConsoleAdventure/Game/Genie'
import { GameState } from '../../ConsoleAdventure/Game/GameState'

const noop = () => {}

const xtermOptions = {
    convertEol: true,
    fontSize: 18,
    cursorStyle: 'block',
    theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selectionBackground: '#334155',
    },
    cursorBlink: true,
    scrollback: 2000,
    screenReaderMode: false,
}

const applyConsoleAdventurePalette = () => {
    DefaultColors.BLUE = DefaultColors.custom_colors(75)
    DefaultColors.GREEN = DefaultColors.custom_colors(83)
    DefaultColors.YELLOW = DefaultColors.custom_colors(227)
    DefaultColors.MAGENTA = DefaultColors.custom_colors(201)
    DefaultColors.CYAN = DefaultColors.custom_colors(123)
    GameColors.Reload()
    GameColors.class_colors[0].color = DefaultColors.custom_colors(215)
}

const getInputFromKey = (key) => {
    const domKey = key.domEvent?.key

    if (!domKey) {
        return null
    }

    return domKey === ' ' ? 'space' : domKey.toLowerCase()
}

const detachConsole = (consoleHelper) => {
    consoleHelper.write = noop
    consoleHelper.clear_screen = noop
    consoleHelper.show_cursor = noop
    consoleHelper.getWidth = () => 0
}

const ConsoleAdventure = () => {
    const { instance, ref } = useXTerm()
    const game = useRef(null)
    const linesToClear = useRef(0)

    useEffect(() => {
        if (!instance) {
            return undefined
        }

        const fitAddon = new FitAddon()
        const CH = new BasicConsole()
        const gameStates = GameStates.getInstance()
        let disposed = false
        let initialRenderFrame = null

        const fitTerminal = () => {
            if (!disposed) {
                fitAddon.fit()
            }
        }

        const focusTerminal = () => {
            if (!disposed) {
                instance.focus()
            }
        }

        instance.loadAddon(fitAddon)
        instance.options = xtermOptions

        CH.getWidth = () => {
            fitTerminal()
            return instance.cols ?? 0
        }
        CH.write = (text) => {
            if (!disposed) {
                instance.write(text)
            }
        }
        CH.clear_screen = () => {
            if (!disposed) {
                instance.clear()
            }
        }

        CH.show_cursor(false)
        Game.resetSessionState()
        GameStates.setSlowRunning(20)
        applyConsoleAdventurePalette()

        const currentGame = new Game()
        game.current = currentGame
        currentGame.exitTheGame = () => {
            gameStates.reset(new GameState(
                () => {
                    CH.clear_screen()
                    Genie.getInstance().goodbye(currentGame.player.name)
                    const restartText = CH.insert_color(
                        DefaultColors.YELLOW,
                        'Refresh the page or reopen Console Adventure to restart.',
                    )
                    CH.print(CH.hcenter(restartText, CH.getWidth()))
                },
                noop,
                noop,
                noop,
            ))
            GameStates.rerender()
        }

        const keyDisposable = instance.onKey((key) => {
            if (disposed || !game.current) {
                return
            }

            if (key.key === '\x02') {
                DevMode.getInstance().setValue()
                GameStates.rerender()
                CH.print('Dev Mode: ' + DevMode.getInstance().value)
                linesToClear.current++;
                return
            }

            if (key.key) {
                const input = getInputFromKey(key)

                if (input) {
                    game.current.handleInput(input)
                }
            }

            if (linesToClear.current > 0) {
                CH.clear_last_line(linesToClear.current)
                linesToClear.current = 0
            }

            GameStates.render()
        })

        const handleResize = () => {
            fitTerminal()
            GameStates.rerender()
        }

        window.addEventListener('resize', handleResize)
        gameStates.reset(currentGame.mainMenu)
        initialRenderFrame = window.requestAnimationFrame(() => {
            fitTerminal()
            focusTerminal()
            GameStates.rerender()
        })

        return () => {
            if (initialRenderFrame !== null) {
                window.cancelAnimationFrame(initialRenderFrame)
            }

            CH.show_cursor(true)
            disposed = true
            keyDisposable.dispose()
            window.removeEventListener('resize', handleResize)
            gameStates.reset()
            game.current = null
            linesToClear.current = 0
            detachConsole(CH)
            fitAddon.dispose()
        }
    }, [instance])

    return <div className='terminalDiv'>
        <div ref={ref} className='terminal' />
    </div>
}

export default ConsoleAdventure
