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

  const addItem = (e) => {
    e.preventDefault();

    // grab checked radio status value
    const itemStatus = document.querySelector('input[name="status"]:checked').value;

    const newTask = {
      "task": newItem,
      "status": itemStatus
    };

    console.log('new item: ', newTask);

    axios.post('http://localhost:3001/tasks', newTask).then(response => {
      setItems(items.concat(response.data));
      console.log('items list: ', items); // will not display new item; behind by one index
    });
  };

  const handleChangeItemName = (e) => {
    console.log(e.target.value);
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
              <li key={item.task}>{item.task} - {item.status}</li>
            )}
          </ul>
        </div>
        <div style={styleListColumns}>
          <h4 style={centerText}>Tomorrow</h4>
          <ul>
            {items.filter(item => item.status === 'Tomorrow').map(item =>
              <li key={item.task}>{item.task} - {item.status}</li>
            )}
          </ul>
        </div>
        <div style={styleListColumns}>
          <h4 style={centerText}>Soon</h4>
          <ul>
            {items.filter(item => item.status === 'Soon').map(item =>
              <li key={item.task}>{item.task} - {item.status}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
};

export default App;