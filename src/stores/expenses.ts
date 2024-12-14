import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export interface Expense {
  user: string;
  type: string;
  price: number;
  date: Date;
}

export const useExpensesStore = defineStore("expenses", () => {
  const expenses = ref<Expense[]>([]);
  const expensesCollection = collection(db, "expenses");

  async function addExpense(expense: Expense) {
    try {
      const docRef = await addDoc(expensesCollection, {
        ...expense,
        date: Timestamp.fromDate(expense.date),
      });
      console.log("Ausgabe hinzugefügt mit ID: ", docRef.id);
      expenses.value.push(expense);
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Ausgabe: ", error);
    }
  }

  async function fetchExpenses() {
    try {
      const q = query(expensesCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      expenses.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as Expense;
      });
    } catch (error) {
      console.error("Fehler beim Abrufen der Ausgaben:", error);
    }
  }

  const alexExpenses = computed(() =>
      expenses.value.filter((expense) => expense.user === "Alex")
  );
  const christianeExpenses = computed(() =>
      expenses.value.filter((expense) => expense.user === "Christiane")
  );

  const totalAlex = computed(() =>
      alexExpenses.value.reduce((sum, expense) => sum + expense.price, 0)
  );
  const totalChristiane = computed(() =>
      christianeExpenses.value.reduce((sum, expense) => sum + expense.price, 0)
  );

  const totalExpenses = computed(() => totalAlex.value + totalChristiane.value);

  const alexPercentage = computed(() =>
      totalExpenses.value ? (totalAlex.value / totalExpenses.value) * 100 : 0
  );
  const christianePercentage = computed(() =>
      totalExpenses.value ? (totalChristiane.value / totalExpenses.value) * 100 : 0
  );

  return {
    expenses,
    addExpense,
    fetchExpenses,
    alexExpenses,
    christianeExpenses,
    totalAlex,
    totalChristiane,
    totalExpenses,
    alexPercentage,
    christianePercentage,
  };
});
