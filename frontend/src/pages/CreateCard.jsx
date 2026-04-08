import React, { useState } from "react";
import API from "../api";

export default function CreateCard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const create = async () => {
    await API.post("/cards", { name, phone });
    alert("Created!");
  };

  return (
    <div>
      <h2>Create Card</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Phone" onChange={e => setPhone(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}
