export const formatSizeUnits = (bytes: number) => {
  var sizeInString: string;
  if (bytes >= 1073741824) { sizeInString = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { sizeInString = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { sizeInString = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { sizeInString = bytes + " bytes"; }
  else if (bytes == 1) { sizeInString = bytes + " byte"; }
  else { sizeInString = "0 bytes"; }
  return sizeInString;
}

export const timeSince = (date: any) => {
  var currentDate: any =  new Date()
  var seconds = Math.floor((currentDate - date) / 1000);

  var interval = seconds / 31536000;

  if (Math.floor(interval) > 1) {
    if (Math.floor(interval) == 1) {
      return Math.floor(interval) + " year";
    } else {
      return Math.floor(interval) + " years";
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if (Math.floor(interval) == 1) {
      return Math.floor(interval) + " month";
    } else {
      return Math.floor(interval) + " months";
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if (Math.floor(interval) == 1) {
      return Math.floor(interval) + " day";
    } else {
      return Math.floor(interval) + " days";
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    if (Math.floor(interval) == 1) {
      return Math.floor(interval) + " hour";
    } else {
      return Math.floor(interval) + " hours";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    if (Math.floor(interval) == 1) {
      return Math.floor(interval) + " minute";
    } else {
      return Math.floor(interval) + " minutes";
    }
  }
  if (Math.floor(interval) == 1) {
    return Math.floor(interval) + " second";
  } else {
    return Math.floor(interval) + " seconds";
  }
}