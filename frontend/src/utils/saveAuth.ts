
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

export const getAuthToken = () => {
    if(localStorage.getItem('tempAuthToken')){
        return JSON.parse(sessionStorage.getItem('tempAuthToken')!)
   }
}

export const setAuthToken = (token: any) => {
    sessionStorage.setItem('tempAuthToken', JSON.stringify(token))
}

export const removeAuthToken = () => {
    sessionStorage.removeItem('tempAuthToken')
}