import { FitAddon } from '@xterm/addon-fit'
import { useEffect, useRef } from 'react'
import { useXTerm } from 'react-xtermjs'
import { BasicConsole } from '../../RTSim/Simulator/Engine/ConsoleHelp'
import { Simulator } from '../../RTSim/Simulator/Simulator'
import { useTheme } from '../../MattediWorks/hooks/useTheme'
import './Terminal.css'

const noop = () => {}

const xtermOptions = {
    convertEol: true,
    fontSize: 18,
    cursorStyle: 'block',
    cursorBlink: true,
    scrollback: 0,
    screenReaderMode: false,
}

const terminalThemes = {
    dark: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selectionBackground: '#334155',
    },
    light: {
        background: '#0a0c0f',
        foreground: '#f8fafc',
        cursor: '#f8fafc',
        selectionBackground: '#475569',
    },
}

const arrowByDomKey = {
    ArrowDown: 'arrowdown',
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
    ArrowUp: 'arrowup',
}

const arrowBySequence = {
    '\x1B[A': 'arrowup',
    '\x1B[B': 'arrowdown',
    '\x1B[C': 'arrowright',
    '\x1B[D': 'arrowleft',
}

const shiftedArrowBySequence = {
    '\x1B[1;2A': 'arrowup',
    '\x1B[1;2B': 'arrowdown',
    '\x1B[1;2C': 'arrowright',
    '\x1B[1;2D': 'arrowleft',
}

const getTerminalTheme = (resolvedTheme) => terminalThemes[resolvedTheme] ?? terminalThemes.dark

const getDocumentResolvedTheme = () => {
    if (typeof document === 'undefined') {
        return 'dark'
    }

    return document.documentElement.dataset.theme ?? 'dark'
}

const normalizeKeyEvent = (key) => {
    const domKey = key.domEvent?.key ?? ''
    const rawInput = key.key ?? ''
    const modifiers = {
        ctrl: Boolean(key.domEvent?.ctrlKey),
        shift: Boolean(key.domEvent?.shiftKey),
        alt: Boolean(key.domEvent?.altKey),
    }

    if (rawInput === '\x03' || (modifiers.ctrl && domKey.toLowerCase() === 'c')) {
        return { input: 'ctrl+c', modifiers, shouldExit: true }
    }

    if (rawInput === '\x04' || (modifiers.ctrl && domKey.toLowerCase() === 'd')) {
        return {
            input: 'd',
            modifiers: { ...modifiers, ctrl: true },
            shouldExit: false,
        }
    }

    const shiftedArrow = shiftedArrowBySequence[rawInput]
    if (shiftedArrow) {
        return {
            input: shiftedArrow,
            modifiers: { ...modifiers, shift: true },
            shouldExit: false,
        }
    }

    const arrowInput = arrowByDomKey[domKey] ?? arrowBySequence[rawInput]
    if (arrowInput) {
        return { input: arrowInput, modifiers, shouldExit: false }
    }

    if (rawInput === '\x1b' || domKey === 'Escape') {
        return { input: 'esc', modifiers, shouldExit: false }
    }

    if (domKey === 'Enter' || (rawInput.length > 0 && rawInput.charCodeAt(0) === 13)) {
        return { input: 'enter', modifiers, shouldExit: false }
    }

    if (domKey === ' ' || (rawInput.length > 0 && rawInput.charCodeAt(0) === 32)) {
        return { input: 'space', modifiers, shouldExit: false }
    }

    if (domKey.length === 1) {
        return {
            input: domKey.toLowerCase(),
            modifiers: {
                ...modifiers,
                shift: modifiers.shift || domKey.toLowerCase() !== domKey,
            },
            shouldExit: false,
        }
    }

    if (rawInput.length === 1) {
        return {
            input: rawInput.toLowerCase(),
            modifiers: {
                ...modifiers,
                shift: modifiers.shift || rawInput.toLowerCase() !== rawInput,
            },
            shouldExit: false,
        }
    }

    return null
}

const detachConsole = (consoleHelper) => {
    consoleHelper.write = noop
    consoleHelper.clear_screen = noop
    consoleHelper.show_cursor = noop
    consoleHelper.getWidth = () => 0
    consoleHelper.getHeight = () => 0
}

const RTSim = () => {
    const { instance, ref } = useXTerm()
    const { resolvedTheme } = useTheme()
    const sim = useRef(null)

    useEffect(() => {
        if (!instance) {
            return undefined
        }

        const fitAddon = new FitAddon()
        const CH = new BasicConsole()
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

        const createSimulator = () => {
            const simulator = new Simulator()

            simulator.setupExit(() => {
                simulator.resetEngine()

                if (disposed) {
                    return
                }

                sim.current = createSimulator()
                fitTerminal()
                sim.current.resize()
                focusTerminal()
            })

            return simulator
        }

        instance.loadAddon(fitAddon)
        instance.options = {
            ...xtermOptions,
            theme: getTerminalTheme(getDocumentResolvedTheme()),
        }

        CH.getWidth = () => {
            fitTerminal()
            return instance.cols ?? 0
        }
        CH.getHeight = () => {
            fitTerminal()
            return instance.rows ?? 0
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

        fitTerminal()
        CH.show_cursor(false)
        sim.current = createSimulator()

        const keyDisposable = instance.onKey((key) => {
            if (disposed || !sim.current) {
                return
            }

            const normalized = normalizeKeyEvent(key)

            if (!normalized) {
                return
            }

            if (normalized.shouldExit) {
                sim.current.Engine.exit()
                return
            }

            sim.current.handleInput(normalized.input, normalized.modifiers)
        })

        const handleResize = () => {
            fitTerminal()
            sim.current?.resize()
        }

        window.addEventListener('resize', handleResize)
        initialRenderFrame = window.requestAnimationFrame(() => {
            fitTerminal()
            sim.current?.resize()
            focusTerminal()
        })

        return () => {
            if (initialRenderFrame !== null) {
                window.cancelAnimationFrame(initialRenderFrame)
            }

            sim.current?.dispose()
            CH.show_cursor(true)
            disposed = true
            keyDisposable.dispose()
            window.removeEventListener('resize', handleResize)
            sim.current = null
            detachConsole(CH)
            fitAddon.dispose()
        }
    }, [instance])

    useEffect(() => {
        if (!instance) {
            return
        }

        instance.options = {
            theme: getTerminalTheme(resolvedTheme),
        }
        sim.current?.resize()
    }, [instance, resolvedTheme])

    return <div className='terminalDiv'>
        <div ref={ref} className='terminal' />
    </div>
}

export default RTSim
