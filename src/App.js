import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(name, image) {
    const newFriend = {
      id: crypto.randomUUID(),
      name,
      image,
      balance: 0,
    };
    setFriends((friends) => [...friends, newFriend]);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend(friend);
  }

  function handleSplitNewBill(finalBalance) {
    setFriends((friends) =>
      friends.map((friend) => {
        if (friend.id === selectedFriend.id) {
          friend.balance = friend.balance + finalBalance;
          return friend;
        }
        return friend;
      })
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <Sidebar>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
            onHandleSelectFriend={handleSelectFriend}
          />
        ))}
        <AddFriendForm onAddFriend={handleAddFriend} />
      </Sidebar>
      {selectedFriend && (
        <SplitBillForm
          friend={selectedFriend}
          onHandleSplitNewBill={handleSplitNewBill}
        />
      )}
    </div>
  );
}

function Sidebar({ children }) {
  return (
    <div className="sidebar">
      <ul>{children}</ul>
    </div>
  );
}

function Friend({ friend, onHandleSelectFriend, selectedFriend }) {
  let statusMessage;

  if (friend.balance === 0)
    statusMessage = <p>You and {friend.name} are even</p>;
  if (friend.balance > 0)
    statusMessage = (
      <p className="green">
        {friend.name} owes you {friend.balance}€
      </p>
    );
  if (friend.balance < 0)
    statusMessage = (
      <p className="red">
        You owe {friend.name} {Math.abs(friend.balance)}€
      </p>
    );

  return (
    <li>
      <img src={friend.image} alt="friend" />
      <h3>{friend.name}</h3>
      {statusMessage}
      {selectedFriend === friend ? (
        <button className="button" onClick={() => onHandleSelectFriend(null)}>
          Close
        </button>
      ) : (
        <button className="button" onClick={() => onHandleSelectFriend(friend)}>
          Select
        </button>
      )}
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=118836");

  return (
    <>
      {isOpen ? (
        <>
          <form
            className="form-add-friend"
            onSubmit={(event) => {
              event.preventDefault();
              onAddFriend(name, image);
              setIsOpen(!isOpen);
            }}
          >
            <label>👫 Name </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            <label>🌄 Image</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></input>
            <button className="button">Add</button>
          </form>
          <button
            className="button"
            type="submit"
            onClick={() => setIsOpen(!isOpen)}
          >
            Close
          </button>
        </>
      ) : (
        <button className="button" onClick={() => setIsOpen(!isOpen)}>
          Add friend
        </button>
      )}
    </>
  );
}

function SplitBillForm({ friend, onHandleSplitNewBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [payer, setPayer] = useState("you");

  let friendsExpense = bill - yourExpense;
  let finalBalance = payer === "you" ? friendsExpense : -friendsExpense;

  return (
    <form
      className="form-split-bill"
      onSubmit={(event) => {
        event.preventDefault();
        onHandleSplitNewBill(finalBalance);
      }}
    >
      <h2>Split a bill with {friend.name}</h2>
      <label>1 Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      ></input>
      <label>2 Your expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(e.target.value)}
      ></input>
      <label>3 {friend.name}'s expense</label>
      <input type="number" value={friendsExpense} disabled={true}></input>
      <label>4 Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value={"you"}>You</option>
        <option value={"friend"}>{friend.name}</option>
      </select>
      <button className="button" type="submit">
        Split
      </button>
    </form>
  );
}
