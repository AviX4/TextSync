import React, { useState , useEffect } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css' ;
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
const Editor = () => {
    const [value, setValue] = useState('');
    const [socket,setSocket]=  useState();
    const {id : documentId} = useParams();
    const [edFlag, setEdFlag] = useState(true);
    useEffect(()=>{
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    },[])

    // useEffect(()=>{
    //     if(socket){
    //         socket.emit('document-route',documentId);
    //     }
    // },[socket,documentId])
    useEffect(()=>{
        if(socket){
            socket.on('receive-change',setValue);
            socket.emit('document-route',documentId);
            socket.once("load-document",val =>{
                setValue(val);
                setEdFlag(false);
            });
        } 
    },[socket,documentId])
    useEffect(()=>{
        if(socket){
            const interval = setInterval(()=>{
                socket.emit("save-document",value);
            },2000);
            return()=>{
                clearInterval(interval);
            }
        }
    },[socket,value])
    const onTextChange = (e) => {
        socket.emit("send-change",e);
        setValue(e);
    }
    
    return <> <ReactQuill 
                className='container' 
                theme="snow" 
                value={value} 
                readOnly={edFlag}
                onChange={(e)=> onTextChange(e)} 
                
            />
        </>
}

export default Editor;