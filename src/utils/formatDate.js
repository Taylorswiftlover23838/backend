function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  
    return formattedDate;
  }
  
module.exports = formatDate;