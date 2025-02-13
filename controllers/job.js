import { Job } from "../models/job.js";
// import pdf from "html-pdf";
import fs from "fs";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import puppeteer from "puppeteer";
import { executablePath } from "puppeteer";
import pdf from "html-pdf-node";
import path from "path";
export const createJob = async (req, res) => {
  try {
    const {
      soWo,
      prodOrderNo,
      woDate,
      estimatedtotalCT,
      actualtotalCT,
      jobName,
      poNo,
      dragNo,
      processTable,
    } = req.body;
    const user = req.user._id;

    const newJob = await Job.create({
      soWo,
      prodOrderNo,
      woDate,
      estimatedtotalCT,
      actualtotalCT,
      jobName,
      poNo,
      dragNo,
      user,
      processTable,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      Job: newJob,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      dragNo,
      jobName,
      poNo,
      processTable,
      prodOrderNo,
      soWo,
      estimatedtotalCT,
      actualtotalCT,
      woDate,
    } = req.body;

    // Create an object with the properties you want to update
    const updatedJobData = {
      dragNo,
      jobName,
      poNo,
      processTable,
      prodOrderNo,
      soWo,
      estimatedtotalCT,
      actualtotalCT,
      woDate,
    };

    // Find and update the job by its ID
    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedJobData, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ success: true, updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find and delete the job by its ID
    const deletedJob = await Job.findByIdAndRemove(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully", deletedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const viewJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find and delete the job by its ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Job found successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, error: error.message });
  }
};

export const getAllJob = async (req, res) => {
  try {
    // const userId = req.query.userId;

    // const jobs = await Job.find({ user: userId }); // Find jobs associated with the user ID
    const jobs = await Job.find();
    res
      .status(200)
      .json({ success: true, message: "Jobs found successfully", jobs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: true, error: error.message });
  }
};

export const generatePdf = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Fetch job data from the database (you can use Mongoose or your preferred ORM)
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@300&family=Poppins:wght@100;200;300;400;600;700&family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: 14in 8.5in landscape; /* Force Legal landscape size */
            margin: 1mm;
          }
          body {
            font-family: 'Poppins', sans-serif;
            text-align: center;
            width: 100%;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
            font-size: 10px;
          }
          th {
            background-color: #f2f2f2;
          }
          .header-table td {
            border: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Girme Technologies PVT LTD.</h2>
          <p>Gat No.317, Pune-Saswad Road, Opp. Palkhi Visawa, Tal.-Purandar, Zendewadi, Pune-412301</p>
          <h3>JOB PROCESS SHEET</h3>
          <table class="header-table">
            <tr>
              <td>SO/WO No: ${job?.soWo}</td>
              <td>Pro Ord No: ${job?.prodOrderNo}</td>
              <td>W.O.Date: ${format(new Date(job?.woDate), "dd/MM/yyyy")}</td>
              <td>Total CT (Min): ${job?.estimatedtotalCT}</td>
            </tr>
            <tr>
              <td>Job Name: ${job?.jobName}</td>
              <td>PO No: ${job?.poNo}</td>
              <td colspan="2"></td>
            </tr>
            <tr>
              <td>Drg No: ${job?.dragNo}</td>
              <td colspan="3"></td>
            </tr>
          </table>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Processes</th>
                <th>Description</th>
                <th>Machine Name</th>
                <th>Tooling Used</th>
                <th>DC</th>
                <th>Feed</th>
                <th>CT (Min)</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Idle Code</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              ${job?.processTable
                .map(
                  (row, rowIndex) => `
                <tr>
                  <td>${rowIndex + 1}</td>
                  <td>${row.processName}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                ${row.processTableData
                  .map(
                    (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.process}</td>
                    <td>${item.description}</td>
                    <td>${item.machineName}</td>
                    <td>${item.toolingUsed}</td>
                    <td>${item.dc}</td>
                    <td>${item.feed}</td>
                    <td>${item.actualCT.toFixed(2)}</td>
                    <td>${format(new Date(item.startDate), "dd/MM/yyyy")}</td>
                    <td>${item.startTime}</td>
                    <td>${format(new Date(item.endDate), "dd/MM/yyyy")}</td>
                    <td>${item.endTime}</td>
                    <td>${item.idleCode}</td>
                    <td>${item.startTime1}</td>
                    <td>${item.endTime1}</td>
                  </tr>
                `
                  )
                  .join("")}
              `
                )
                .join("")}
            </tbody>
          </table>
          <table class="idle-codes">
            <tr>
              <td>1. No Power (Electricity)</td>
              <td>5. No Crane</td>
              <td>9. Waiting for Decision</td>
              <td>13. No Load/No Plan</td>
              <td>17. Use of Worn out Tooling/Tooling Problem</td>
              <td>21. Operator not allocated</td>
            </tr>
            <tr>
              <td>2. Drawing Issue</td>
              <td>6. No Air</td>
              <td>10. Discontinue current load</td>
              <td>14. Rework during Operations</td>
              <td>18. Stores - Collection of Tools/Drags/Instruments/Gauges etc (Electricity)</td>
              <td>22. Process Deviation</td>
            </tr>
            <tr>
              <td>3. Weekly Off</td>
              <td>7. Stores - Collection of Tools/Drags/Instruments/Gauges etc</td>
              <td>11. Availability of Co worker load</td>
              <td>15. Planned Maintenance</td>
              <td>19. Searching and collecting component to be loaded</td>
              <td>23. Maintenance Team Availability</td>
            </tr>
            <tr>
              <td>4. Material Issue</td>
              <td>8. Minor Machine Breakdown</td>
              <td>12. Operator Absent/Late mark</td>
              <td>16. Unskilled operator on machine</td>
              <td>20. Operator shifted for other work during operations</td>
              <td>24. Inspection on Machine</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const options = {
      width: "14in", // Explicitly set Legal width
      height: "8.5in", // Explicitly set Legal height
      printBackground: true, // Ensures backgrounds are printed
      margin: { top: "1mm", right: "1mm", bottom: "1mm", left: "1mm" }, // Set margins
      preferCSSPageSize: true, // Ensures CSS page size is used
    };

    const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="job_process_sheet.pdf"`
    );
    // Send the PDF as a response
    res.send(pdfBuffer);
    console.log("PDF successfully generated and sent");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reports
export const generateReport = async (req, res) => {
  try {
    // Fetch jobs from the database
    const jobs = await Job.find();
    // Calculate the report based on the comparison logic
    const report = jobs.map((job) => {
      const { actualtotalCT, estimatedtotalCT, ...otherFields } = job._doc;
      return {
        ...otherFields,
        isGreaterThan: actualtotalCT > estimatedtotalCT,
      };
    });

    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const copyJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { count } = req.body; // assuming count is passed in the request body
    console.log("jobId", id);
    const user = req.user._id;

    const originalJob = await Job.findById(id);

    if (!originalJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const duplicatedJobs = [];

    for (let i = 0; i < count; i++) {
      // Create a new job with the same details as the original job
      const newJob = await Job.create({
        soWo: originalJob.soWo,
        prodOrderNo: originalJob.prodOrderNo,
        woDate: originalJob.woDate,
        estimatedtotalCT: originalJob.estimatedtotalCT,
        actualtotalCT: originalJob.actualtotalCT,
        jobName: originalJob.jobName,
        poNo: originalJob.poNo,
        dragNo: originalJob.dragNo,
        user: user,
        processTable: originalJob.processTable,
      });
      duplicatedJobs.push(newJob);
    }

    console.log("duplicatedJobs", duplicatedJobs);

    res.status(201).json({
      success: true,
      message: `Job duplicated ${count} times successfully`,
      Jobs: duplicatedJobs,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
