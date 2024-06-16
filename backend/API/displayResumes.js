
// Endpoint to serve files from GridFS
const displayResumes = (gfsBucket) => {
    return async (req, res) => {
        try 
        {
            const { filename } = req.params;
            console.log('Filename:', filename);

            // Find the file by filename
            gfsBucket.find({ filename }).toArray((err, files) => {
                if (err) {
                    console.error('Error finding file:', err);
                    return res.status(500).json({ error: 'Error finding file' });
                }

                // Check if file exists
                if (!files || files.length === 0) {
                    console.log('File not found');
                    return res.status(404).json({ error: 'File not found' });
                }

                // Set content type and create read stream to send the file to display on screen
                const file = files[0];
                if (file.contentType === 'application/pdf' || file.filename.endsWith('.pdf')) {
                    res.setHeader('Content-Type', 'application/pdf');
                    const readstream = gfsBucket.openDownloadStreamByName(filename);
                    readstream.pipe(res);
                } else {
                    res.status(400).json({ error: 'Not a PDF file' });
                }
            });
        } 
        catch (error) {
            console.error('Error serving file:', error);
            res.status(500).json({ error: 'Error serving file' });
        }
    };
};

module.exports = displayResumes;