import { GraphQLScalarType } from "graphql";
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({
        authorId: context.uid,
      }).sort({
        updatedAt: "desc",
      });
      console.log({ folders, context });
      return folders;
    },
    folder: async (parent, args) => {
      const folderId = args.folderId;
      console.log({ folderId });
      const foundFolder = await FolderModel.findById(folderId);
      return foundFolder;
    },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findById(noteId);
      return note;
    },
  },
  Folder: {
    author: async (parent, args) => {
      const authorId = parent.authorId;
      const author = await AuthorModel.findOne({
        uid: authorId,
      });
      return author;
    },

    notes: async (parent, args) => {
      console.log({ parent });
      const notes = await NoteModel.find({
        folderId: parent.id,
      }).sort({
        updatedAt: "desc",
      });
      console.log({ notes });
      return notes;
    },
  },
  Mutation: {
    addNote: async (parent, args) => {
      const newNote = new NoteModel(args);
      await newNote.save();
      return newNote;
    },
    updateNote: async (parent, args) => {
      const noteId = args.id;
      const note = await NoteModel.findByIdAndUpdate(noteId, args);
      return note;
    },
    deleteNote: async (parent, args) => {
      const note = await NoteModel.findByIdAndDelete(args.id);
      return note;
    },
    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context.uid });
      console.log({ newFolder });
      await newFolder.save();
      return newFolder;
    },
    renameFolder: async (_, { id, name }) => {
      const folder = await FolderModel.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      return folder;
    },
    deleteFolder: async (_, { id }) => {
      await NoteModel.deleteMany({ folderId: id }); // xoá ghi chú liên quan
      const folder = await FolderModel.findByIdAndDelete(id);
      return folder;
    },

    register: async (parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args.uid });

      if (!foundUser) {
        const newUser = new AuthorModel(args);
        await newUser.save();
        return newUser;
      }

      return foundUser;
    },
  },
};
