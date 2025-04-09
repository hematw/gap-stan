import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

let newSocket = io("http://localhost:3000");

function App() {
  const [socket, setSocket] = useState(null);

  const sendMessage = () => {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }
    console.log("Sending message");
    socket.emit("message", "Hello World!");
  };

  useEffect(() => {
    if (!newSocket) {
      return;
    }

    newSocket.on('connect', () => {
      console.log('Connected to server as', newSocket.id);
      newSocket.emit('userOnline', newSocket.id); // Emit userId to mark user online
    });

    newSocket.on("message", (data) => {
      console.log(data);
    });
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
      newSocket = null;
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-red-400 text-5xl">Hello World!</h1>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
