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
    console.log(job.processTable);
    job?.processTable.map((row, rowIndex) => {
      {
        row.processTableData.map((item, index) => {
          console.log(item);
        });
      }
    });
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
      size: legal landscape; /* Set the page size to A4 landscape */
      margin: 10mm 20mm;     
    }
    body {
     
      text-align: center; /* Center-align the content horizontally */
      font-family: font-family: 'Montserrat', sans-serif;
     
    }
   


    table {
      border-collapse: collapse;
      width: 100%;
      font-family:'Montserrat', sans-serif;
     
    }

    th, td {
      border: 1px solid black;
     
      padding-top : 2px;
      padding-bottom:2px;
      text-align: left;
      font-size: 10px;
      font-family: 'Montserrat', sans-serif; 
     
    }

    th {
      background-color: #f2f2f2;
     
    }
  </style>
    </head>
    <body>
      <div class="box">
      <h2 style="font-family: 'Montserrat', sans-serif;">Quality Engineering CO.</h2>
<p style="font-family: 'Montserrat', sans-serif;">Gat.No.317,Pune-Saswad Road,Opp.Palkhi Visawa,Tal-Purander, Zendewadi,Pune-412-301</p>
<h3 style="font-family: 'Montserrat', sans-serif;">Job Process Sheet</h3>

        <div class="table-container">
          <table>
            <tbody>
              <tr>
               <td style="text-align: left;">SO/Wo No</td>
<td style="text-align: left;">${job?.soWo}</td>
<td style="text-align: left;">Prod.Order No : ${job?.prodOrderNo}</td>

               
                <td >WO Date : ${format(
                  new Date(job?.woDate),
                  "dd/MM/yyyy"
                )}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total CT : ${
      job?.estimatedtotalCT
    }</td>
               
              </tr>
              <tr>
                <td>Job Name</td>
                <td colspan="2">${job?.jobName}</td>
                <td colspan="2">PO No : ${job?.poNo}</td>
               
                
              </tr>
              <tr>
                <td>Drag No</td>
                <td colspan="2">${job?.dragNo}</td>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container" style="margin-top: 2rem;">
  <table>
    <tbody>
      <tr>
        <th style="text-align: left;">अ.क्र.</th>
        <th style="text-align: left;">महत्वाच्या सूचना</th>
        <th style="text-align: left;">टिक मार्क</th>
        <th style="text-align: left;">सही व दिनांक</th>
      </tr>
       <tr>
        <td style="text-align: left;">१</td>
        <td style="text-align: left;">जॉबचा प्रोसेस चार्ट बनविण्यापूर्वी, त्याच्या शक्य त्या साईजेस चेक करून घेणे.</td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
      </tr>
      <tr>
        <td style="text-align: left;">२</td>
        <td style="text-align: left;">जॉब तोड करण्यापूर्वी ड्रॉईंग आणि प्रोसेस चार्ट प्रोडक्शन इन्चार्जन सुपरवायजरला समजावून सांगणे.</td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
      </tr>
      <tr>
        <td style="text-align: left;">३</td>
        <td style="text-align: left;">जॉब तोड करण्यापूर्वी ड्रॉइंग आणि प्रोसेस चार्ट सुपरवायजरने मशीन ऑपरेटरला समजावून सांगणे.</td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
      </tr>
     
    </tbody>
  </table>
</div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th style="width: 400px;">Process</th>
                <th style="width: 200px;">Description</th>
                <th style="width: 400px;">Machine Name</th>
                <th style="width: 400px;">Tooling Used</th>
                <th style="width: 80px;">DC</th>
                
                <th style="width: 50px;">Feed</th>
                <th style="width: 50px;">CT(min)</th>
                <th style="width: 50px;">Start Date</th>
                <th style="width: 50px;">Start Time</th>
                <th style="width: 50px;">End Date</th>
                <th style="width: 50px;">End Time</th>
                <th style="width: 50px;">Ideal Code</th>
                
                <th style="width: 50px;">Start Time</th>
                
                <th style="width: 50px;">End Time</th>
                
              </tr>
            </thead>
           
              
              ${job?.processTable.map((row, rowIndex) => {
                return `
                <tr>
                <td>${rowIndex + 1}</td>
                  <td>${row.processName}</td>
                  <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        <td style="text-align: left;"></td>
        
       
                </tr>
                ${row.processTableData
                  .map((item, index) => {
                    return `
                    
                    <tr>
                      <td>${index + 1}</td>
                      <td>${row.processTableData[index]?.process}</td>
                      <td>${row.processTableData[index]?.description}</td>
                      <td>${row.processTableData[index]?.machineName}</td>
                      <td>${row.processTableData[index]?.toolingUsed}</td>
                      <td style="width: 80px;">${
                        row.processTableData[index]?.dc
                      }</td>
                      <td style="width: 80px;">${
                        row.processTableData[index]?.feed
                      }</td>
                      <td style="width: 80px;">${row.processTableData[
                        index
                      ]?.actualCT.toFixed(2)}</td>
                    <td style="width: 50px;">${format(
                      new Date(row.processTableData[index]?.startDate),
                      "dd/MM/yyyy"
                    )}</td>
                    <td style="width: 80px;">${
                      row.processTableData[index]?.startTime
                    }</td>
                    <td style="width: 80px;">${format(
                      new Date(row.processTableData[index]?.endDate),
                      "dd/MM/yyyy"
                    )}</td>
                    <td style="width: 80px;">${
                      row.processTableData[index]?.endTime
                    }</td>
                    <td style="width: 80px;">${
                      row.processTableData[index]?.idleCode
                    }</td>
                    <td style="width: 80px;">${
                      row.processTableData[index]?.startTime1
                    }</td>
                    <td style="width: 80px;">${
                      row.processTableData[index]?.endTime1
                    }</td>

                      
                    </tr>
                  `;
                  })

                  .join("")}
              `;
              })}
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
