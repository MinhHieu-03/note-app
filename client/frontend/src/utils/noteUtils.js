import { graphQLRequest } from "./request";
import { redirect } from "react-router-dom";

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
    folder(folderId: $folderId) {
      id
      name
      notes {
        id
        content
        updatedAt
      }
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: {
      folderId,
    },
  });
  return data;
};

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Note($noteId: String) {
    note(noteId: $noteId) {
      content
      id
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: {
      noteId,
    },
  });
  return data;
};

export const addNewNote = async ({ params, request }) => {
  const newNote = await request.formData();
  const formDataObj = {};
  newNote.forEach((value, key) => (formDataObj[key] = value));

  console.log({ newNote, formDataObj });
  const query = `mutation Mutation($content: String!, $folderId: ID!) {
    addNote(content: $content, folderId: $folderId) {
      id
      content
    }
  }`;

  const { addNote } = await graphQLRequest({
    query,
    variables: formDataObj,
  });

  console.log({ addNote });

  return addNote;
};


export const noteAction = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    // Lấy thẳng từ params
    const { noteId, folderId } = params;

    // Xoá note
    await graphQLRequest({
      query: `
        mutation ($id: ID!) {
          deleteNote(id: $id) { id }
        }
      `,
      variables: { id: noteId },
    });

    // Chuyển về danh sách folder
    return redirect(`/folders/${folderId}`);
  }

  // ✏️ Nếu không phải delete → update
  const formDataObj = {};
  formData.forEach((value, key) => (formDataObj[key] = value));

  const updateQuery = `
    mutation UpdateNote($id: String!, $content: String!) {
      updateNote(id: $id, content: $content) {
        id
        content
      }
    }
  `;

  const { updateNote } = await graphQLRequest({
    query: updateQuery,
    variables: formDataObj,
  });

  return updateNote;
};
