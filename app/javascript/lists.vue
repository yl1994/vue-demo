<template>
  <div id='list'>
    <h1>Lists</h1>
    <p>type into sth:{{ this.checkInput}}</p>
    <input type='text'  v-model="checkInput" class='form-control'  autofocus="true">
    <button v-on:click='addLine' class='btn btn-primary' :disabled="!checkInput.length" >Add line</button>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for='line in lists'>
          <td>{{ line.id }}</td>
          <td v-on:click='changeLine(line)'>{{ line.item }}</td>
          <td>
            <button v-on:click='deleteLine(line.id)' class='btn btn-primary'>Delete Line</button>
          </td>
          <td v-show='line.editable'>
            <input type='text' v-on:input='line.item= $event.target.value' >
            <button v-on:click='updateLine(line)' >Update Line</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      checkInput: '',
      lists: [
        {id: 1, item: 'Bar'},
        {id: 2, item: 'Gun'}
      ]
    }
  },

  created: function() {
    this.fetchLists()
  },

  methods: {
    fetchLists: function() {
      this.$http.get("/lists.json").then(response => {
        var newList = response.data.map((oldItem) => {
          oldItem.editable = false;
          return oldItem;
        })
        this.lists = newList
      })
    },
    addLine: function() {
      this.$http.post('/lists.json', { item: this.checkInput }, {}).then(response => {
        this.fetchLists(), this.checkInput = ''
      }).catch(function(error) {
        console.log('Got a problem' + error)
      })
    },
    changeLine(line) {
      line.editable = !line.editable
    },
    updateLine(line) {
      this.$http.put(`/lists/${line.id}`, {item: line.item}).then(response => {
        this.fetchLists()
      }).catch(function(error){
        console.log('Got a problem' + error)
      })
    },
    deleteLine(id) {
      this.$http.delete(`/lists/${id}.json`).then(response => {
        this.fetchLists()
      }).catch(function(error) {
        console.log('Got a problem' + error)
      })
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 2em;
  text-align: center;
  color: red;
}
</style>
