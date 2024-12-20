import React, {useEffect, useState} from "react"
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from "rehype-sanitize";
import {useTheme} from "@mui/material/styles";
import PlaytimeSetter from "./log-details-content/PlaytimeSetter.jsx";
import {TextField} from "@mui/material";

function SessionEditor({
                           session,
                           sessionContent,
                           setSessionContent,
                           sessionTitle,
                           setSessionTitle,
                           collapseButtonSize
                       }) {
    const theme = useTheme();
    const styles = getStyles(theme, collapseButtonSize);

    useEffect(() => {
        setSessionTitle(session.title)
        if (session.time_played !== 0) {
            setHours(Math.floor(session.time_played / 60))
            setMinutes(session.time_played % 60)
            formatMinutes()
        } else {
            setHours('')
            setMinutes('')
        }
    }, [session])

    const [hours, setHours] = useState('')
    const handleHoursChange = (event) => {
        setHours(Number(event.target.value))
    }

    const formatHours = () => {
        if (hours === 0) {
            setHours('')
            formatMinutes(true)
        } else {
            formatMinutes(false)
        }
    }

    const [minutes, setMinutes] = useState('')
    const handleMinutesChange = (event) => {
        setMinutes(Number(event.target.value))
    }

    const formatMinutes = (hoursEqualZero) => {
        if (hoursEqualZero && Number(minutes) === 0) {
            setMinutes('')
        } else if (!hoursEqualZero && Number(minutes) === 0) {
            setMinutes('00')
        } else {
            setMinutes(minutes.toString().padStart(2, '0'))
        }
    }

    const handleEditorChange = (value) => {
        setSessionContent(value)
    }

    const handleTitleChange = (event) => {
        setSessionTitle(event.target.value)
    }

    if (session === -1) return (
        <div style={styles.noSession}>
            <p>Choisissez une session</p>
        </div>
    )


    return (
        <div style={styles.container} data-color-mode={theme.palette.mode}>
            <div style={styles.sessionInformations}>
                <TextField
                    style={styles.title}
                    id="title"
                    value={sessionTitle}
                    onChange={handleTitleChange}
                    placeholder="Titre de la session"
                    slotProps={{
                        htmlInput: {
                            style: {
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                padding: '0.25rem 0.5rem',
                            }
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                />
                {/*<h1>{session.title}</h1>*/}
                <div style={styles.playtime}>
                    <PlaytimeSetter
                        hours={hours}
                        setHours={handleHoursChange}
                        formatHours={formatHours}
                        minutes={minutes}
                        setMinutes={handleMinutesChange}
                        formatMinutes={formatMinutes}
                        timeCalculationMethod={-1}
                    />
                </div>
            </div>

            <MDEditor
                style={styles.editor}
                value={sessionContent}
                onChange={handleEditorChange}
                commands={[]}
                visibleDragbar={false}
                toolbarBottom
                preview="live"
                height={'100%'}
                autoFocus
                textareaProps={{
                    placeholder: 'Informations de la session',
                }}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
            />
        </div>
    )
}

const getStyles = (theme, collapseButtonSize) => ({
    noSession: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        padding: '1.5rem 0',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    sessionInformations: {
        display: 'flex',
        maxWidth: '100%',
        flexDirection: 'row',
        height: `${2 * collapseButtonSize + 2}rem`,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `1rem ${collapseButtonSize + 1}rem`
    },
    editor: {
        borderRadius: '0',
        width: '100%',
    },
})

export default SessionEditor