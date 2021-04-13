<template>
  <main>
    <div class="container">
      <div id="signup" class="card bg-light">
        <article class="card-body mx-auto">
          <h4 class="card-title mt-3 text-center">Todo List Login</h4>
          <p class="text-center">Please use your credentials to log in</p>

          <form @submit.prevent="login()">
            <div class="form-group input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-user"></i>
                </span>
              </div>
              <input
                v-model="username"
                name="username"
                class="form-control"
                placeholder="Username"
                type="text"
                required
                autocomplete="some-username"
              />
            </div>
            <!-- form-group// -->

            <div class="form-group input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-lock"></i>
                </span>
              </div>
              <input
                v-model="password"
                class="form-control"
                name="password"
                placeholder="Password"
                type="password"
                required
                autocomplete="new-password"
              />
            </div>
            <!-- form-group// -->

            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
        </article>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null
    };
  },
  methods: {
    login() {
      if (this.username.length > 0 && this.password.length > 0) {
        this.$emit('on-login', {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>
