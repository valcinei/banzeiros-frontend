<template>
  <div>
    <div id="app-name">
      <h1 class="text-center">Banzeiros</h1>
    </div>
    <div id="main">
      <div class="container">
        <div class="search-content">
          <form @submit.prevent="searchBoats()">
            <div class="row">
              <b-input-group @click="searchBoats()">
                <b-form-input v-model="query" type="text"></b-form-input>

                <b-input-group-append>
                  <b-button variant="outline-secondary">Buscar</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
          </form>
        </div>

        <div class="row">
          <div class="col-md-8">
            <b-table
              striped
              hover
              :items="boatList"
              :fields="fields"
              @row-clicked="setSelectedBoat"
            >
              <template v-slot:cell(action)="data">
                <b-button variant="danger" type="button">
                  <b-icon-trash @click="deleteBoat(data)"></b-icon-trash>
                </b-button>
              </template>
            </b-table>
          </div>
          <div class="col-md-4">
            <form @submit.prevent="saveBoat()">
              <b-input-group prepend="Nome" class="col-md-12">
                <b-form-input ref="inputName" v-model="boat.name" aria-label="Nome"></b-form-input>
              </b-input-group>
   
              <b-input-group prepend="Cidade Saída" class="col-md-12">
                <b-form-input v-model="boat.from" aria-label="Cidade Saída"></b-form-input>
              </b-input-group>
              <b-input-group prepend="Cidade Destino" class="col-md-12">
                <b-form-input v-model="boat.to" aria-label="Cidade Destino"></b-form-input>
              </b-input-group>
              <b-input-group prepend="Porto" class="col-md-12">
                <b-form-input v-model="boat.harbor" aria-label="Porto"></b-form-input>
              </b-input-group>
              <div prepend="btn" class="col-md-12">
                <b-button
                  variant="danger"
                  type="button"
                  @click.prevent="resetBoat()"
                  class="form-control"
                >Limpar</b-button>

                <b-button
                  variant="dark"
                  :disabled="!boat.name || !boat.harbor"
                  type="submit"
                  class="form-control"
                >{{ !!boat.id? "Savar": "Adicionar"}}</b-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "./api";
export default {
  name: "app",
  data() {
    return {
      query: "",
      boat: {
        name: "",
        harbor: "",
        from:"",
        to:""
      },
      fields: [
        // {
        //   key: "id",
        //   label: "Código ",
        //   sortable: false
        // },
        {
          key: "name",
          label: "Nome ",
          sortable: false
        },
        {
          key: "harbor",
          label: "Porto ",
          sortable: false
        },
         {
          key: "from",
          label: "Saída ",
          sortable: false
        },
         {
          key: "to",
          label: "Destino ",
          sortable: false
        },
        {
          key: "action",
          label: "Ação ",
          sortable: false
        }
      ],
      boatList: []
    };
  },
  created() {
    this.getBoats();
  },
  methods: {
    async saveBoat() {
      if (this.boat.id) {
        await Api.put("boats", this.boat);
      } else {
        await Api.post("boats", this.boat);
      }
      this.resetBoat();
      this.getBoats();
    },
    resetBoat() {
      this.boat = {
        name: "",
        harbor: ""
      };
      this.$refs.inputName.$el.focus();
    },
    getRandomHash() {
      return Math.random()
        .toString(36)
        .substring(7);
    },
    async searchBoats() {
      if (!this.query) return;
     const res = await Api.get("boats/query="+this.query);
      this.boatList = res.data;

    },
    async getBoats() {
      const res = await Api.get("boats");
      this.boatList = res.data;
    },

    setSelectedBoat(boat) {
      this.boat = Object.assign({}, boat);
    },
    deleteBoat(boat) {
      Api.delete("boats", { data: boat.item });
      this.getBoats();
    }
  }
};
</script>

<style>
#main {
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #f1f1f1;
}
#app-name {
  padding-top: 15px;
  padding-bottom: 15px;
}
.search-content {
  margin-bottom: 40px;
}
.container {
  max-width: 1240px;
}
</style>
