import { useRef, useState } from "react";
import "./code-editor.css";
import "./131 syntax.css";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeshift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      boderRadius: '50px',
      bottom: '5px',
      fontSize: '10px'
    },
    margin: {
      margin: theme.spacing(1),
      boderRadius: '50px',
      color: 'white',
      bottom: '5px',
      fontSize: '10px'
    },
  }),
);

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(); // to get the code value from the editor and format it through prettier and again set the code value to the editor

  const [mode, setMode] = useState(true);

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // this function is used to get the current value in the editor...
    // console.log(getValue())
    editorRef.current = monacoEditor; // we can also make the reference to some value also and can use it anywhere in the app....
    monacoEditor.onDidChangeModelContent(() => {
      // we get the console.log() on every change made on the editor..
      onChange(getValue());
    });
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeshift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    //! get the current value from the editor
    // console.log(editorRef.current);
    const unformatted = editorRef.current.getModel().getValue();

    //! format the value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    //! set the formated value again in the editor
    editorRef.current.setValue(formatted);
  };
  const classes = useStyles();

  return (
    <div className="editor-wrapper">
      <div className="button-class">

        <Button 
          size="small" 
          disableRipple
          disableFocusRipple
          className={mode ? classes.margin : classes.root}
          onClick={onFormatClick}
        >
          Format Code
        </Button>
        <Button 
          size="medium" 
          disableRipple
          disableFocusRipple
          className={mode ? classes.margin : classes.root}
          onClick={() => setMode(!mode)}
          startIcon= { mode ?  <Brightness7Icon /> : <Brightness4Icon />}
        >
          {/* {mode ? "Light Mode" : "Dark Mode"} */}
        </Button>

        {/* <button
          className="button button-format is-primary is-small"
          onClick={onFormatClick}
        >
          Format Code
        </button>
        <button 
          className="button button-format is-primary is-small"
          onClick={() => setMode(!mode)}
          >
            {mode ? "Light Mode" : "Dark Mode"}
        </button> */}
      </div>
      

      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        options={{
          wordWrap: "on",
          cursorBlinking: "expand",
          fontLigatures: true,
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily: "cascadia code",
        }}
        language="javascript"
        theme={mode ? "vs-dark" : "light"}
        height="100%"
      />
    </div>
  );
};

export default CodeEditor;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useToggle(): [any, any] {
  throw new Error("Function not implemented.");
}
