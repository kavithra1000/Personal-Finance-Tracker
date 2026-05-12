import * as transactionService from "../services/transaction.service.js";

const ERROR_MAP = {
  TRANSACTION_NOT_FOUND: { status: 404, error: "Transaction not found" },
  NOT_AUTHORIZED:        { status: 401, error: "Not authorized to perform this action" },
};

const handleError = (res, err) => {
  const known = ERROR_MAP[err.message];
  if (known) return res.status(known.status).json({ success: false, error: known.error });

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, error: messages });
  }

  console.error(err);
  return res.status(500).json({ success: false, error: "Server Error" });
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.addTransaction(req.user._id, req.body);
    return res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user._id, req.query);
    return res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.user._id, req.params.id, req.body);
    return res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    return handleError(res, err);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.user._id, req.params.id);
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return handleError(res, err);
  }
};