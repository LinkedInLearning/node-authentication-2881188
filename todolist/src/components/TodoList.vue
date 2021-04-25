<template>
  <div class="container pt-3">
    <b-alert v-model="showAlert" variant="danger" dismissible>
      {{ alertMessage }}
    </b-alert>

    <div v-if="jwt">
      <div class="row">
        <div class="col-12 py-5">
          Logged in as {{ username }}
          <button class="btn btn-danger float-right" @click="logout">
            Logout
          </button>
          <hr />
          <h1>
            {{ listName }}
            <svg v-if="showLoader" class="spinner" viewBox="0 0 50 50">
              <circle
                class="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="5"
              ></circle>
            </svg>
          </h1>
        </div>
      </div>
      <div class="row mb-3">
        <create-todo @on-new-todo="addTodo($event)" />
      </div>
      <div class="row">
        <div class="col-12 col-sm-10 col-lg-6">
          <ul class="list-group">
            <todo
              v-for="(todo, index) in items"
              :key="index"
              :description="todo.description"
              :completed="todo.completed"
              @on-toggle="toggleTodo(todo)"
              @on-delete="deleteTodo(todo)"
              @on-edit="editTodo(todo, $event)"
            />
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <login @on-login="login($event)" />
      <svg v-if="showLoader" class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import api from '../api';
import Todo from './Todo.vue';
import CreateTodo from './CreateTodo.vue';
import Login from './Login.vue';

export default {
  components: { Todo, CreateTodo, Login },
  props: {
    listName: { type: String, default: 'Todo' }
  },
  data() {
    return {
      items: [],
      showAlert: false,
      alertMessage: '',
      showLoader: false,
      jwt: null,
      username: null
    };
  },

  async mounted() {
    try {
      const maybejwt = this.$cookies.get('jwt');
      if (maybejwt) {
        this.jwt = maybejwt;
      }

      if (this.jwt) {
        this.showLoader = true;
        const whoami = await api.whoami(this.jwt);
        this.username = whoami.username;
        const data = await api.getItems(this.jwt);
        this.items = data.items;
        this.showLoader = false;
      }
    } catch (err) {
      // Likely the token has expired so let's invalidate it
      // this.logout();
      this.triggerError(err);
    }
  },
  methods: {
    triggerError(error) {
      this.showLoader = false;
      this.showAlert = true;
      this.alertMessage = error.message;
      // eslint-disable-next-line no-console
      console.error(error);
    },
    async login(credentials) {
      try {
        this.showLoader = true;
        const loginresult = await api.login(
          credentials.username,
          credentials.password
        );
        if (loginresult.jwt) {
          this.jwt = loginresult.jwt;
          this.$cookies.set('jwt', this.jwt);
          const whoami = await api.whoami(this.jwt);
          const data = await api.getItems(this.jwt);
          this.items = data.items;
          this.username = whoami.username;
        }

        this.showLoader = false;
      } catch (err) {
        this.triggerError(err);
      }
    },

    logout() {
      this.showLoader = true;
      this.jwt = null;
      this.$cookies.remove('jwt');
      this.username = null;
      this.items = [];
      this.showLoader = false;
    },

    async addTodo(newTodo) {
      try {
        this.showLoader = true;
        await api.createItem(this.jwt, newTodo);
        const data = await api.getItems(this.jwt);
        this.items = data.items;
        this.showLoader = false;
      } catch (err) {
        this.triggerError(err);
      }
    },
    async toggleTodo(todo) {
      try {
        this.showLoader = true;
        // eslint-disable-next-line no-param-reassign
        todo.completed = !todo.completed;
        await api.updateItem(this.jwt, todo._id, todo.item, todo.completed);
        this.showLoader = false;
      } catch (err) {
        this.triggerError(err);
      }
    },
    async deleteTodo(deletedTodo) {
      try {
        this.showLoader = true;
        await api.deleteItem(this.jwt, deletedTodo._id);
        const data = await api.getItems(this.jwt);
        this.items = data.items;
        this.showLoader = false;
      } catch (err) {
        this.triggerError(err);
      }
    },
    async editTodo(todo, newTodoDescription) {
      try {
        this.showLoader = true;
        // eslint-disable-next-line no-param-reassign
        todo.description = newTodoDescription;
        await api.updateItem(
          this.jwt,
          todo._id,
          newTodoDescription,
          todo.completed
        );
        this.showLoader = false;
      } catch (err) {
        this.triggerError(err);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;

  & .path {
    stroke: hsl(210, 70, 75);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
