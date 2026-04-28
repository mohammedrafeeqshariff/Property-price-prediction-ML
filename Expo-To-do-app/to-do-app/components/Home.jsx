import { useState } from "react"; // Importing useState hook from React

import styles from "./styles"; // Importing styles from external stylesheet
import {
  View,         // Importing View component for layout
  Text,       // Importing Text component for displaying text
  TextInput,    // Importing TextInput component for user input
  TouchableOpacity, // Importing TouchableOpacity for button-like behavior
  FlatList,    // Importing FlatList for rendering lists
  StyleSheet,   // Importing StyleSheet for styling components
} from "react-native"; // Importing necessary components from React Native

// Main App component
const Home = () => {
  // State to store the current task input
  const [task, setTask] = useState("");
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State to track the index of the task being edited
  const [editIndex, setEditIndex] = useState(-1);

  // Function to handle adding or updating a task
  const handleAddTask = () => {
    if (task) {
      if (editIndex !== -1) {
        // If editIndex is not -1, update the existing task
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = task; // Update the task at the specified index
        setTasks(updatedTasks); // Update the tasks state
        setEditIndex(-1); // Reset editIndex
      } else {
        // If editIndex is -1, add a new task
        setTasks([...tasks, task]); // Add the new task to the tasks array
      }
      setTask(""); // Clear the input field
    }
  };

  // Function to handle editing a task
  const handleEditTask = (index) => {
    const taskToEdit = tasks[index]; // Get the task to be edited
    setTask(taskToEdit); // Set the task in the input field
    setEditIndex(index); // Set the index of the task being edited
  };

  // Function to handle deleting a task
  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1); // Remove the task at the specified index
    setTasks(updatedTasks); // Update the tasks state
  };

  // Function to render each task item
  const renderItem = ({ item, index }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{String(item)}</Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main UI rendering
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My todo</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task" // Placeholder text for the input field
        value={task} // Bind input value to task state
        onChangeText={(text) => setTask(text)} // Update task state on text change
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask} // Call handleAddTask on button press
      >
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task" : "Add Task"} 
        </Text>
      </TouchableOpacity>

      <FlatList
        data={tasks} // Pass tasks array as data
        renderItem={renderItem} // Render each task using renderItem
        keyExtractor={(_item, index) => index.toString()} // Unique key for each item
      />
    </View>
  );
};


export default Home;