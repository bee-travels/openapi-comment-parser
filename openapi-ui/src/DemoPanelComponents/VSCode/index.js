import React, { useState } from 'react';
import Editor, { monaco } from '@monaco-editor/react';

const BRIGHT = 'f5f6f7';
const DIM = '7f7f7f';
const BLUE = 'a4cdfe';
const GREEN = '85d996';
const ORANGE = 'f8b886';

const BACKGROUND = '#18191a';
const SELECT = '#515151';

monaco
  .init()
  .then((monaco) => {
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark',
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
    console.error('An error occurred during initialization of Monaco: ', error)
  );

function VSCode({ value, language, onChange }) {
  const [focused, setFocused] = useState(false);

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
