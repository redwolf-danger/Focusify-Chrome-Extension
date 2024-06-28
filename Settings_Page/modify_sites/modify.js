//* *aim 
//?2) make it so that it is not possible to take spaces in input box
//* *immediate
//?1)preprocessig of the arrays.??what
//?2. add event for send button
//?3. make a function to display blocked sites
    // >) it saves the data to local storage


// console.log('**************************************************************');
// console.log('this is modify.js running WILD.');
// console.log('**************************************************************');

function createSiteObj(blocked_urls,keywords,...arr) {
    if(blocked_urls != ""){
        this.blocked_urls = [blocked_urls];
    }
    else{
        this.blocked_urls = [];
    }
    this.keywords = (keywords === undefined ? "" : keywords);
    // console.log('arr is ',arr);
    this.settings = new createSettingsObj(arr);
    return this;
}
/* siteobject{
    blocked_urls: [array of urls],
    keywords: [array of keywords]
    settings: settings object
}


*/
function createSettingsObj(iframes,all_successive_urls,lock_status){
    if((iframes == undefined) || (typeof(iframes) == "object")){
        this.iframes = false;
    }
    //some modification may be needed here like iframes != undefined && iframes.length()!=0;
    // then this.iframes = iframes; else store false 
    else{
        this.iframes = iframes;
    }
    if(all_successive_urls == undefined){
        this.all_successive_urls = false;
    }
    else{
        this.all_successive_urls = all_successive_urls;
    }
    if(lock_status == undefined){
        this.lock_status = "locked";
    }
    else{
        this.lock_status = lock_status;
    };
    return this;
};
async function execute(){
    let url_image = await chrome.runtime.getURL("../../images/site_image.jpg");
    document.body.style.backgroundImage = `url('${url_image}')`;
    };
execute();

/*settings_obj{
    ...
}
//todo: test this object once gain as intuinally it feels wrong
*/

let add = false;
let add_btn = document.getElementById("add_btn");
let rmv_btn = document.getElementById("rmv_btn");
let save_btn = document.getElementById("save_btn");
let rmv = false;
let removing_arr = [];
let data_array = [];
let chgs = false;

function remover_event(event){
    if(rmv){
        //* console.log('clicked on list item');
        //* console.log('events target was', event.target,"and tag name was ",event.target.tagName);
        let blocked_url;
        if(event.target.tagName == "INPUT"){
            blocked_url = event.target.id;
            
        }
        else if(event.target.tagName == "LI"){
            blocked_url = event.target.querySelector("input").id
        }
        else{
            blocked_url = event.target.parentElement.querySelector("input").id;
        };
        //* console.log('blocked url is ', blocked_url);
        

        let checkbox = document.getElementById(`${blocked_url}`); 
        //*console.log('checkbox is ',checkbox);
        
        if(event.target != checkbox){
            checkbox.checked = !checkbox.checked;
        };

        if(checkbox.checked){
            //* * console.log('element is checked');* *
            //find my_obj;
            let my_obj;
            for(let i = 0;i<data_array.length;i++){
                if(data_array[i].blocked_urls[0] == blocked_url){
                    my_obj = data_array[i];
                };
            };
            removing_arr.push(my_obj);
            data_array = data_array.filter(function (obj) {
                return (obj.blocked_urls[0] != blocked_url) ;
            });
        }
        else{
            //* * console.log('element is not checked');
            let my_obj;
            for(let i = 0;i<removing_arr.length;i++){
                if(removing_arr[i].blocked_urls[0] == blocked_url){
                    my_obj = removing_arr[i];
                };
            };
            removing_arr = removing_arr.filter(function (obj) {
                return (obj.blocked_urls[0] != blocked_url) ;
            });
            data_array.push(my_obj);
        };
        //* * console.log('copy is ', copy);
        //* * console.log('removed array is ',removing_arr);
        //* console.log('removing array is ',removing_arr);
        //*console.log("data_array is ",data_array);
        };
};

async function fetchUrls(){
    //* console.log('\n\nexecuting fetch url fuction...');
    let stored = await chrome.storage.local.get("blocked_tabs");
    // stores a list of objects
    //* console.log('stored is ',stored,"\n\n");
    let listOfUrls = (Object.keys(stored).length == 1) ? stored["blocked_tabs"]: [];
    //* console.log('list of urls 1',listOfUrls);
    listOfUrls = listOfUrls.filter((obj)=>{return obj.blocked_urls.length != 0});
    //* console.log('list of urls 2',listOfUrls);
    listOfUrls = listOfUrls.map((obj)=>{return obj.blocked_urls});
    //* console.log('list of urls 3',listOfUrls);
    return listOfUrls;
  };


