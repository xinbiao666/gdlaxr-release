const fs = require('fs');
const path = require('path');

function getNowDate() {
  const now = new Date();
  const pad = (n) => (n < 10 ? `0${n}` : n);
  return `${now.getFullYear()}
  -${pad(now.getMonth() + 1)}
  -${pad(now.getDate())} ${pad(now.getHours())}
  :${pad(now.getMinutes())}
  :${pad(now.getSeconds())}`;
}

// 获取文件夹下最新更新的文件
function getLatestUpdatedFile(folderPath) {
  if (!folderPath) {
      return
  }
  const files = fs.readdirSync(folderPath);
  // 获取每个文件的状态信息，包括最后修改时间
  const fileStats = files.map(file => ({
      file,
      stats: fs.statSync(path.join(folderPath, file)),
  }));
  const latestUpdatedFile = fileStats.reduce((latest, current) => {
      if (!latest || current.stats.mtime > latest.stats.mtime) {
          return current;
      }
      return latest;
  }, null);
  return latestUpdatedFile ? latestUpdatedFile.file : null;
}

module.exports = {
    getNowDate, getLatestUpdatedFile
}