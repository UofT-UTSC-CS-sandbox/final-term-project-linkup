import createRefresh from 'react-auth-kit/createRefresh';

const refreshToken = createRefresh({
    interval: 10, // The time in sec to refresh the Access token,
    refreshApiCallback: async (param) => {
      try {
        const response = await axios.post("/refresh", param, {
          headers: {'Authorization': `Bearer ${param.authToken}`}
        })
        console.log("Refreshing")
        return {
          isSuccess: true,
          newAuthToken: response.data.token,
          newAuthTokenExpireIn: 10,
          newRefreshTokenExpiresIn: 60
        }
      }
      catch(error){
        console.error(error)
        return {
          isSuccess: false
        } 
      }
    }
  })

export default refreshToken;