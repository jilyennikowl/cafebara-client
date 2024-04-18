import axios from "axios"

const authorize = async (access_token) => {
  return axios.get(
    `${process.env.REACT_APP_API_HOST}/users`,
    {headers: {
        access_token,
      }}
  ).then((response) => {
    return response.data
  }).catch((error) => {
    throw new Error(error.response)
  })
}

export default authorize