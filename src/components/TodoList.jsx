  
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const url = "https://api-v2.elchocrud.pro/api/v1/6d14438b0017c5a72e0b7cebc18c1aed/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Get Todos
  const getTodos = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Post Todos
  const postTodos = async (e) => {
    e.preventDefault();
    const newData = {
      input,
    };
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newData)
      });
      setInput('');
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Todos
  const deleteTodos = async (id) =>{
    await fetch(`${url}/${id}`,{
      method: "DELETE"
    });
    getTodos();
  };

  // Toggle Completed
  const toggleCompleted = async (id, completed) => {
    const updatedData = { completed: !completed };
    try {
      await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Update Todos
  const updateTodos = async (id) => {
    const updatedData = {
      input: editingText
    };
    try {
      await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });
      setEditingId(null);
      setEditingText('');
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // UseEffect Todos
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Container>
      <form onSubmit={postTodos}>
        <Input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Add Task"
        />
        <Button type='submit'>Add</Button>
      </form>

      {todos.map((item) => (
        <TodoItem key={item._id}>
          {editingId === item._id ? (
            <div>
              <Input 
                type="text" 
                value={editingText} 
                onChange={(e) => setEditingText(e.target.value)} 
              />
              <Button onClick={() => updateTodos(item._id)}>Save</Button>
              <Button onClick={() => updateTodos(false)}>cancel</Button>
            </div>
          ) : (
            <div>
              <Task completed={item.completed}>
                {item.input}
              </Task>
              <ActionButton onClick={() => deleteTodos(item._id)}>Delete</ActionButton>
              <ActionButton onClick={() => toggleCompleted(item._id, item.completed)}>
                {item.completed ? "Uncompleted" : "Complete"}
              </ActionButton>
              <ActionButton onClick={() => {
                setEditingId(item._id);
                setEditingText(item.input);
              }}>Edit</ActionButton>
            </div>
          )}
        </TodoItem>
      ))}
    </Container>
  );
};

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
`;

const TodoItem = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

const Task = styled.h1`
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  margin-bottom: 5px;
  font-size: 18px;
`;

const ActionButton = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:nth-child(2) {
    background-color: #dc3545;
    color: #fff;
  }

  &:nth-child(3) {
    background-color: #007bff;
    color: #fff;
  }

  &:nth-child(4) {
    background-color: #ffc107;
    color: #212529;
  }
`;

export default TodoList;
