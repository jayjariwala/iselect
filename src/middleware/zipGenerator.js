// require modules
var fs = require('fs');
var archiver = require('archiver');
const ProgressBar = require('electron-progressbar');
const path = require('path');


module.exports = function zipGenerator(savePath) {

    return new Promise((resolve, reject) => {
        // create a file to stream archive data to.
        var output = fs.createWriteStream(savePath);
        var archive = archiver('zip', {
            zlib: {
                level: 9
            } // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            progressBar.detail = 'Task completed. Exiting...';
            progressBar.setCompleted();
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(true);
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('progress', function (obj) {
            progressBar.detail = `zipping ${obj.entries.processed} out of ${obj.entries.total} files.`;
            progressBar.value = (obj.entries.processed * 100) / obj.entries.total;
        })

        var progressBar = new ProgressBar({
            indeterminate: false,
            text: 'Generating Micro-lession',
            detail: 'Please Wait...',
            closeOnComplete: true
        });

        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        // // append a file from stream
        // var file1 = __dirname + '/file1.txt';
        // archive.append(fs.createReadStream(file1), {
        //     name: 'file1.txt'
        // });

        // // append a file from string
        // archive.append('string cheese!', {
        //     name: 'file2.txt'
        // });

        // // append a file from buffer
        // var buffer3 = Buffer.from('buff it!');
        // archive.append(buffer3, {
        //     name: 'file3.txt'
        // });

        // // append a file
        // archive.file('file1.txt', {
        //     name: 'file4.txt'
        // });

        // append files from a sub-directory and naming it `new-subdir` within the archive
        // archive.directory('subdir/', 'new-subdir');

        // append files from a sub-directory, putting its contents at the root of archive
        archive.directory(path.join(__dirname, '..', '..', 'course-input'), false);

        // // append files from a glob pattern
        // archive.glob('*.js');

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        archive.finalize();
    })
}