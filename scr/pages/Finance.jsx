import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatCard from "../components/StatCard";
import AddTransactionDialog from "../components/AddTransactionDialog";
import TransactionList from "../components/TransactionList";
import EmotionalBreakdown from "../components/EmotionalBreakdown";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Finance() {
  const [showAdd, setShowAdd] = useState(false);

  const { data: transactions = [], refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => base44.entities.Transaction.list("-created_date", 200),
  });

  const income = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, t) => s + (t.amount || 0), 0);
  const safeToSpend = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Financial
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Reality</h1>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-mode-money hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Total Income"
            value={`$${totalIncome.toLocaleString()}`}
            icon={TrendingUp}
            colorClass="text-mode-money"
          />
          <StatCard
            label="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            colorClass="text-destructive"
          />
          <StatCard
            label="Safe to Spend"
            value={`$${safeToSpend.toLocaleString()}`}
            icon={ShieldCheck}
            colorClass={
              safeToSpend >= 0 ? "text-mode-money" : "text-destructive"
            }
            sublabel="remaining balance"
          />
          <StatCard
            label="Transactions"
            value={transactions.length}
            icon={Wallet}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} onUpdate={refetch} />
        </div>
        <EmotionalBreakdown transactions={expenses} />
      </div>

      <AddTransactionDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={refetch}
      />
    </div>
  );
}
