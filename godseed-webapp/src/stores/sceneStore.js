import { defineStore } from 'pinia';
import http from '@/stores/http.js';

export const useScenesStore = defineStore('scenesStore', {
  state: () => ({
    scenes: [],
    currentScene: null,
    parameters: [],
    variations: [],
  }),

  actions: {
    async fetchScenes() {
      try {
        const response = await http.get('/scenes');
        this.scenes = response.data;
      } catch (error) {
        console.error('Failed to fetch scenes:', error);
      }
    },

    async fetchSceneById(id) {
      try {
        const response = await http.get(`/scenes/${id}`);
        this.currentScene = response.data;
      } catch (error) {
        console.error('Failed to fetch scene by id:', error);
      }
    },

    async addScene(scene) {
      try {
        const response = await http.post('/scenes', scene);
        this.scenes.push(response.data);
        this.currentScene = response.data; // Set the newly added scene as the currentScene
      } catch (error) {
        console.error('Failed to add scene:', error);
      }
    },

    async updateScene(id, updatedScene) {
      try {
        const response = await http.put(`/scenes/${id}`, updatedScene);
        const index = this.scenes.findIndex(s => s._id === id);
        if (index !== -1) {
          this.scenes[index] = response.data;
          if (this.currentScene && this.currentScene._id === id) {
            this.currentScene = response.data;
          }
        }
      } catch (error) {
        console.error('Failed to update scene:', error);
      }
    },

    async deleteScene(id) {
      try {
        await http.delete(`/scenes/${id}`);
        this.scenes = this.scenes.filter(s => s._id !== id);
        if (this.currentScene && this.currentScene._id === id) {
          this.currentScene = null;
        }
      } catch (error) {
        console.error('Failed to delete scene:', error);
      }
    },

    async fetchParameters() {
      try {
        const response = await http.get('/parameters');
        this.parameters = response.data;
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
      }
    },

    async addVariation(variation) {
      try {
        const response = await http.post('/variations', variation);
        this.variations.push(response.data);
      } catch (error) {
        console.error('Failed to add variation:', error);
      }
    },

    async fetchVariations(sceneId) {
      try {
        const response = await http.get(`/variations?scene=${sceneId}`);
        this.variations = response.data;
      } catch (error) {
        console.error('Failed to fetch variations:', error);
      }
    },

    async uploadImage(imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const response = await http.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.imageUrl; // Return the URL of the uploaded image
      } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
      }
    },

    async uploadVideo(videoFile) {
      const formData = new FormData();
      formData.append('video', videoFile);

      try {
        const response = await http.post('/upload/video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.videoUrl; // Return the URL of the uploaded video
      } catch (error) {
        console.error('Failed to upload video:', error);
        throw error;
      }
    },
  },
});
