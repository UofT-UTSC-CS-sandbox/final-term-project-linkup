const { PDFDocument, rgb } = require('pdf-lib');

// Function to remove name and contact information from resume 
async function blurPDF(buffer) {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
        const { width, height } = page.getSize();
        // Draws multiple semi-transparent rectangles to create a noise effect
        for (let i = 0; i < 5; i++) { 
            page.drawRectangle({
                x: 0,
                y: height * 0.89 - (i * 2), 
                width: width,
                height: height * 0.2, // Covering top 20% of the page
                color: rgb(1, 1, 1), // white color
                opacity: 0.9 // Semi-transparent
            });
        }
    });

    return pdfDoc.save();
}

// Endpoint to serve blurred files from GridFS
const displayResumes = (gfsBucket) => {
    return async (req, res) => {
        const { filename } = req.params;

        gfsBucket.find({ filename }).toArray(async (err, files) => {
            if (err) {
                console.error('Error finding file:', err);
                return res.status(500).json({ error: 'Error finding file' });
            }

            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }

            const file = files[0];
            if (file.contentType === 'application/pdf' || file.filename.endsWith('.pdf')) {
                res.setHeader('Content-Type', 'application/pdf');
                const readstream = gfsBucket.openDownloadStreamByName(filename);
                let data = [];
                readstream.on('data', (chunk) => {
                    data.push(chunk);
                });
                readstream.on('end', async () => {
                    const buffer = Buffer.concat(data);
                    const blurredBuffer = await blurPDF(buffer);
                    res.end(blurredBuffer);
                });
                readstream.on('error', () => {
                    res.status(500).json({ error: 'Error streaming file' });
                });
            } else {
                res.status(400).json({ error: 'Not a PDF file' });
            }
        });
    };
};

module.exports = displayResumes;
