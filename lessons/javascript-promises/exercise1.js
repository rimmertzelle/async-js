const url = "https://articles-zxjs.onrender.com/articles/1";

fetch(url)
  .then(response => {
        //console.log("Response object:", response);
        return response.json();
    })
  .then(data => console.log(data.data.title + " by " + data.data.author))
  .catch(error => console.log("Error:", error));