const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Document = require('./document');

mongoose.connect('mongodb://127.0.0.1:27017/google-docs-clone')
  .then(() => console.log('Connected to db!'));

const io = new Server(3001,{
    cors: {
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

io.on("connection",socket=>{
    
    socket.on("document-route",async docId =>{
        const doc = await documentHandler(docId);
        socket.join(docId);
        socket.emit('load-document',doc.data);

        socket.on("send-change",value=>{
            socket.broadcast.to(docId).emit("receive-change",value);
        });
        socket.on("save-document",async data =>{
            await Document.findByIdAndUpdate(docId,{ data });
        })
    })
   
});

async function documentHandler(id) {
    if(id===null) return ;
    const document = await Document.findById(id);
    if(document) {
        return document;
    }
    return await Document.create({_id:id, data:""})
}
