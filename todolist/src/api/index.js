import axios from 'axios';
import normalizeUrl from 'normalize-url';

const baseurl = 'http://localhost:3000';

if (!baseurl) {
  throw new Error('Please define a baseurl for your Lambda functions!');
}

const normalizedUrl = normalizeUrl(baseurl);

export default {
  async getItems(jwt, id) {
    const rurl = id
      ? `${normalizedUrl}/api/todolist/${id}`
      : `${baseurl}/api/todolist`;
    const response = await axios.get(rurl, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  },

  async createItem(jwt, description) {
    const rurl = `${normalizedUrl}/api/todolist`;
    const response = await axios.post(
      rurl,
      { description },
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data;
  },

  async updateItem(jwt, id, description, completed) {
    const rurl = `${normalizedUrl}/api/todolist/${id}`;
    const response = await axios.put(
      rurl,
      { description, completed },
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    );
    return response.data;
  },

  async deleteItem(jwt, id) {
    const rurl = `${normalizedUrl}/api/todolist/${id}`;
    const response = await axios.delete(rurl, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  },

  async whoami(jwt) {
    const rurl = `${normalizedUrl}/api/whoami`;
    const response = await axios.get(rurl, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  },

  async login(username, password) {
    const rurl = `${normalizedUrl}/api/login`;
    const response = await axios.post(rurl, { username, password });
    return response.data;
  }
};
