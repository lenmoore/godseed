import { defineStore } from 'pinia'

import http from '@/stores/http.js'

export const useStateStore = defineStore('stateStore', {
  state: () => ({
    showStandby: false,
    showItIsWhatItIs: false,
    showAllAnimations: false,
    showCivilisationWasDestroyed: false,
    civilisationCounter: 42,
    developmentMode: false,
    created: false,
    showConfirm: false,
    createConfirmed: false,

    appShowsCreationAnimation: false,
    appShowsDestroyAnimation: false

  }),
  actions: {
    makeEverythingFalse() {
      this.showStandby = false
      this.showItIsWhatItIs = false
      this.showAllAnimations = false
      this.showCivilisationWasDestroyed = false
      this.developmentMode = false
      this.created = false
      this.showConfirm = false
      this.createConfirmed = false
    },
    async createInitialState() {
      try {
        const response = await http.post('/arduino/status')
        this.showStandby = response.data.showStandby
        this.showItIsWhatItIs = response.data.showItIsWhatItIs
        this.showAllAnimations = response.data.showAllAnimations
        this.showCivilisationWasDestroyed = response.data.showCivilisationWasDestroyed
        this.civilisationCounter = response.data.civilisationCounter
        this.developmentMode = response.data.developmentMode
        this.created = response.data.created
        this.showConfirm = response.data.showConfirm
        this.createConfirmed = response.data.createConfirmed
      } catch (error) {
        console.error('Failed to create initial state:', error)
      }
    },
    async jackInserted() {
      // if any jack is inserted, we will show that parameter's videos
      this.makeEverythingFalse()
      this.showStandby = false
      this.created = true
      await this.updateState()
    },
    async updateDevMode() {
      // toggle development mode and make everything else false
      console.log('dev mode')
      const devModePrevValue = this.developmentMode
      console.log(devModePrevValue)
      this.makeEverythingFalse()
      this.developmentMode = !devModePrevValue
      await this.updateState()
    },
    async noJacksEntered() {
      // only show it is what it is
      this.makeEverythingFalse()
      this.showItIsWhatItIs = true
      this.showStandby = false
      await this.updateState()
    },
    async createPushed() {
      // when create button is pushed, created -> true
      // the app shows the 'create world animation'
      console.log('create pushed')
      this.makeEverythingFalse()
      this.created = true
      this.showAllAnimations = true
      this.civilisationCounter++
      await this.updateState()

    },
    async destroyPushed() {
      this.makeEverythingFalse()
      this.showCivilisationWasDestroyed = true
      await this.updateState()
    },
    async anyChangeDetected() {

    },
    async updateState() {
      try {
        const body = {
          // showStandby: this.showStandby,
          showItIsWhatItIs: this.showItIsWhatItIs,
          showAllAnimations: this.showAllAnimations,
          showCivilisationWasDestroyed: this.showCivilisationWasDestroyed,
          civilisationCounter: this.civilisationCounter,
          developmentMode: this.developmentMode,
          created: this.created,
          showConfirm: this.showConfirm,
          createConfirmed: this.createConfirmed
        }
        const response = await http.put('/arduino/status', body)
        console.log(response)
        const state = response.data.state
        this.showStandby = state.showStandby
        this.showItIsWhatItIs = state.showItIsWhatItIs
        this.showAllAnimations = state.showAllAnimations
        this.showCivilisationWasDestroyed = state.showCivilisationWasDestroyed
        this.civilisationCounter = state.civilisationCounter
        this.developmentMode = state.developmentMode
        this.created = state.created
        this.showConfirm = state.showConfirm
        this.createConfirmed = state.createConfirmed

      } catch (error) {
        console.error('Failed to update state:', error)
      }
    },
    async fetchState() {
      try {
        const response = await http.get('/arduino/status')
        const state = response.data.state
        this.showStandby = state.showStandby
        this.showItIsWhatItIs = state.showItIsWhatItIs
        this.showAllAnimations = state.showAllAnimations
        this.showCivilisationWasDestroyed = state.showCivilisationWasDestroyed
        this.civilisationCounter = state.civilisationCounter
        this.developmentMode = state.developmentMode
        this.created = state.created
        this.showConfirm = state.showConfirm
        this.createConfirmed = state.createConfirmed
      } catch (error) {
        console.error('Failed to fetch state:', error)
      }
    }
  }
})

