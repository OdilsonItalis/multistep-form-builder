import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { exampleTheme } from './ExampleTheme';
import ToolbarPlugin from './ToolbarPlugin';

function Placeholder() {
  return <div className="editor-placeholder">Type here...</div>;
}

function onChange(editorState: any, setInstructions: any) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const jsonString = JSON.stringify(editorState);
    console.log(jsonString);
    setInstructions(jsonString);
  });
}

export default function SimpleEditor({ instructions, setInstructions }: any) {
  const editorConfig = {
    // The editor theme
    namespace: 'lexical-editor',
    theme: exampleTheme,
    editorState: instructions,
    // Handling of errors during update
    onError(error: any) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <OnChangePlugin
        onChange={(editorState) => onChange(editorState, setInstructions)}
      />
      <div className="editor-container">
        {/* <ToolbarPlugin /> */}
        <div className="editor-inner">
          <RichTextPlugin
            ErrorBoundary={Placeholder}
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
