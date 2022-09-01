const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    line_items: [
      {
        item_id: {
          type: String,
          required: true,
        },
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
