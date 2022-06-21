import { convertFromHTML, ContentState, EditorState } from "draft-js";
import { useState } from "react";

const useForm = (defaultState, entry) => {
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [metadata, setMetadata] = useState(defaultState);

  const resetForm = () => {
    setEditor(EditorState.createEmpty());
    setMetadata(defaultState);
  };

  if (typeof window === "undefined") {
    return {
      message,
      setMessage,
      password,
      setPassword,
      metadata,
      setMetadata,
      editor: null,
      setEditor: () => {},
      resetForm,
    };
  }

  const blocksFromHTML = convertFromHTML(entry);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );

  const [editor, setEditor] = useState(EditorState.createWithContent(state));

  return {
    message,
    setMessage,
    password,
    setPassword,
    metadata,
    setMetadata,
    editor,
    setEditor,
    resetForm,
  };
};

export default useForm;
