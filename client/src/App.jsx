import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { Check } from 'lucide-react'

function App() {
  const [user, setUser] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [addNewUser, setAddNewUser] = useState({
    name: '',
    age: '',
    city: ''
  });
  const [showSuccessForAdd, setshowSuccessForAdd] = useState(false);
  const [showSuccessForUpdate, setshowSuccessForUpdate] = useState(false);
  

  const getAllUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      setUser(response.data);
      setFilterUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const addNewRecord = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8000/users", addNewUser, {
        headers: { "Content-Type": "application/json" }
      });
  
      if (response && response.status === 201 && response.data) {  
        const updatedUsers = [...user, response.data];
        setUser(updatedUsers);
        setFilterUsers(updatedUsers);
        setIsOpen(false);
        setAddNewUser({ name: "", age: "", city: "" });
  
        // Show success message
        setshowSuccessForAdd(true);
  
        console.log("User added successfully:", response.data);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  
  const editRecord = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8000/users/${currentUserId}`, addNewUser, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response && response.status === 200 && response.data) {
        const updatedUsers = user.map((u) => (u.id === currentUserId ? response.data : u));
        setUser(updatedUsers);
        setFilterUsers(updatedUsers);
        setIsOpen(false);
        setIsEdit(false);
        setshowSuccessForUpdate(true);
        setAddNewUser({ name: "", age: "", city: "" });
        console.log("User updated successfully:", response.data);
      } else {
        console.error("Failed to update user:", response);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handelChange = (e) => {
    const { name, value } = e.target;
    setAddNewUser((prevState) => ({
      ...prevState, [name]: value,
    }));
  };

  const closeIcon = () => {
    setIsOpen(false);
    setIsEdit(false);
    setAddNewUser({ name: "", age: "", city: "" });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handelSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = user.filter(data =>
      data.name.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/users/${id}`);
      const updatedUsers = response.data;
      setUser(updatedUsers);
      setFilterUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setIsOpen(true);
    setIsEdit(true);
    setCurrentUserId(user.id);
    setAddNewUser({ name: user.name, age: user.age, city: user.city });
  };

  

  return (
    <>
      <div>
        <div className='container'>
          <h1 className='heading'>CURD Application</h1>
          <div className='search'>
            <div className="searchDiv">
              <img src="searchIcon.svg" alt="Search icon" className="searchIcon" />
              <input className='inputSearch' type="search" placeholder='Search' onChange={handelSearch} />
            </div>
            <button className='addRecord' onClick={() => setIsOpen(true)}>Add Record</button>
          </div>
          <table className='table'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='tableBody'>
              {filterUsers && filterUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button className='btn green' onClick={() => handleEditClick(user)}>Edit</button>
                      <button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {isOpen && (
            <div className='addUserContainer'>
              <div className='addUserForm'>
                <h1 className='addUserHeading'>
                  {isEdit ? "Edit Record" : "Add New Record"}
                  <img src='closeIcon.svg' className='closeIcon' onClick={closeIcon} />
                </h1>

                <div className='addUserSearch'>
                  <input
                    className='addUserInputSearch'
                    type="search"
                    placeholder='Name'
                    value={addNewUser.name}
                    name='name'
                    onChange={handelChange}
                  />

                  <br /> <br />

                  <input
                    className='addUserInputSearch'
                    type="search"
                    placeholder='Age'
                    name='age'
                    value={addNewUser.age}
                    onChange={handelChange}
                  />

                  <br /> <br />

                  <input
                    className='addUserInputSearch'
                    type="search"
                    placeholder='City'
                    name='city'
                    value={addNewUser.city}
                    onChange={handelChange}
                  />
                  <br /> <br />
                  <button className='addRecordButton' onClick={isEdit ? editRecord : addNewRecord}>
                    {isEdit ? "Update Record" : "Add Record"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSuccessForAdd && (
            <div className='successMessage'>
              <div className="showingMessage">
                
                <Check className='checkIcon' color='green' strokeWidth={1.5} />
                <h3 className='updateCheckStatus'>Success Alert</h3>
                <p className='updatedMessage'>The record has been added successfully.</p>
                
                <img src='closeIcon.svg' className='closeIcon' onClick={() => setshowSuccessForAdd(false)} />
              </div>
            </div>
          )}

          {showSuccessForUpdate && (
            <div className='successMessage'>
              <div className="showingMessage">
                
                <Check className='checkIcon' color='green' strokeWidth={1.5} />
                <h3 className='updateCheckStatus'>Success Alert</h3>
                <p className='updatedMessage'>The record has been updated successfully.</p>
                
                <img src='closeIcon.svg' className='closeIcon' onClick={() => setshowSuccessForUpdate(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;