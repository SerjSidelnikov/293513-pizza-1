import {
  ADD_TO_CART,
  DECREMENT_ORDER,
  INCREMENT_ORDER,
  REMOVE_ORDER,
} from "@/store/mutations-types";
import misc from "@/static/misc.json";
import { normalizeMisc } from "@/common/helpers";

export default {
  namespaced: true,

  state: {
    cart: [],
    misc: misc.map(normalizeMisc),
  },

  mutations: {
    [ADD_TO_CART](state, order) {
      state.cart.push(order);
    },

    [REMOVE_ORDER](state, order) {
      state.cart = state.cart.filter((it) => it.id !== order.id);
    },

    [INCREMENT_ORDER](state, order) {
      const el = state.cart.find((it) => it.id === order.id);
      el.quantity += 1;
    },

    [DECREMENT_ORDER](state, order) {
      const el = state.cart.find((it) => it.id === order.id);
      el.quantity -= 1;
    },
  },

  getters: {
    totalSum(state) {
      return state.cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
    },
  },

  actions: {
    [ADD_TO_CART]({ rootState, rootGetters, commit }) {
      commit(ADD_TO_CART, {
        id: Date.now(),
        name: rootState.Builder.namePizza,
        dough: rootState.Builder.dough,
        size: rootState.Builder.size,
        sauce: rootState.Builder.sauce,
        ingredients: rootGetters["Builder/selectedIngredients"],
        price: rootGetters["Builder/totalSum"],
        quantity: 1,
      });

      commit("Builder/RESET_BUILDER", null, { root: true });
    },

    [DECREMENT_ORDER]({ commit }, order) {
      if (order.quantity === 1) {
        commit(REMOVE_ORDER, order);
      } else {
        commit(DECREMENT_ORDER, order);
      }
    },
  },
};
