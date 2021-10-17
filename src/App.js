import { useState, useEffect } from 'react';
import axios from 'axios';

//#region styling
const centerText = {
  textAlign: 'center'
};

const styleForm = {
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: 'rgb(150,150,200)',
  padding: 10
};

const styleListsContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 5
};

const styleListColumns = {
  border: '1px solid black',
  // flexGrow: 1
  width: '33.3%' // total width is accounted after 'gap'
};

//#endregion


const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // add item/task to server and client
  const addItem = (e) => {
    e.preventDefault();

    // grab checked radio status value (Today, Tomorrow, Soon)
    const itemStatus = document.querySelector('input[name="status"]:checked').value;

    const newTask = {
      "task": newItem,
      "status": itemStatus
    };

    // console.log('new item: ', newTask);

    // add new item to server, then
    axios.post('http://localhost:3001/tasks', newTask).then(response => {
      // add new item (response.data) to items arr and update state
      setItems(items.concat(response.data));
      // console.log('items list: ', items); // new item will display on page, but not console log; behind by one index bc process is asynchronous

      // empty input field of task
      setNewItem('');
    });

    // console.log('items list: ', items); // new item will display on page, but not console log; behind by one index bc process is asynchronous
  };

  // delete selected task from server and client
  const deleteTask = (id) => {
    // find matching id, then return item/task
    const taskToDelete = items.find(item => item.id === id);
    // console.log('task to delete: ', taskToDelete);

    // delete from server, then
    axios.delete(`http://localhost:3001/tasks/${taskToDelete.id}`).then(() => {
      // return arr of items/tasks that dont match the id of the deleted task
      const updatedList = items.filter(item => item.id !== taskToDelete.id);
      // console.log('tasks after server delete: ', updatedList);

      // rerender client with updated state of tasks
      setItems(updatedList);
      // console.log('tasks after client delete: ', items);  // console will not log bc setItems is asynchronous; but client will update
    });

    // console.log('tasks after client delete: ', items);  // console will log update bc axios promise is asynchronous; client will update
  };

  // grab realtime state of task desc input field
  const handleChangeItemName = (e) => {
    // console.log(e.target.value);
    setNewItem(e.target.value);
  };

  // initial render of component will display loaded saved items
  useEffect(() => {
    // setItems(allItems);

    axios.get('http://localhost:3001/tasks').then(response => {
      console.log('GET: ', response.data);
      setItems(response.data);
    });
  }, []);

  return (
    <div>
      <h2 style={centerText}>ToDo Lists</h2>
      <form style={styleForm} onSubmit={addItem}>
        <div>
          <label>Add Item</label>&nbsp;
          <input value={newItem} onChange={handleChangeItemName} />&nbsp;
        </div>
        <div>
          <input type='radio' name="status" value='Today' id='today' defaultChecked />
          <label htmlFor='today'>Today</label>&nbsp;&nbsp;
          <input type='radio' name="status" value='Tomorrow' id='tomorrow' />
          <label htmlFor='today'>Tomorrow</label>&nbsp;&nbsp;
          <input type='radio' name="status" value='Soon' id='soon' />
          <label htmlFor='today'>Soon</label>&nbsp;&nbsp;
        </div>
        <button type='submit'>add</button>
      </form>

      <div style={styleListsContainer}>
        <div style={styleListColumns}>
          <h4 style={centerText}>Today</h4>
          <ul>
            {items.filter(item => item.status === "Today").map(item =>
              <li key={item.task}>{item.task} - {item.status} --- <button onClick={() => deleteTask(item.id)}>Delete</button></li>
            )}
          </ul>
        </div>
        <div style={styleListColumns}>
          <h4 style={centerText}>Tomorrow</h4>
          <ul>
            {items.filter(item => item.status === 'Tomorrow').map(item =>
              <li key={item.task}>{item.task} - {item.status} --- <button onClick={() => deleteTask(item.id)}>Delete</button></li>
            )}
          </ul>
        </div>
        <div style={styleListColumns}>
          <h4 style={centerText}>Soon</h4>
          <ul>
            {items.filter(item => item.status === 'Soon').map(item =>
              <li key={item.task}>{item.task} - {item.status} --- <button onClick={() => deleteTask(item.id)}>Delete</button></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
};

export default App;