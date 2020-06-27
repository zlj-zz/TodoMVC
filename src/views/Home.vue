<template>
<div class="home">
  <style>
    [v-cloak] {
      display: none;
    }
  </style>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodo"
        @keyup.enter="addTodo" />
    </header>
    <section class="main" v-show="todos.length" v-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" class="todo" :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility == 'all' }" @click="{ visibility='all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility == 'active' }" @click="{ visibility='active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility == 'completed' }" @click="{ visibility='completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>

  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Written by <a href="http://evanyou.me">Evan You</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>

</div>
</template>

<script>

// visibility filters
let filters = {
    all: todos => todos,
    active: todos => {
        return todos.filter(todo =>
            !todo.completed
        );
    },
    completed: todos => {
        return todos.filter(todo =>
            todo.completed
        );
    }
};


// @ is an alias to /src
let todoapp = {
    name: "todoapp",

    data: () => ({
        todos: [],
        newTodo: "",
        editedTodo: null,
        visibility: "all",
        uid: 0,
        userId: "",
    }),

    // watch todos change for localStorage persifilteredTodosstence
    watch: {
        todos: {
          handler: function (todos) {
            let todosStr = JSON.stringify(todos);
            this.axios.post('/api/saveTodos', {
                data: todosStr,
                userId: this.userId
            })
                .then(res => {
                    console.log("saved successful");
                })
          },
          deep: true
        }
    },

    computed: {
        filteredTodos: function () {
           return filters[this.visibility](this.todos);
        },
        remaining: function () {
            return filters.active(this.todos).length;
        },
        allDone: {
            get: function () {
                     return this.remaining === 0;
                 },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value;
                });
            }
        }
    },

    filters: {
        pluralize: n => n === 1 ? "item" : "items"
    },

    mounted: function () {
        let visibility = window.location.hash.replace(/#\/?/, "");
        if (filters[visibility]) {
            this.visibility = visibility;
        }
        this.userId = this.$store.state.userId;
        this.axios.get('/api/getTodos',{
            params: {userId: this.$store.state.userId}
        })
            .then(res => {
                if(res.status === 200) {
                    if ((res.data).length > 0) {
                        this.todos = JSON.parse(res.data[0].data);
                    }
                    this.uid = (this.todos).length;
                }
            })
     },

    methods: {
      addTodo: function () {
            let value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.todos.push({
                id: this.id++,
                title: value,
                completed: false,
            });
            this.newTodo = "";
        },

        removeTodo: function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },

        editTodo: function (todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },

        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
        },

        cancelEdit: function (todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        },

        removeCompleted: function () {
            this.todos = filters.active(this.todos);
        }
    },

    directives: {
        "todo-focus": (el, binding) => {
            if (binding.value) {
                el.focus();
            }
        }
    }
};
export default todoapp;

</script>

<style>
body {
    max-width: 100%;
}
h1 {
    margin: 10px;
}
.todoapp {
    max-width: 550px;
    margin: 140px auto;
}
.footer {
    height: 35px;
}
</style>
