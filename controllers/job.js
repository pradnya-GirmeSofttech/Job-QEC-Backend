import { Job } from "../models/job.js";
import pdf from "html-pdf";
import fs from "fs";
import { format } from "date-fns";
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
    console.error(error);
    res.status(500).json({ success: true, error: error.message });
  }
};

export const generatePdf = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("backend", jobId);

    // Fetch job data from the database (you can use Mongoose or your preferred ORM)
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create HTML content for the PDF using the job data
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    /* Add your CSS styles here */
    @page {
      size: A4 landscape; /* Set the page size to A4 landscape */
      margin: 10mm 20mm;
    }
    body {
      text-align: center; /* Center-align the content horizontally */
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid black;
      padding: 8px;
      text-align: center;
      font-size: 10px;
    }

    th {
      background-color: #f2f2f2;
    }
  </style>
    </head>
    <body>
      <div class="box">
      <h2>Quality Engineering CO.</h2>
      <p>Gat.No.317,Pune-Saswad Road,Opp.Palkhi Visawa,Tal-Purander, Zendewadi,Pune-412-301</p>
      <h3>Job Process Sheet</h3>
        <div class="table-container">
          <table>
            <tbody>
              <tr>
                <td >SO/Wo No</td>
                <td >${job?.soWo}</td>
                <td >Prod.Order No</td>
                <td >${job?.prodOrderNo}</td>
                <td >WO Date</td>
                <td >${format(new Date(job?.woDate), "dd/MM/yyyy")}</td>
              </tr>
              <tr>
                <td >Job Name</td>
                <td colspan="1">${job?.jobName}</td>
                <td >PO No</td>
                <td >${job?.poNo}</td>
                <td>Total CT</td>
                <td>${job?.estimatedtotalCT}</td>
              </tr>
              <tr>
                <td>Drag No</td>
                <td>${job?.dragNo}</td>
                <td colspan="4"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container" style="margin-top: 4rem;">
          <table  >
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Process</th>
                <th>Description</th>
                <th>Machine Name</th>
                <th>Tooling Used</th>
                <th>DC</th>
                
                <th>Feed</th>
                <th>CT(min)</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Ideal Code</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                
              </tr>
            </thead>
            <tbody>
          
              
              ${job?.processTable.map((row, rowIndex) => {
                return `<tr style="font-size: 1px;">
                    <td>${rowIndex + 1}</td>
                    <td>${row.process}</td>
                    <td>${row.description}</td>
                    <td>${row.machineName}</td>
                    <td> ${row.toolingUsed.map(
                      (item) => `<ul >
                      <li style="list-style-type: none;">${item}</li>
                      
                    </ul>`
                    )}</td>
                    <td>${row.dc}</td>
                   
                    <td>${row.feed}</td>
                    <td>${row.actualCT}</td>
                    <td>${format(new Date(row?.startDate), "dd/MM/yyyy")}</td>
                    <td>${row.startTime}</td>
                    <td>${format(new Date(row?.endDate), "dd/MM/yyyy")}</td>
                    <td>${row.endTime}</td>
                    <td>${row.idleCode}</td>
                    <td>${format(new Date(row?.startDate), "dd/MM/yyyy")}</td>
                    <td>${row.startTime}</td>
                    <td>${format(new Date(row?.startDate), "dd/MM/yyyy")}</td>
                    <td>${row.endTime}</td>
                    
                  </tr>`;
              })}
                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    
    `;

    // Generate the PDF
    pdf
      .create(htmlContent, { format: "Letter" })
      .toFile("output.pdf", (err, response) => {
        if (err) {
          res.status(500).send("Error generating PDF");
        } else {
          // Send the generated PDF as a response
          res.setHeader("Content-disposition", "attachment; filename=job.pdf");
          res.setHeader("Content-type", "application/pdf");
          const fileStream = fs.createReadStream("output.pdf");
          fileStream.pipe(res);
        }
      });
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
