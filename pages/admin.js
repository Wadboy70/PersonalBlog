import InputWithLabel from "components/UI/InputWithLabel";
import { useAuth } from "lib/AuthUserContext";
import {
  COLLECTION_NAMES,
  getSingleFirestoreDoc,
  mergeFirestoreDoc,
} from "lib/firestore";
import { useRouter } from "next/router";
import { ContentState, EditorState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { useEffect, useState } from "react";
import styles from "components/styles/admin.module.scss";
import dynamic from "next/dynamic";
import useForm from "lib/useForm";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const redeploy = async (password = "", setMessage = () => {}) => {
  const credentials = Buffer.from(password).toString("base64");
  const auth = { Authorization: `Basic ${credentials}` };
  const deployInfo = await fetch("/api/blog", { headers: auth });
  if (deployInfo.status != 200) {
    setMessage("Not Redeployed");
  }
};

const Admin = ({ post }) => {
  const router = useRouter();
  const { signInWithGoogle, authUser, validUser } = useAuth();
  useEffect(() => {
    if (validUser === null) {
      router.push("/");
    }
  });

  const {
    date,
    tags,
    description,
    name,
    slug,
    thumbnailUrl,
    entry = "",
  } = JSON.parse(post);

  const defaultDate = date ? new Date(date.seconds * 1000) : new Date();
  const defaultMetadata = {
    name: name || "",
    slug: slug || "",
    date:
      defaultDate.getUTCFullYear() +
      "-" +
      (defaultDate.getUTCMonth() + 1 + "").padStart(2, "0") +
      "-" +
      (defaultDate.getDate() + "").padStart(2, "0"),
    description: description || "",
    thumbnailUrl: thumbnailUrl || "",
    tags: tags?.join(", ") || "",
  };
  const {
    message,
    setMessage,
    password,
    setPassword,
    metadata,
    setMetadata,
    editor,
    setEditor,
    resetForm,
  } = useForm(defaultMetadata, entry);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submit = confirm("Submit?");
    if (!submit) return;
    //could be a function
    if (
      !metadata.slug ||
      !metadata.name ||
      stateToHTML(editor.getCurrentContent()) === ""
    ) {
      alert("Finish the form!");
      return;
    }
    //check if this entry already exists
    const exists = await getSingleFirestoreDoc(
      COLLECTION_NAMES.JOURNALS,
      metadata.slug
    );
    if (exists?.error) {
      alert("Firebase error");
      return;
    }
    if (exists) {
      const overwrite = confirm(
        "this journal url name already exists! Want to overwrite this entry?"
      );
      if (!overwrite) return;
    }
    const dateArr = metadata.date.split("-");
    const date = new Date(
      `${dateArr[0]}-${dateArr[1]}-${String(Number(dateArr[2]) + 1).padStart(
        2,
        "0"
      )}`
    );
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
    await redeploy(password, setMessage);
    resetForm();
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

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;
  if (!slug) return { props: { post: "{}" } };

  const rawPost = await getSingleFirestoreDoc(COLLECTION_NAMES.JOURNALS, slug);

  if (!rawPost || rawPost.error) return { props: { post: "{}" } };

  const post = JSON.stringify(rawPost);
  return { props: { post } };
};