async function addblockedsites(){
    //* console.log('***********running add blocked sites in modify.js**********');
    let list_of_obj = Array.from(await fetchUrls());
    //* console.log('list of obj is ', list_of_obj);
    for(let i = 0;i<list_of_obj.length; i++){
        let new_list_element = `
        <input id = ${list_of_obj[i]} class = "hidden" type="checkbox" name="sites" value="first_site">
        <label>${list_of_obj[i]}</label>
        `;
        let my_obj = new createSiteObj(list_of_obj[i]);
        let copy = document.createElement("li");
        copy.innerHTML = new_list_element;
        data_array.push(my_obj);
        document.querySelector("#siteList").appendChild(copy);
        copy.addEventListener("click",remover_event);
    };
    //* console.log('*******************endin add blockd sites in modify.js************');
};
addblockedsites();

function add_event(){
    //* console.log('clicked on add btn');
    let ip_space = document.querySelector("#ip_space");
    // console.log(ip_space);
    rmv_btn.classList.toggle("hidden");
    add = !add;
    if(add){ 
        disable_save_btn();
        add_btn.innerHTML = "SAVE";
        let input_box=`<input type="url" name="new_blocked_site" id="new_blocked_site" placeholder="https://example.com">`;
        ip_space.innerHTML += input_box; 
        let url_bar = document.querySelector("#new_blocked_site");
        url_bar.addEventListener("keydown",(event)=>{
            if(event.code == "Enter"){
                add_event();
            };
    });
    }
    else{

        add_btn.innerHTML = "ADD";
        let val = (document.querySelector("#new_blocked_site")).value;
        //be sure to remove its value
        // console.log(val);
        //todo val.split(" ").join("");
        let my_obj = new createSiteObj(val);
        //* * console.log('my obj is ', my_obj);
        ip_space.innerHTML = "";
        let new_list_element = `
        <input id = ${my_obj.blocked_urls[0]} class = "hidden" type="checkbox" name="sites" value="first_site">
        <label>${my_obj.blocked_urls[0]}</label>
        `;
        let copy = document.createElement("li");
        copy.innerHTML = new_list_element;

        let doesnt_contains = true;
        for(let i = 0;i<data_array.length;i++){
            if(data_array[i].blocked_urls[0] === my_obj.blocked_urls[0]){
                doesnt_contains = false;
            };
        };
        // console.log('doesn_contains is ',doesnt_contains);
    
        if(my_obj.blocked_urls.length!=0 && doesnt_contains){
            data_array.push(my_obj);
            // console.log("data_array is ",data_array);
            document.querySelector("#siteList").appendChild(copy);
            
            copy.addEventListener("click",remover_event);
        };
        enable_save_btn();
    };
    // console.log('counter is now', counter);
};
add_btn.addEventListener("click",add_event)

rmv_btn.addEventListener("click",()=>{
    add_btn.classList.toggle("hidden");
    rmv = !rmv;
    let websites = document.querySelectorAll("input");
    for (const it of websites) {
        it.classList.toggle("hidden");
    };
    if(rmv){
        disable_save_btn();
    }
    else if(rmv === false){
        for(const it of removing_arr){
            // console.log(it);
            let parent = document.getElementById(it.blocked_urls[0]).parentElement;
            // console.log('parent is ', parent);
            parent.remove();
        };
        removing_arr = [];
        enable_save_btn();
        ///sure above statement is inside ?
    };
    //made all them unhidden

    //toggle remove buttons's text
    //
    //clear the arry on removed 
    // console.log('clicked');
})

async function store_the_object(){
    if(chgs){
    //* console.log('\n\nSTORING THE OBJECT\n');
    let stored = await chrome.storage.local.get("blocked_tabs");
    //* console.log('\n stored WAS ',stored);
    let isEmpty = ((Object.keys(stored).length === 0) ? true :false); 
     //* console.log('stored is empty', Object.keys(stored).length);
    let list_stored = data_array;
    let key_list = [];
    if(!isEmpty){
        key_list = stored["blocked_tabs"]
        key_list = key_list.filter((obj)=>{ return obj.blocked_urls.length == 0});
        // list_stored = stored.blocked_tabs;
    };
    list_stored = list_stored.concat(key_list);
    //* console.log('new stored IS ',list_stored);
    await chrome.storage.local.set({blocked_tabs : list_stored});
    let a = await chrome.storage.local.get("blocked_tabs");
//*     console.log("stored AS ",a); 
    // data_array = [];
    // removing_arr = [];
    disable_save_btn();
  };
};

  save_btn.addEventListener("click",store_the_object)

  function enable_save_btn(){
    //if(!(save_btn.classList.contains("improved_save_btn"))){
        save_btn.style.backgroundColor = "rgb(183, 183, 54)";
        //.classList.add("improved_save_btn");
        chgs = true; 
};
function disable_save_btn(){
    chgs = false;
    save_btn.style.backgroundColor="rgb(151, 151, 75)";
    //.classList.remove("improved_save_btn");
};


// let input_box = (document.querySelector("#new_blocked_site"));
// input_box?

