const userName = document.getElementById("name");
const domain = document.getElementById("domain");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb } = PDFLib;

// Capitalize function
const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

// Event listener for the submit button
submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);
  const domainVal = domain.value;

  // Check if the text is empty or not
  if (val.trim() !== "" && domainVal !== "" && userName.checkValidity()) {
    generatePDF(val, domainVal);
  } else {
    userName.reportValidity();
    domain.reportValidity();
  }
});

// Function to generate the PDF
const generatePDF = async (name, domain) => {
  const existingPdfBytes = await fetch("Offer Letter.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load the existing PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  // Get custom font
  const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed the custom font in the document
  const SanChezFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the PDF document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the current date and time
  const now = new Date();
  const currentDate = now.toLocaleDateString();  // e.g., '9/9/2024, 4:56:10 PM'

  // Draw the user's name on the PDF
  firstPage.drawText(name, {
    x: 71,
    y: 645,
    size: 20,
    font: SanChezFont,
    color: rgb(0, 0, 0), // Black color
  });

  // Draw the domain on the PDF
  firstPage.drawText(`Domain: ${domain}`, {
    x: 71,
    y: 620,
    size: 15,
    font: SanChezFont,
    color: rgb(0, 0, 0), // Black color
  });

  // Draw the current time on the PDF
  firstPage.drawText(currentDate, {
    x: 100,
    y: 735,
    size: 15,
    font: SanChezFont,
    color: rgb(0, 0, 0), // Black color
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  // Create a new PDF file and trigger the download
  var file = new File(
    [pdfBytes],
    "Offer Letter.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
  saveAs(file);
};
