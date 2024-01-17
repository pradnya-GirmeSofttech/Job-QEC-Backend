import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    soWo: {
      type: Number,
      required: true,
    },
    prodOrderNo: {
      type: Number,
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
        processName: {
          type: String,
          required: true,
        },
        processTableData: [
          {
            process: {
              type: String,
            },
            description: {
              type: String,
            },
            machineName: {
              type: String,
            },
            toolingUsed: {
              type: String,
            },
            toolingSize: {
              type: String,
              // required: true,
            },
            dia: {
              type: String,
              // required: true,
            },
            length: {
              type: Number,
              // required: true,
            },
            width: {
              type: Number,
              // required: true,
            },
            dc: { type: Number },
            mr: { type: Number },
            nop: { type: Number },
            fpp: { type: Number },
            feed: { type: Number },
            rpm: { type: Number },
            noh: { type: Number },
            estimatedHrs: {
              type: Number,
            },
            estimatedCT: {
              type: Number,
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
              type: [String],
              default: [], // Set default value to an empty array
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
            remark: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
