import axios from "axios";
const baseUrl = "/api/notes";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 1000,
    content: "this note is not saved to server",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  };
  return request.then((response) => response.data.concat(nonExisting));
};

const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
  setToken,
};
