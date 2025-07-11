export const typeDefs = `#graphql
scalar Date

  type Folder {
    id: String!,
    name: String,
    createdAt: String,
    author: Author,
    notes: [Note]
  }

  type Note {
    id: String!,
    content: String,
    createdAt: Date, 
    updatedAt: Date,  
    folderId: String! 
  }

  type Author {
    uid: String!,
    name: String!
  }

  type Query {
    folders: [Folder],
    folder(folderId: String!): Folder,
    note(noteId: String): Note,
  }

  type Mutation {
    addFolder(name: String!): Folder,
    renameFolder(id: ID!, name: String!): Folder,
    deleteFolder(id: ID!): Folder,
    addNote(content: String!, folderId: ID!): Note,
    updateNote(id: String!, content: String!): Note,
    deleteNote(id: ID!): Note,
    register(uid: String!, name: String!): Author
  }

`;
