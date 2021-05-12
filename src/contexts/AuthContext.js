import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

// Using createContext because we want all of our component have access to the user at anytime
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}
// ////////////////////////////////////////////////////
// Using useContext here to pass the props down to our children
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    //   firebase method of create users
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }
  function updatePassword(password) {
    return currentUser.updateEmail(password)
  }

  // We use useEffect here becuase we want auth.onstageChanged get render everytime component get mounted. Not everytime that this component get render.
  useEffect(() => {
    //   firebase method of handling user
    // We want to unsubscribe when this onAuthStateChanged get mounted. so that we need to return the unsubscribe here.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // This value is the value that we want to pass down as a props.
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  }

  //   We want children to have access to currentUser.

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
