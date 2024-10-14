import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const userName = "jmofuture";
  const apiUrl = `https://playground.4geeks.com/todo/users/${userName}`;

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (response.status === 404) {
          createUser();
        } else if (!response.ok) {
          throw new Error("Error al obtener las tareas del usuario");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.todos)) {
          setTasks(data.todos);
        } else {
          console.error("La respuesta de la API:", data.todos);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const createUser = () => {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al crear el usuario");
        }
        console.log("Usuario creado correctamente");
      })
      .catch((error) => console.error("Error al crear el usuario:", error));
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTodo = { label: newTask, is_done: false };
      fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar la tarea");
          }
          return response.json();
        })
        .then((data) => {
          setTasks((prevTasks) => [...prevTasks, data]);
          setNewTask("");
        })
        .catch((error) => console.error("Error al agregar tarea:", error));
    }
  };

  const handleDeleteTask = (todoId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la tarea");
        }
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== todoId));
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  };

  const handleDeleteAllTasks = () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar todas las tareas?");
    if (confirmDelete) {
      Promise.all(tasks.map((task) =>
        fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
          method: "DELETE",
        })
      ))
      .then(() => {
        setTasks([]);
        console.log("Todas las tareas han sido eliminadas.");
      })
      .catch((error) => console.error("Error al eliminar todas las tareas:", error));
    }
  };

  const handleToggleTask = (todoId, currentStatus) => {
    const updatedStatus = { is_done: !currentStatus };
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify(updatedStatus),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la tarea");
        }
        setTasks((prevTasks) => 
          prevTasks.map((task) => 
            task.id === todoId ? { ...task, is_done: !currentStatus } : task
          )
        );
      })
      .catch((error) => console.error("Error al marcar la tarea:", error));
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Lista de Tareas</h1>
      <button className="btn btn-danger mb-3" onClick={handleDeleteAllTasks}>
        Eliminar todas las tareas
      </button>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddTask}>
          Agregar Tarea
        </button>
      </div>
      <ul className="list-group">
        {tasks.length === 0 ? (
          <li className="list-group-item">No hay tareas, añade una</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => handleToggleTask(task.id, task.is_done)}
              />
              <span>
                {task.label}
              </span>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
