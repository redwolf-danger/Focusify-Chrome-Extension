{/* <li><h3><a href="../Settings_Page/add_keywords/add.html">Add/Modify sites</a></h3></li>
            <li><h3><a href="/Settings_Page/modify_sites/modify.html">Add/Modify keywords</a></h3></li> */}
async function execute(){
let ul = document.querySelector("ul");
let url_2 = await chrome.runtime.getURL("../Settings_Page/add_keywords/add.html");
let url_1 = await chrome.runtime.getURL("../Settings_Page/modify_sites/modify.html");

let textContent = `<li><h2><a href="${url_1}">Add/Modify sites</a></h2></li>
<li><h2><a href="${url_2}">Add/Modify keywords</a></h2></li>`;
ul.innerHTML = textContent;
};
execute();


async function addimage(){
    let url_image = await chrome.runtime.getURL("../images/onboarding_image.jpg");
    document.body.style.backgroundImage = `url('${url_image}')`;
    };
addimage();