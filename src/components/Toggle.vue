<template>
  <div class="toggle-flex">
    <div
        v-for="(option, index) in toggleOptions"
        :key="index"
        @click="selectValue(option.value)"
        :class="['toggle', { selected: userSelect === option.value, alex: option.value === 'Alex', christiane: option.value === 'Christiane' }]"
    >
      <div v-if="option.icon" class="icon-wrapper">
        <img :src="getImage(option.icon)" alt="">
      </div>
      <label>{{ option.label }}</label>
      <input
          type="radio"
          :value="option.value"
          v-model="userSelect"
          style="display: none"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {defineProps, defineModel, type ModelRef} from "vue";
import type {ToggleOption} from "@/models/PropInterfaces.ts";
import {getImage} from "@/utils/ImageUtils.ts";


const {toggleOptions} = defineProps<{
  toggleOptions: ToggleOption[];
}>();

const userSelect: ModelRef<string | undefined> = defineModel("userSelect");

function selectValue(value: string) {
  userSelect.value = value;
}
</script>

<style scoped>
.toggle-flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48%;
  box-sizing: border-box;
  cursor: pointer;
  height: 50px;
  text-align: center;
  padding: 8px;
  gap: 16px;
  background: lightgray;
  border-radius: 14px;

  label {
    cursor: pointer;
  }

  &.alex {
    background: yellow;
  }

  &.christiane {
    background: #E6E6FA;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 30px;
      height: 30px;
    }
  }

  &.selected {
    background: lightgreen;

  }
}
</style>
