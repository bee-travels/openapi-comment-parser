import React, { useState, useEffect } from 'react';
import Editor, { monaco } from '@monaco-editor/react';
import { useTheme } from 'theme';

function initMonaco(theme) {
  const BRIGHT = theme === 'dark' ? 'f5f6f7' : '1c1e21';
  const DIM = theme === 'dark' ? '7f7f7f' : 'aaaaaa';
  // aaaaaa
  // 979899
  const BLUE = theme === 'dark' ? 'a4cdfe' : '2688fd';
  const GREEN = theme === 'dark' ? '85d996' : '35aa4c';
  const ORANGE = theme === 'dark' ? 'f8b886' : 'f1710e';

  const BACKGROUND = theme === 'dark' ? '#18191a' : '#ffffff';
  const SELECT = theme === 'dark' ? '#515151' : '#ebedef';
  // e2e4e6
  // ebf2f4
  // e0e0e0

  monaco
    .init()
    .then((monaco) => {
      monaco.editor.defineTheme('myCustomTheme', {
        base: theme === 'dark' ? 'vs-dark' : 'vs',
        inherit: false,
        rules: [
          { token: '', foreground: BRIGHT },
          { token: 'string.key.json', foreground: BRIGHT },
          { token: 'string.value.json', foreground: GREEN },
          { token: 'number', foreground: BLUE },
          { token: 'keyword.json', foreground: BLUE },
          { token: 'delimiter', foreground: DIM },
          { token: 'tag.xml', foreground: DIM },
          { token: 'metatag.xml', foreground: DIM },
          { token: 'attribute.name.xml', foreground: BRIGHT },
          { token: 'attribute.value.xml', foreground: GREEN },
          { token: 'metatag.xml', foreground: BLUE },
          { token: 'tag.xml', foreground: BLUE },
        ],
        colors: {
          'editor.background': BACKGROUND,
          'editor.lineHighlightBackground': BACKGROUND,
          'editorBracketMatch.background': BACKGROUND,
          'editorBracketMatch.border': BACKGROUND,
          'editor.selectionBackground': SELECT,
        },
      });
    })
    .catch((error) =>
      console.error(
        'An error occurred during initialization of Monaco: ',
        error
      )
    );
}

function VSCode({ value, language, onChange }) {
  const [focused, setFocused] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    initMonaco(theme);
  }, [theme]);

  return (
    <div
      className={focused ? 'nick-monaco-padding-focus' : 'nick-monaco-padding'}
    >
      <Editor
        value={value}
        language={language}
        theme="myCustomTheme"
        options={{
          contentLeft: 0,
          lineNumbers: 'off',
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 3,
          readOnly: false,
          minimap: { enabled: false },
          fontFamily:
            'SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
          fontSize: '14.4',
          overviewRulerLanes: 0,
          folding: false,
          lineDecorationsWidth: 0,
          contextmenu: false,
          scrollbar: {
            horizontal: 'hidden',
          },
        }}
        editorDidMount={(_valueGetter, editor) => {
          editor.onDidFocusEditorText(() => {
            setFocused(true);
          });
          editor.onDidBlurEditorText(() => {
            setFocused(false);
          });
          editor.onDidChangeModelDecorations(() => {
            updateEditorHeight(); // typing
            requestAnimationFrame(updateEditorHeight); // folding
            onChange(editor.getValue());
          });

          let prevHeight = 0;

          const updateEditorHeight = () => {
            const editorElement = editor.getDomNode();

            if (!editorElement) {
              return;
            }

            const lineHeight = 22;
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const height =
              editor.getTopForLineNumber(lineCount + 1) + lineHeight;

            const clippedHeight = Math.min(height, 500);

            if (prevHeight !== clippedHeight) {
              prevHeight = clippedHeight;
              editorElement.style.height = `${clippedHeight}px`;
              editor.layout();
            }
          };
        }}
      />
    </div>
  );
}

export default VSCode;
