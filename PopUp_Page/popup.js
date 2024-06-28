let btn = document.querySelector("button");
let body = document.querySelector("body");
let quote_section = document.querySelector(".heading h3");
let author_section = document.querySelector(".heading h4");
let btn_state = false;
let dropdn = document.querySelector(".dropdownMenu");

btn.addEventListener("click",()=>{
    // console.log('\n\n clicked on button');
    if(btn_state){
        btn_state = false;
        if(!dropdn.classList.contains("display_none")){
            dropdn.classList.add("display_none");
        };
    }
    else{
        btn_state = true;
        if(dropdn.classList.contains("display_none")){
            dropdn.classList.remove("display_none");
        };
        // console.log(dropdn.classList);    
    };
});
//todo: see below
fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  }).catch()
  .then(function(data) {
    // console.log(data);
    let idx = Math.round(Math.random()*data.length);
    // console.log('idx is ',idx);
    quote_section.innerHTML = data[idx].text;
    // author_section.
    let author = data[idx].author;
    if(author =="type.fit"){
        author = "Anonymous";
    }
    else{
        author = author.split(", type.fit")[0];
    };
    // console.log('author is ', author);
    author = "-"+author;
    author_section.innerHTML = author;    
  }).catch((err)=>{
      //no message to display
  });
  
  async function addimage(){
    let url_image = await chrome.runtime.getURL("../images/abstract-purple-sunburst-border-frame.jpg");
    document.body.style.backgroundImage = `url('${url_image}')`;
    };
addimage();

async function execute(){
  let url_1 = await chrome.runtime.getURL("../Settings_Page/modify_sites/modify.html");
  let url_2 = await chrome.runtime.getURL("../Settings_Page/add_keywords/add.html");
  let btn_1 = document.querySelector("#sites");
  let btn_2 = document.querySelector("#keys");


//   let content_1 = `modify sites`;
//   let content_2 = `<a href = "${url_2}">modify keywords</a>`;
//   btn_1.innerHTML = content_1;
//   btn_2.innerHTML = content_2;
btn_1.addEventListener("click",()=>{
    chrome.tabs.create({
        url: url_1
      });
});
btn_2.addEventListener("click",()=>{
    chrome.tabs.create({
        url: url_2
      });
});

  };
  execute();