let app = Vue.createApp({
  data: () => {
    return {
      showSidebar: false,
      inventory: [],
      cart: {}
    }
  },
  computed: {
    totalQuantity() {
      return Object.values(this.cart).reduce((acc, curr, index) => {
        return acc + curr
      }, 0)
    }
  },
  methods: {
    addToCart(name, index) {
      if (!this.cart[name]) this.cart[name] = 0
      this.cart[name] += this.inventory[index].quantity
      this.inventory[index].quantity = 0
    },
    getIcoClass(name, index) {
      return 'icofont-'+this.inventory[index].icon
    },
    toggleSidebar () {
      this.showSidebar = !this.showSidebar
    }
  },
  async mounted() {
    const res = await fetch('./food.json')
    const data = await res.json()
    this.inventory = data
  }
})

app.component('sidebar', {
  props: ['toggle', 'cart', 'inventory', 'remove'],
  template: `
    <aside class="cart-container">
      <div class="cart">
        <h1 class="cart-title spread">
          <span>
            Cart
            <i class="icofont-cart-alt icofont-1x"></i>
          </span>
          <button @click="toggle" class="cart-close">&times;</button>
        </h1>

        <div class="cart-body">
          <table class="cart-table">
            <thead>
              <tr>
                <th><span class="sr-only">Product Image</span></th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(quantity, key, i) in cart" :key="i">
                <td><i class="icofont-3x" :class="getIcon(key)"></i></td>
                <td>{{ key }}</td>
                <td>\${{ getPrice(key) }} </td>
                <td class="center">{{ quantity }}</td>
                <td>\${{ quantity * getPrice(key) }}</td>
                <td class="center">
                  <button @click="removeItem(key)" class="btn btn-light cart-remove">
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
          <div class="spread">
            <span><strong>Total:</strong> \${{ calculateTotal() }}</span>
            <button class="btn btn-light">Checkout</button>
          </div>
        </div>
      </div>
    </aside>
  `,
  methods: {
    getPrice(name) {
      const product = this.inventory.find((p) => {
        return p.name === name
      }) 
      return product.price.USD
    },
    getIcon(name) {
      const product = this.inventory.find((p) => {
        return p.name === name
      }) 
      return 'icofont-'+product.icon
    },
    calculateTotal() {
      // const names = Object.keys(this.cart)
      // console.log(this.getPrice(names[0]))
      const total = Object.entries(this.cart).reduce((acc, curr, index) => {
        // return acc + parseFloat(curr * this.getPrice(names[index]))
        return acc + parseFloat(curr[1] * this.getPrice(curr[0]))
      }, 0)
      return total.toFixed(2)
    },
    removeItem(name) {
      delete this.cart[name]
    }
  }
})


app.mount('#app')