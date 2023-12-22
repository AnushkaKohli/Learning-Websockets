import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { produce, enableMapSet } from 'immer';

enableMapSet();

function App() {
  const [mySocket, setMySocket] = useState(null);
  const [roomIdToMessageMapping, setRoomIdToMessageMapping] = useState({});
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [roomIdToTypingUsernameMapping, setRoomIdToTypingUsernameMapping] = useState({}); 
  const [roomIdUsernameToTypingTimerIndicatorMapping, setRoomIdUsernameToTypingTimerIndicatorMapping] = useState({}); 
  const isPromptAlreadyShown = useRef(false);

  useEffect(() => {
    if(isPromptAlreadyShown.current === false) {
      isPromptAlreadyShown.current = true;
      while (true){
        const validUsername = prompt("What is your name?");
        if(validUsername?.trim()){
          setUsername(validUsername);
          break;
        }
      }
    }
    // const socket = io('https://slack-app-server.vercel.app/', {
    //   transports: ['websocket']
    // });
    const socket = io('ws://localhost:3001', {
      transports: ['websocket']
    });

    setMySocket(socket);

    socket.on('roomMessage', (data) => {
      setRoomIdToMessageMapping(produce(state => {
        //This line checks if there's already an array of messages for the given roomId. If not (state[roomId] is undefined), it initializes an empty array. This ensures that there's always an array to push new messages into.
        state[data.roomId] = state[data.roomId] || [];

        //This line checks if the message already exists in the state. If it does, it doesn't add it again. This is to prevent duplicate messages from being added to the state. It is called ***DEDUPING*** done at the client side.
        if(state[data.roomId].some(obj => obj.messageId === data.messageId)){
            //This message already exists in the state. Don't add it again.
        }
        else{
          state[data.roomId].push(data);
        }
      }))
    });

    socket.on('userTyping', (data) => {
      const { roomId, username } = data;

      setRoomIdToTypingUsernameMapping(
        produce(state => {
          state[roomId] = state[roomId] || new Set();
          state[roomId].add(username);
        })
      )

      const timeoutId = setTimeout(() => {
        setRoomIdToTypingUsernameMapping(
          produce(state => {
            state[roomId] = state[roomId] || new Set();
            state[roomId].delete(username);
          })
        )
      }, 5000);

      setRoomIdUsernameToTypingTimerIndicatorMapping(
        produce(state => {
          // Clear the previous timer if it exists
          clearTimeout(state[roomId + '-' + username]);
          state[roomId + '-' + username] = timeoutId;
        })
      )
    })

    return () => {
      socket.close();
    }
  }, []);

  function joinRoomExclusively(roomId){
    if (mySocket === null) return null; 
    setActiveRoomId(roomId);
    mySocket.emit("joinRoomExclusively", roomId);
  }

  function sendMessage() {
    if(mySocket === null) return null;
    if(typeof activeRoomId !== 'number') {
      alert("Please join a room first before sending a message");
      return;
    }
    mySocket.emit('sendMessage', {roomId: activeRoomId, message, username})
  }

  function sendTypingIndicator(){
    if(mySocket === null) return null;
    if(typeof activeRoomId !== 'number') {
      alert("Please join a room first before sending a message");
      return;
    }
    mySocket.emit('sendTypingIndicator', {roomId: activeRoomId, username})
  }

  const messagesOfRoom = roomIdToMessageMapping[activeRoomId] || [];
  const typingUsersInTheRoom = roomIdToTypingUsernameMapping[activeRoomId] != null ? [...roomIdToTypingUsernameMapping[activeRoomId]] : [];

  return (
    <>
      <div className="grid grid-cols-12 divide-x divide-gray-300">
        <aside className="col-span-4 h-screen overflow-y-auto">
          { 
            Array(50).fill(0).map((_, i) => {
              return (
                <div 
                  className= {"p-2 " + (activeRoomId === i+1? 'bg-black text-white' : 'hover:bg-gray-100 cursor-pointer' )} 
                  key= {i}
                  onClick={() => {
                  joinRoomExclusively(i+1);
                }}
                >
                  Room #{i + 1}
                </div>
            )
            })
          }
        </aside>

        <main className="col-span-8 px-8 h-screen overflow-y-auto flex flex-col">
        <p>Your username: {username}</p>
        {typingUsersInTheRoom.length > 0 ? <p>Users typing: {(typingUsersInTheRoom).join(', ')}</p> : null}
        {
          messagesOfRoom.map(({ message, username }, index) => {
            return (
              <div key={index} className='w-full p-4'>
                <b>Sent by {username} </b>
                <p>{message}</p>
              </div>
            )
          })
        }
        <div className="flex-grow"></div>
        <div className="mb-8 flex justify-center items-center gap-2">
        <textarea id="about" name="about" rows="2" class="block w-full rounded-md mb-8 border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 flex-grow"
        value={message}
        onChange={(e) => {
          sendTypingIndicator()
          setMessage(e.target.value);
        }}
        ></textarea>
        <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-shrink-0"
                  onClick={sendMessage}
                >
                Send Message
        </button>
        </div>
        </main>
      </div>
    </>
  )
}

export default App
