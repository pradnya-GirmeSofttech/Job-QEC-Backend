import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    soWo: {
      type: Number,
      required: true,
    },
    prodOrderNo: {
      type: Number,
      required: true,
    },

    estimatedtotalCT: {
      type: Number,
      required: true,
    },
    actualtotalCT: {
      type: Number,
    },
    jobName: {
      type: String,
      required: true,
    },
    woDate: {
      type: Date,
      required: true,
    },
    poNo: {
      type: Number,
      required: true,
    },
    dragNo: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: true,
    },
    processTable: [
      {
        process: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        machineName: {
          type: String,
          required: true,
        },
        toolingUsed: {
          type: [String],
          required: true,
        },
        length: {
          type: Number,
          required: true,
        },
        width: {
          type: Number,
          required: true,
        },
        dc: { type: Number, required: true },
        feed: { type: Number, required: true },
        estimatedCT: {
          type: Number,
          required: true,
        },
        actualCT: {
          type: Number,
        },
        startDate: {
          type: Date,
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },

        endDate: {
          type: Date,
        },
        idleCode: {
          type: String,
        },
        startDate1: {
          type: Date,
        },
        startTime1: {
          type: String,
        },
        endTime1: {
          type: String,
        },

        endDate1: {
          type: Date,
        },
        userName: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
