
export const getToken = () => {
    if(localStorage.getItem('userData')){
        return JSON.parse(localStorage.getItem('userData')!)
    }

    return null
  } 
export const setToken = (token: string) => {
    localStorage.setItem('userData' , token)
}

export const removeToken = () => {
    localStorage.removeItem('userData')
}