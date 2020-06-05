import React, { useState } from 'react';
import Editor, { monaco } from '@monaco-editor/react';

monaco
  .init()
  .then((monaco) => {
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: '', foreground: 'f5f6f7' },
        { token: 'string.key.json', foreground: 'f5f6f7' },
        { token: 'string.value.json', foreground: '85d996' },
        { token: 'number', foreground: 'a4cdfe' },
        { token: 'keyword.json', foreground: 'a4cdfe' },
        { token: 'delimiter', foreground: '7f7f7f' },
        { token: 'tag.xml', foreground: '7f7f7f' },
        { token: 'metatag.xml', foreground: '7f7f7f' },
        { token: 'attribute.name.xml', foreground: 'f5f6f7' },
        { token: 'attribute.value.xml', foreground: '85d996' },
      ],
      colors: {
        'editor.background': '#18191a',
        'editor.lineHighlightBackground': '#18191a',
        'editorBracketMatch.background': '#18191a',
        'editorBracketMatch.border': '#18191a',
        'editor.selectionBackground': '#515151',
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
