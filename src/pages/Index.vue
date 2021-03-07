<template>
  <q-page class="row items-center justify-evenly">
    <input type="text" v-model="searchString">
    <button @click="initAllDbIndex">add</button>
    <button @click="deleteDb">Delete</button>
    <button @click="search">Search</button>
    <button @click="log">Log IndexDB</button>
    <button @click="getAll">Get All</button>
    <button @click="get">Get</button>
    <button @click="where">Where</button>
    <button @click="find">Find</button>
    <button @click="custom">Custom</button>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models'
import ExampleComponent from 'components/ClassComponent.vue'
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { ExampleComponent }
})
export default class PageIndex extends Vue {

  private searchString: string = "";

  async custom(){
    console.log(await this.$misadb.user.count());
  }

  async log(){
    await this.$misadb.addList("user",
    [
      {id: 1, name: "Đặng Quốc Thắng"},
      {id: 2, name: "Phạm Thị Thảo"},
      {id: 3, name: "Phạm Thị Bim"},
    ]
    )
    console.log("123");
  }

  async get() {
    console.log(await this.$misadb.getPagging("user"));
  }

  created () {
    
  }

  async getAll(){
    console.log(await this.$misadb.getAll("user"));
  }

  async search() {
    console.log(await this.$misadb.search("user","name",this.searchString,true));
  }

  async initAllDbIndex() {
    for (let index = 1; index < 20000; index++) {
      await this.db.user.put({id: index, bar: this.makeid(40)})
    }
    console.log("123");
  }

  makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += "misa"+characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  async where(){
    console.log(await this.$misadb.where("user",{name: "Đặng Quốc Thắng"}));
  }

  async find() {
    console.log(await this.$misadb.find("user",{name: "Đặng Quốc Thắng"}));
  }

  initDataTest () {
    
  }

  deleteDb(){
    
  }


}
</script>
