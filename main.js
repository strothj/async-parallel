import { createReadStream, readdir } from 'fs';
import { join } from 'path';

const countLines = (file, cb) => {
  let lines = 0;
  const reader = createReadStream(file);
  reader.on('end', () => {
    cb(null, lines);
  });
  reader.on('data', (data) => {
    lines += data.toString().split('\n').length - 1;
  });
  reader.on('error', (err) => {
    cb(err);
  });
};

const onReadDirComplete = (err, files) => {
  if (err) throw err;

  let totalLines = 0;
  let completed = 0;

  const checkComplete = () => {
    if (completed === files.length) {
      console.log(totalLines); // eslint-disable-line
    }
  };

  files.forEach((file) => {
    countLines(join(process.argv[2], file), (cberr, lines) => {
      if (cberr) {
        if (cberr.code === 'EISDIR') {
          // Not to worry this is a subdirectory
        } else {
          console.error(cberr); // eslint-disable-line
        }
      } else {
        totalLines += lines;
      }
      completed += 1;
      checkComplete();
    });
  });
};

readdir(process.argv[2], onReadDirComplete);
