export default {
    author: [
        {
            id: "1",
            name: "Nguyễn Văn A"
        },
        {
            id: "2",
            name: "Trần Thị B"
        },
        {
            id: "3",
            name: "Lê Văn C"
        }
    ],
    folders: [
        {
            id: "1",
            name: "Work",
            createdAt: new Date().toISOString(),
            authorId: "1"
        },
        {
            id: "2",
            name: "Study",
            createdAt: new Date().toISOString(),
            authorId: "2"
        },
        {
            id: "3",
            name: "New Year Holiday",
            createdAt: new Date().toISOString(),
            authorId: "3"
        }
    ],

    notes: [
        {
            id: "1",
            content: "This is a new note",
            folderId: "1",
            createdAt: new Date().toISOString(),
            authorId: "1"
        },
        {
            id: "2",
            content: "This is a in Study folder hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ abcdefgd  ",
            folderId: "2",
            createdAt: new Date().toISOString(),
            authorId: "2"
        },
        {
            id: "3",
            content: "This is a for New Year Holiday",
            folderId: "3",
            createdAt: new Date().toISOString(),
            authorId: "3"
        }
    ]
}