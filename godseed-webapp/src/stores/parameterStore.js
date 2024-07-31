import { defineStore } from 'pinia';
import http from '@/stores/http.js'; // Import the axios instance

export const useSetupStore = defineStore('setupStore', {
  state: () => ({
    parameters: [],
    eras: [],
  }),

  actions: {
    // Parameter Actions
    async fetchParameters() {
      try {
        const response = await http.get('/parameters');
        this.parameters = response.data;
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
      }
    },

    async addParameter(parameter) {
      try {
        console.log(parameter)
        const response = await http.post('/parameters', parameter);
        this.parameters.push(response.data);
      } catch (error) {
        console.error('Failed to add parameter:', error);
      }
    },

    async updateParameter(id, updatedParameter) {
      try {
        const response = await http.put(`/parameters/${id}`, updatedParameter);
        const index = this.parameters.findIndex(p => p._id === id);
        if (index !== -1) {
          this.parameters[index] = response.data;
        }
      } catch (error) {
        console.error('Failed to update parameter:', error);
      }
    },

    async deleteParameter(id) {
      try {
        await http.delete(`/parameters/${id}`);
        this.parameters = this.parameters.filter(p => p._id !== id);
      } catch (error) {
        console.error('Failed to delete parameter:', error);
      }
    },

    // Era Actions
    async fetchEras() {
      try {
        const response = await http.get('/eras');
        this.eras = response.data;
      } catch (error) {
        console.error('Failed to fetch eras:', error);
      }
    },

    async addEra(era) {
      try {
        const response = await http.post('/eras', era);
        this.eras.push(response.data);
      } catch (error) {
        console.error('Failed to add era:', error);
      }
    },

    async updateEra(id, updatedEra) {
      try {
        const response = await http.put(`/eras/${id}`, updatedEra);
        const index = this.eras.findIndex(e => e._id === id);
        if (index !== -1) {
          this.eras[index] = response.data;
        }
      } catch (error) {
        console.error('Failed to update era:', error);
      }
    },

    async deleteEra(id) {
      try {
        await http.delete(`/eras/${id}`);
        this.eras = this.eras.filter(e => e._id !== id);
      } catch (error) {
        console.error('Failed to delete era:', error);
      }
    },
  },
});
