<template>
  <div class="inp-outer-wrapper">
    <div class="inp-wrapper">
      <label :for="id">{{ label }}</label>
      <input
          :class="{'hasError' : userError}"
          v-model="userInput" type="text" :id="id">
    </div>
    <p v-if="userError" class="error">{{ userError }}</p>
  </div>
</template>

<script setup lang="ts">
import {computed, type ModelRef} from "vue";

const {label} = defineProps<{
  label: string
}>()

const userInput: ModelRef<string | undefined> = defineModel('userInput')
const userError: ModelRef<string | undefined> = defineModel('userError')

const id = computed(() => `${label}-id`)

</script>

<style scoped>

.inp-outer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;

  .error {
    font-size: 14px;
    color: red;
    text-align: right;
    width: 100%;
  }

  .inp-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;

    label {
      position: absolute;
      top: -10px;
      left: 10px;
      font-size: 16px;
      box-sizing: border-box;
      padding: 0 14px;
      background: white;
      border-radius: 14px;
    }

    input {
      height: 60px;
      font-family: Lato, sans-serif;
      font-size: 24px;
      border: 2px solid green;
      border-radius: 14px;
      outline: none;
      box-sizing: border-box;
      padding: 0 15px;

      &:focus {
        outline: 1px solid green;
      }

      &.hasError {
        border: 2px solid red;
      }
    }
  }
}

</style>