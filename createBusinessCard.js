const { cmyk, PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");
const axios = require("axios");

// const pdfUtils = require("./pdf-utils");
const DISTANCE_PER_MM = 2.835;
const PAGE_WIDTH = 88.9;
const PAGE_HEIGHT = 50.8;

const horizontalGutter = 12.9;
const verticalStartOffset = 168.2;
const verticalLineOffset = 7.5;
const plan_policyYoffset = 14.6;

const pageBoundsWidth = PAGE_WIDTH - 2 * horizontalGutter;
const rightSideTextXOffset = 107.6;
const rightSideTextWidth =
  PAGE_WIDTH - rightSideTextXOffset - horizontalGutter - 9;
const leftSideTextXOffset = horizontalGutter;
const leftSideTextWidth = rightSideTextWidth;

const createCard = async (
  firstName,
  lastName,
  email,
  company,
  companyWebsite,
  phone,
  userId
) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const firstPage = await pdfDoc.addPage([
      PAGE_WIDTH * DISTANCE_PER_MM,
      PAGE_HEIGHT * DISTANCE_PER_MM,
    ]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const emailImageBytes = fs.readFileSync("./email.png");
    const phoneImageBytes = fs.readFileSync("./telephone.png");
    const websiteImageBytes = fs.readFileSync("./website.png");
    const companyImageBytes = fs.readFileSync("./company.png");
    const ownerImageBytes = fs.readFileSync("./owner.png");

    const result = await axios.get(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${companyWebsite}&color=0-125-112`,
      { responseType: "arraybuffer" }
    );
    const qrCodeImage = await pdfDoc.embedPng(result.data);
    const emailImage = await pdfDoc.embedPng(emailImageBytes);
    const phoneImage = await pdfDoc.embedPng(phoneImageBytes);
    const websiteImage = await pdfDoc.embedPng(websiteImageBytes);
    const companyImage = await pdfDoc.embedPng(companyImageBytes);
    const ownerImage = await pdfDoc.embedPng(ownerImageBytes);

    const ownerDims = ownerImage.scale(0.2);
    firstPage.drawImage(ownerImage, {
      x: -10 * DISTANCE_PER_MM,
      y: -3 * DISTANCE_PER_MM,
      width: ownerDims.width,
      height: ownerDims.height,
      opacity: 0.1,
    });

    const QrDims = qrCodeImage.scale(0.4);
    firstPage.drawImage(qrCodeImage, {
      x: 60 * DISTANCE_PER_MM,
      y: 22 * DISTANCE_PER_MM,
      width: QrDims.width,
      height: QrDims.height,
    });

    firstPage.drawText(firstName, {
      x: 10 * DISTANCE_PER_MM,
      y: 36 * DISTANCE_PER_MM,
      size: 24,
      color: cmyk(0, 0, 0, 1),
    });

    firstPage.drawText(lastName, {
      x: 10 * DISTANCE_PER_MM,
      y: 28 * DISTANCE_PER_MM,
      size: 24,
      color: cmyk(0, 0, 0, 1),
    });

    const companylDims = companyImage.scale(0.15);
    firstPage.drawImage(companyImage, {
      x: 10 * DISTANCE_PER_MM,
      y: 19.2 * DISTANCE_PER_MM,
      width: companylDims.width,
      height: companylDims.height,
    });
    firstPage.drawText(company, {
      x: 15 * DISTANCE_PER_MM,
      y: 20 * DISTANCE_PER_MM,
      size: 9,
      color: cmyk(0, 0, 0, 1),
    });

    const emailDims = emailImage.scale(0.15);
    firstPage.drawImage(emailImage, {
      x: 10 * DISTANCE_PER_MM,
      y: 14.2 * DISTANCE_PER_MM,
      width: emailDims.width,
      height: emailDims.height,
    });

    firstPage.drawText(email, {
      x: 15 * DISTANCE_PER_MM,
      y: 15 * DISTANCE_PER_MM,
      size: 9,
      color: cmyk(0, 0, 0, 1),
    });
    const phoneDims = phoneImage.scale(0.15);
    firstPage.drawImage(phoneImage, {
      x: 10 * DISTANCE_PER_MM,
      y: 9.2 * DISTANCE_PER_MM,
      width: phoneDims.width,
      height: phoneDims.height,
    });

    firstPage.drawText(phone, {
      x: 15 * DISTANCE_PER_MM,
      y: 10 * DISTANCE_PER_MM,
      size: 9,
      color: cmyk(0, 0, 0, 1),
    });

    const websiteDims = websiteImage.scale(0.15);
    firstPage.drawImage(websiteImage, {
      x: 10 * DISTANCE_PER_MM,
      y: 4.2 * DISTANCE_PER_MM,
      width: websiteDims.width,
      height: websiteDims.height,
    });
    firstPage.drawText(companyWebsite, {
      x: 15 * DISTANCE_PER_MM,
      y: 5 * DISTANCE_PER_MM,
      size: 9,
      color: cmyk(0, 0, 0, 1),
    });

    const secondPage = await pdfDoc.addPage([
      PAGE_WIDTH * DISTANCE_PER_MM,
      PAGE_HEIGHT * DISTANCE_PER_MM,
    ]);
    secondPage.drawImage(ownerImage, {
      x: secondPage.getWidth() - (ownerDims.width * 5) / 6,
      y: -3 * DISTANCE_PER_MM,
      width: ownerDims.width,
      height: ownerDims.height,
      opacity: 0.2,
    });

    const firstNameWidth = helveticaFont.widthOfTextAtSize(firstName, 28);
    secondPage.drawText(firstName, {
      x: secondPage.getWidth() / 2 - firstNameWidth / 2,
      y: 32 * DISTANCE_PER_MM,
      size: 28,
      color: cmyk(0, 0, 0, 1),
      font: helveticaFont,
    });

    const larstNameWidth = helveticaFont.widthOfTextAtSize(lastName, 28);
    secondPage.drawText(lastName, {
      x: secondPage.getWidth() / 2 - larstNameWidth / 2,
      y: 18 * DISTANCE_PER_MM,
      size: 28,
      color: cmyk(0, 0, 0, 1),
      font: helveticaFont,
    });

    const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
    return pdfBytes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createCard;
