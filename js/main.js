const API = "https://api.github.com/users/";



const app = Vue.createApp({
  data() {
    return {
      search: null,
      result: false,
      error: false,
      favorites: new Map(),
    };
  },
  created(){
    const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'))
    if (savedFavorites.length) {
      const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
      this.favorites = favorites
  }
  
  },
  computed: {
    esFavorito () {
      return this.favorites.has(this.result.id)
    },
    allFavorites() {
      // pasa los favoritos en forma de arreglo
      return Array.from(this.favorites.values())
    }
  },
  methods: {
    async doSearch() {
      this.error = this.result = null

      try { 
        const response = await fetch(API + this.search)
        if (!response.ok) throw new Error("Usuario no encontrado!!!")
        
        const data = await response.json()
        this.result = data
        //console.log(data)
      } catch (error) {
          this.error = error
      } finally {
          this.search = null
      }
    },

    addFavorite () {
      this.favorites.set(this.result.id, this.result)
      this.updateStorage()
    },

    removeFavorite () {
      this.favorites.delete(this.result.id)
      this.updateStorage()
    },

    showFavorite(favorite) {
      this.result = favorite
    },
  

    // Añade persistencia a los datos, para que favoritos sobrevivan a un refresco o cierre de navegador
    updateStorage () {
      window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites));
    }
  }
});


