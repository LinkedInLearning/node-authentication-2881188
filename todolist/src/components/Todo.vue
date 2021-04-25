<template>
  <li class="d-flex align-items-center list-group-item">
    <button
      v-if="!isEditing"
      class="btn border-0 flex-grow-1 text-left shadow-none"
      :class="{ completed }"
      @click="$emit('on-toggle')"
    >
      <span>{{ description }}</span>
    </button>
    <form v-else class="flex-grow-1" @submit.prevent="">
      <input
        ref="newTodo"
        v-model="newTodoDescription"
        type="text"
        class="form-control"
        @blur="finishEditing()"
        @keyup.enter="$event.target.blur"
      />
    </form>
    <button
      class="btn btn-outline-primary border-0 ml-2"
      @click="startEditing()"
    >
      <span class="fa fa-edit"></span>
    </button>
    <button class="btn btn-outline-danger border-0" @click="$emit('on-delete')">
      <span class="fa fa-trash"></span>
    </button>
  </li>
</template>

<script>
export default {
  props: {
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false }
  },
  data() {
    return {
      oldTodoDescription: '',
      isEditing: false,
      newTodoDescription: ''
    };
  },
  methods: {
    startEditing() {
      if (this.isEditing) {
        this.finishEditing();
      } else {
        this.newTodoDescription = this.description;
        this.isEditing = true;
        this.$nextTick(() => this.$refs.newTodo.focus());
      }
    },
    finishEditing() {
      this.isEditing = false;
      this.$emit('on-edit', this.newTodoDescription);
    }
  }
};
</script>

<style lang="scss" scoped>
.completed {
  text-decoration: line-through;
}
</style>
