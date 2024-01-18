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

    job?.processTable.map((row, rowIndex) => {
      {
        row.processTableData.map((item, index) => {
          // console.log(item);
        });
      }
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Create HTML content for the PDF using the job data
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="mr">
    <head>
   <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@300&family=Poppins:wght@100;200;300;400;600;700&family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
    /* Add your CSS styles here */
    @page {
      size: legal landscape; /* Set the page size to A4 landscape */
      margin: 10mm 20mm;     
    }
    body {
     
      text-align: center; /* Center-align the content horizontally */
     
            font-family: 'Noto Serif Devanagari', 'Poppins', 'Roboto Condensed', sans-serif;
font-family: 'Poppins', sans-serif;
      font-family: 'Roboto Condensed', sans-serif;
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
                    const idleCode = row.processTableData[index]?.idleCode;
                    let displayIdleCode = idleCode;
                    if (idleCode === "No Power (Electricity)") {
                      displayIdleCode = "1";
                    } else if (idleCode === "Drawing Issue") {
                      displayIdleCode = "2";
                    } else if (idleCode === "Weekly Off") {
                      displayIdleCode = "3";
                    } else if (idleCode === "Material Issue") {
                      displayIdleCode = "4";
                    } else if (idleCode === "No Crane (Electricity)") {
                      displayIdleCode = "5";
                    } else if (idleCode === "No Air (Electricity)") {
                      displayIdleCode = "6";
                    } else if (
                      idleCode ===
                      "Stores - Collection of Tools/Drags/Instruments/Gauges etc (Electricity)"
                    ) {
                      displayIdleCode = "7";
                    } else if (idleCode === "Minor Machine Breakdown") {
                      displayIdleCode = "8";
                    } else if (
                      idleCode === "Waiting for dicision (Electricity)"
                    ) {
                      displayIdleCode = "9";
                    } else if (
                      idleCode === "Discountinue current load (Electricity)"
                    ) {
                      displayIdleCode = "10";
                    } else if (idleCode === "Availability of Co worker load") {
                      displayIdleCode = "11";
                    } else if (idleCode === "Operator Absent/ Late mark") {
                      displayIdleCode = "12";
                    } else if (idleCode === "No Load/ No Plan") {
                      displayIdleCode = "13";
                    } else if (
                      idleCode === "Rework during Operations (Electricity)"
                    ) {
                      displayIdleCode = "14";
                    } else if (idleCode === "Planned Maintainance") {
                      displayIdleCode = "15";
                    } else if (idleCode === "Unskilled operator on machine") {
                      displayIdleCode = "16";
                    } else if (
                      idleCode === "Use of Worm out tooling/ Tooling problem"
                    ) {
                      displayIdleCode = "17";
                    } else if (
                      idleCode ===
                      "Stores - Collection of Tools/Drags/Instruments/Gauges etc (Electricity)"
                    ) {
                      displayIdleCode = "18";
                    } else if (
                      idleCode ===
                      "Searching and collecting componenet to be loaded"
                    ) {
                      displayIdleCode = "19";
                    } else if (
                      idleCode ===
                      "Operator shifted for other work during operations"
                    ) {
                      displayIdleCode = "20";
                    } else if (idleCode === "Operator not allocated") {
                      displayIdleCode = "21";
                    } else if (idleCode === "Process Deviation") {
                      displayIdleCode = "22";
                    } else if (idleCode === "Maintenance Team Availability") {
                      displayIdleCode = "23";
                    } else if (idleCode === "Inspection on Machine") {
                      displayIdleCode = "24";
                    }

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
                    <td style="width: 80px;">${displayIdleCode}</td>
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
         <div class="table-container" style="margin-top:10px">
       <table>
  <tr>
    <td style="text-align: left;">1. No Power (Electricity)</td>
    <td style="text-align: left;">5. No Crane (Electricity)</td>
    <td style="text-align: left;">9. Waiting for dicision (Electricity)</td>
    <td style="text-align: left;">13. No Load/ No Plan</td>
    <td style="text-align: left;">17. Use of Worm out tooling/ Tooling problem</td>
    <td style="text-align: left;">21. Operator not allocated</td>
  </tr>
  <tr>
    <td style="text-align: left;">2. Drawing Issue</td>
    <td style="text-align: left;">6. No Air (Electricity)</td>
    <td style="text-align: left;">10. Discountinue current load (Electricity)</td>
    <td style="text-align: left;">14. Rework during Operations (Electricity)</td>
    <td style="text-align: left;">18. Stores - Collection of Tools/Drags/Instruments/Gauges etc (Electricity)</td>
    <td style="text-align: left;">22. Process Deviation</td>
  
  </tr>
  <tr>
    <td style="text-align: left;">3. Weekly Off</td>
    <td style="text-align: left;">7. Stores - Collection of Tools/Drags/Instruments/Gauges etc (Electricity)</td>
    <td style="text-align: left;">11. Availability of Co worker load</td>
    <td style="text-align: left;">15. Planned Maintainance</td>
    <td style="text-align: left;">19. Searching and collecting componenet to be loaded</td>
    <td style="text-align: left;">23. Mentance Team Availability</td>
    </tr>
  <tr>
    <td style="text-align: left;">4. Material Issue</td>
    <td style="text-align: left;">8. Minor Machine Breakdown</td>
    <td style="text-align: left;">12. Operator Absent/ Late mark</td>
    <td style="text-align: left;">16. Unskilled operator on machine</td>
    <td style="text-align: left;">20. Operator shifted for other work during operations </td>
    <td style="text-align: left;">24. Inspection on Machine</td>
  
    
  </tr>
</table>
</div>
    </body>
    </html>
    `;

    // const browser = await puppeteer.launch({
    //   headless: false, // Set to true for production
    //   executablePath: path.join(
    //     "C:",
    //     "Program Files",
    //     "Google",
    //     "Chrome",
    //     "Application",
    //     "chrome.exe"
    //   ),
    //   args: ["--no-sandbox", "--disabled-setupid-sandbox"],
    //   ignoreDefaultArgs: ["--disable-extensions"],
    //   // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    // });
    // const page = await browser.newPage();
    // // Set content and wait for rendering
    // await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    // // Generate PDF
    // const pdfBuffer = await page.pdf();
    // // Close the browser
    // await browser.close();
    // // Set response headers
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename="job_process_sheet.pdf"`
    // );
    // // Send the PDF as a response
    // res.send(pdfBuffer);
    // console.log("PDF successfully generated and sent");
    // Generate the PDF

    // const uniqueIdentifier = uuidv4();
    // const filename = `job${uniqueIdentifier}.pdf`;

    // pdf
    //   .create(htmlContent, { format: "Letter" })
    //   .toFile(filename, (err, response) => {
    //     if (err) {
    //       console.log(err);

    //       res.status(500).send("Error generating PDF");
    //     } else {
    //       // Send the generated PDF as a response
    //       res.setHeader(
    //         "Content-disposition",
    //         `attachment; filename=${filename}`
    //       );
    //       res.setHeader("Content-type", "application/pdf");
    //       const fileStream = fs.createReadStream(filename);
    //       fileStream.pipe(res);

    // Optionally, you can delete the file after sending it
    // fs.unlink(filename, (err) => {
    //   if (err) {
    //     console.error("Error deleting PDF file:", err);
    //   } else {
    //     console.log("PDF file deleted");
    //   }
    // });
    // }
    // });

    const options = { format: "A4", margin: "10mm" };
    // Generate PDF
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
