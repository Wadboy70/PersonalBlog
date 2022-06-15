import InputWithLabel from "components/UI/InputWithLabel";
import { useAuth } from "lib/AuthUserContext";
import {
  COLLECTION_NAMES,
  getSingleFirestoreDoc,
  mergeFirestoreDoc,
} from "lib/firestore";
import { useRouter } from "next/router";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { useEffect, useState } from "react";
import styles from "components/styles/admin.module.scss";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const Admin = () => {
  const { signInWithGoogle, authUser, loading } = useAuth();

  const router = useRouter();
  const [validUser, setValidUser] = useState(false);
  const [password, setPassword] = useState("");
  const [editor, setEditor] = useState(EditorState.createEmpty());
  const [message, setMessage] = useState(null);
  const defaultMetadata = {
    name: "",
    slug: "",
    date:
      new Date().getUTCFullYear() +
      "-" +
      (new Date().getUTCMonth() + 1 + "").padStart(2, "0") +
      "-" +
      (new Date().getDate() + "").padStart(2, "0"),
    description: "",
    thumbnailUrl: "",
    tags: "",
  };
  const [metadata, setMetadata] = useState(defaultMetadata);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await getSingleFirestoreDoc(
        COLLECTION_NAMES.USERS,
        authUser.email
      );

      if (result && !result.error) {
        setValidUser(true);
        return;
      }
      router.push("/");
    };
    if (authUser) {
      checkAuth();
    }
  });

  const redeploy = async () => {
    const credentials = Buffer.from(password).toString("base64");
    const auth = { Authorization: `Basic ${credentials}` };
    const deployInfo = await fetch("/api/blog", { headers: auth });
    if (deployInfo.status != 200) {
      setMessage("Not Redeployed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !metadata.slug ||
      !metadata.name ||
      stateToHTML(editor.getCurrentContent()) === ""
    ) {
      alert("Finish the form!");
      return;
    }
    const exists = await getSingleFirestoreDoc(
      COLLECTION_NAMES.JOURNALS,
      metadata.slug
    );
    if (exists?.error) {
      alert("Firebase error");
      console.log(exists);
      return;
    }
    if (exists) {
      console.log(exists);
      const overwrite = confirm(
        "this journal url name already exists! Want to overwrite this entry?"
      );
      if (!overwrite) return;
    }
    console.log(stateToHTML(editor.getCurrentContent()));
    const dateArr = metadata.date.split("-");
    const date = new Date(
      `${dateArr[0]}-${dateArr[1]}-${String(Number(dateArr[2]) + 1).padStart(
        2,
        "0"
      )}`
    );
    console.log(date);
    mergeFirestoreDoc(
      {
        ...metadata,
        tags:
          metadata.tags
            ?.split(",")
            .map((val) => val.trim())
            .filter((val) => !!val.length) || [],
        entry: stateToHTML(editor.getCurrentContent()),
        date: date,
      },
      COLLECTION_NAMES.JOURNALS,
      metadata.slug
    );
    await redeploy();
    setEditor(EditorState.createEmpty());
    setMetadata(defaultMetadata);
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {!authUser && <button onClick={signInWithGoogle}>Sign In</button>}
      {validUser && (
        <form onSubmit={handleSubmit}>
          <InputWithLabel
            label="Name"
            type="text"
            value={metadata.name}
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
            id="articleName"
            placeholder="Name"
          />
          <InputWithLabel
            label="Slug"
            type="text"
            value={metadata.slug}
            onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
            id="articleSlug"
            placeholder="Slug"
          />
          <InputWithLabel
            label="Date"
            type="date"
            value={metadata.date}
            defaultValue={defaultMetadata.date}
            onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
            id="articleDate"
          />
          <InputWithLabel
            label="Description"
            type="text"
            value={metadata.description}
            onChange={(e) =>
              setMetadata({ ...metadata, description: e.target.value })
            }
            id="articleDescription"
            placeholder="Description"
          />
          <InputWithLabel
            label="Thumbnail URL"
            type="text"
            value={metadata.thumbnailUrl}
            onChange={(e) =>
              setMetadata({ ...metadata, thumbnailUrl: e.target.value })
            }
            id="articleThumbnail"
            placeholder="Thumbnail URL"
          />
          <InputWithLabel
            label="Tags"
            type="text"
            value={metadata.tags}
            onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
            id="articleTags"
            placeholder="Tags"
          />
          <InputWithLabel
            label="Admin Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="adminPassword"
            placeholder="Password"
          />
          <Editor
            editorState={editor}
            onEditorStateChange={(state) => setEditor(state)}
          />
          <button>Submit</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Admin;
