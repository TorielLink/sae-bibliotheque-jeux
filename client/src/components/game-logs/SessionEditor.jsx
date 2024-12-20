import React, {useContext} from "react"
import MDEditor, {commands, EditorContext} from '@uiw/react-md-editor'
import rehypeSanitize from "rehype-sanitize";
import {useTheme} from "@mui/material/styles";

function SessionEditor({session, setSession, sessionContent, setSessionContent}) {
    const theme = useTheme();
    const styles = getStyles(theme);

    const handleEditorChange = (value) => {
        setSessionContent(value)
    }

    if (session === -1) return (
        <div style={styles.noSession}>
            <p>Choisissez une session</p>
        </div>
    )

    return (
        <div style={styles.container} data-color-mode="light">
            <div style={styles.sessionInformations}>
                <h1>{session.title}</h1>
                <p>{`${Math.floor(session.time_played / 60, 2)}h ${session.time_played % 60}min`}</p>
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

const getStyles = (theme) => ({
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
        flexDirection: 'row',
        height: '10rem',
        padding: '0 5rem',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    editor: {
        borderRadius: '0',
        // background: theme.palette.background.default,
        // color: theme.palette.input.primary,
        width: '100%',
    },
})

export default SessionEditor