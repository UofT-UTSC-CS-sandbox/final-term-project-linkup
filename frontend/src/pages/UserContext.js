import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({ userData: {}, updateUserData: () => {} });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({});

    const updateUserData = data => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
};
