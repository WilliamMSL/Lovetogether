import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [firstName1, setFirstName1] = useState('');
  const [firstName2, setFirstName2] = useState('');
  const [selectedToys, setSelectedToys] = useState([]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const { firstName1, firstName2, selectedToys } = JSON.parse(savedPreferences);
      console.log("UserProvider - Loaded from localStorage:", { firstName1, firstName2, selectedToys });
      setFirstName1(firstName1 || '');
      setFirstName2(firstName2 || '');
      setSelectedToys(selectedToys || []);
    }
  }, []);

  const updateUserPreferences = (data) => {
    console.log("UserProvider - Updating preferences:", data);
    setFirstName1(data.firstName1);
    setFirstName2(data.firstName2);
    setSelectedToys(data.selectedToys);
    localStorage.setItem('userPreferences', JSON.stringify(data)); // Update localStorage as well
  };

  return (
    <UserContext.Provider value={{ firstName1, firstName2, selectedToys, updateUserPreferences }}>
      {children}
    </UserContext.Provider>
  );
};
