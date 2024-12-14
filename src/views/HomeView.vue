<template>
  <div class="wrapper">
    <h1 class="title">Ausgaben</h1>
    <div class="chart-container">
      <canvas id="expenseChart" class="chart"></canvas>
      <div class="chart-center">
        <p class="total-expenses">{{ expensesStore.totalExpenses.toFixed(2) }} €</p>
      </div>
    </div>

    <!-- Dynamische Nachricht basierend auf den Ausgaben -->
    <div v-if="differenceMessage" class="difference-message">
      {{ differenceMessage }}
    </div>

    <InputField
        label="Ausgabe"
        v-model:user-input="userExpense"
        v-model:user-error="userError"
    />
    <Toggle
        v-model:user-select="selectedUser"
        :toggle-options="userOptions"
    />
    <Toggle
        v-model:user-select="selectedType"
        :toggle-options="typeOptions"
    />
    <div role="button"
         class="button"
         @click="saveExpense">
      <p> Ausgabe speichern</p>
      <div class="icon-wrapper">
        <img :src="getImage('ic_plus.png')" alt="">
      </div>
    </div>

    <div class="expenses-flex">
      <div
          v-for="(expense, index) in expensesStore.expenses"
          :key="index"
          class="expense"
          :style="{ backgroundColor: expense.user === 'Alex' ? 'yellow' : '#E6E6FA' }"
      >
        <p>{{ expense.type }}</p>
        <p>{{ expense.price.toFixed(2) }} €</p>
        <p>{{ new Date(expense.date).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import InputField from "@/components/InputField.vue";
import Toggle from "@/components/Toggle.vue";
import {computed, onMounted, ref, watch} from "vue";
import { Chart, registerables } from "chart.js";
import { useExpensesStore } from "@/stores/expenses";
import {getImage} from "@/utils/ImageUtils.ts";

// Chart.js registrieren
Chart.register(...registerables);

// States
const userExpense = ref<string>("");
const userError = ref<string>("");

const selectedUser = ref<string>("");
const selectedType = ref<string>("");

// Optionen
const userOptions = ref([
  { label: "Christiane", value: "Christiane" },
  { label: "Alex", value: "Alex" },
]);

const typeOptions = ref([
  { label: "Einkaufen", value: "Einkaufen", icon: "ic_cart.png" },
  { label: "Flo", value: "Flo", icon: "ic_baby.png" },
  { label: "Essen", value: "Essen", icon: "ic_liefer.png" },
  { label: "Freizeit", value: "Freizeit", icon: "ic_freizeit.png" },
]);

const differenceMessage = computed(() => {
  const difference = Math.abs(expensesStore.totalAlex - expensesStore.totalChristiane);
  if (expensesStore.totalAlex > expensesStore.totalChristiane) {
    return `Alex hat ${difference.toFixed(2)} € mehr bezahlt als Christiane.`;
  } else if (expensesStore.totalChristiane > expensesStore.totalAlex) {
    return `Christiane hat ${difference.toFixed(2)} € mehr bezahlt als Alex.`;
  } else {
    return `Beide haben gleich viel ausgegeben.`;
  }
})

// Store
const expensesStore = useExpensesStore();

// Funktion: Ausgabe speichern
const saveExpense = async () => {
  if (!userExpense.value || !selectedUser.value || !selectedType.value) {
    userError.value = "Bitte alle Felder ausfüllen!";
    return;
  }

  const newExpense = {
    user: selectedUser.value,
    type: selectedType.value,
    price: parseFloat(userExpense.value),
    date: new Date(),
  };

  await expensesStore.addExpense(newExpense);
  userExpense.value = "";
  selectedType.value = "";
  updateChart();
};

let expenseChart: Chart | null = null;

const createChart = () => {
  const ctx = document.getElementById("expenseChart") as HTMLCanvasElement;
  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Alex", "Christiane"],
      datasets: [
        {
          data: [
            expensesStore.totalAlex,
            expensesStore.totalChristiane,
          ],
          backgroundColor: ["yellow", "#E6E6FA"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "70%",
    },
  });
};

const updateChart = () => {
  if (expenseChart) {
    expenseChart.data.datasets[0].data = [
      expensesStore.totalAlex,
      expensesStore.totalChristiane,
    ];
    expenseChart.update();
  }
};

// Daten laden und Diagramm erstellen
onMounted(async () => {
  await expensesStore.fetchExpenses();
  createChart();
});

watch(
    () => [expensesStore.totalAlex, expensesStore.totalChristiane],
    () => {
      updateChart();
    }
);
</script>


<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px 16px 80px 16px;
  box-sizing: border-box;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.chart {
  width: 100%;
  height: 100%;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.total-expenses {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.expenses-flex {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .expense {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-radius: 14px;
    height: 30px;
    box-shadow: 1px 1px 7px;

    p {
      font-size: 16px;
    }
  }
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: green;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  height: 40px;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 30px;
      height: 30px;
    }
  }

  &:hover {
    background: #006400;
  }

}
</style>

