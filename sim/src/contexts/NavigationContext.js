// // NavigationContext.js
// import React, { createContext, useState, useContext } from 'react';

// const NavigationContext = createContext();

// export const NavigationProvider = ({ children }) => {
//   const [isNavBarOpen, setIsNavBarOpen] = useState(false);

//   const toggleNavBar = () => {
//     setIsNavBarOpen((prev) => !prev);
//   };

//   return (
//     <NavigationContext.Provider value={{ isNavBarOpen, toggleNavBar }}>
//       {children}
//     </NavigationContext.Provider>
//   );
// };

// export const useNavigationState = () => useContext(NavigationContext);
