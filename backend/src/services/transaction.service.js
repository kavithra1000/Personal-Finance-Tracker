import Transaction from "../models/transaction.model.js";

// ── Add transaction ───────────────────────────────────────────────────────────

export const addTransaction = async (userId, { title, amount, type, category, date, note }) => {
  const transaction = await Transaction.create({
    user: userId,
    title,
    amount,
    type,
    category,
    date,
    note,
  });

  return transaction;
};

// ── Get all transactions ──────────────────────────────────────────────────────

export const getTransactions = async (userId, { startDate, endDate, category, type } = {}) => {
  const query = { user: userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate)   query.date.$lte = new Date(endDate);
  }

  if (category) query.category = category;
  if (type)     query.type     = type;

  const transactions = await Transaction.find(query)
    .populate("category", "name icon color")
    .sort({ date: -1 });

  return transactions;
};

// ── Update transaction ────────────────────────────────────────────────────────

export const updateTransaction = async (userId, transactionId, updateData) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error("TRANSACTION_NOT_FOUND");
  }

  if (transaction.user.toString() !== userId.toString()) {
    throw new Error("NOT_AUTHORIZED");
  }

  const updated = await Transaction.findByIdAndUpdate(transactionId, updateData, {
    new:           true,
    runValidators: true,
  });

  return updated;
};

// ── Delete transaction ────────────────────────────────────────────────────────

export const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error("TRANSACTION_NOT_FOUND");
  }

  if (transaction.user.toString() !== userId.toString()) {
    throw new Error("NOT_AUTHORIZED");
  }

  await transaction.deleteOne();
};