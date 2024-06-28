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
// document.body.style.backgroundImage = "url('img_tree.png')";
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
const allowed_words = 10;
let add = false;
let add_btn = document.getElementById("add_btn");
let rmv_btn = document.getElementById("rmv_btn");
let save_btn = document.getElementById("save_btn");
let caution_box = document.getElementById("caution_box");
let rmv = false;
let removing_arr = [];
let data_array = [];
let chgs = false;

function remover_event(event){
    if(rmv){
        // console.log('\n\n\nclicked on list item');
        // console.log('events target was', event.target);
        let keyword;
        if(event.target.tagName == "INPUT"){
            // console.log('INPUT was the tag name\n');
            keyword = event.target.getAttribute("key_id");
            
        }
        else if(event.target.tagName == "LI"){
            // console.log('LI was the tag name\n');
            keyword = event.target.querySelector("input").getAttribute("key_id");
        }
        else{
            // console.log('label was the tag name\n');
            keyword = event.target.parentElement.querySelector("input").getAttribute("key_id");
        }
        // console.log('keyword was ',keyword);
        // let checkbox = document.getElementById(`${keyword}`); 
        let checkbox = document.querySelector(`[key_id = '${keyword}']`);
        // console.log('checkbox was ', checkbox);
        // console.log('removing array is ',removing_arr);
        // console.log("data_array is ",data_array);
        
        if(event.target != checkbox){
            checkbox.checked = !checkbox.checked;
        };

        if(checkbox.checked){
            //* * console.log('element is checked');* *
            //find my_obj;
            let my_obj;
            for(let i = 0;i<data_array.length;i++){
                if(data_array[i].keywords == keyword){
                    my_obj = data_array[i];
                };
            };
            removing_arr.push(my_obj);
            data_array = data_array.filter(function (obj) {
                return (obj.keywords != keyword) ;
            });
        }
        else{
            //* * console.log('element is not checked');
            let my_obj;
            for(let i = 0;i<removing_arr.length;i++){
                if(removing_arr[i].keywords == keyword){
                    my_obj = removing_arr[i];
                };
            };
            removing_arr = removing_arr.filter(function (obj) {
                return (obj.keywords != keyword) ;
            });
            data_array.push(my_obj);
        };
        // console.log('removing array is ',removing_arr);
        // console.log("data_array is ",data_array);
        //* * console.log('copy is ', copy);
        //* * console.log('removed array is ',removing_arr);
        
        };
};

async function fetchkeywords(){
    // console.log('\n\nexecuting fetch keywords fuction...');
    let stored = await chrome.storage.local.get("blocked_tabs");
    // stores a list of objects
    // console.log('stored is ',stored,"\n\n");
    let listOfkeywords = (Object.keys(stored).length == 1) ? stored["blocked_tabs"]: [];
    // console.log('list of keywords 1 is ',listOfkeywords);
    listOfkeywords = listOfkeywords.filter((obj)=>{return obj.keywords != ""});
    // console.log('list of keywords 2 is ',listOfkeywords);
    listOfkeywords = listOfkeywords.map((obj)=>{ return obj.keywords});
    // console.log('list of keywords 3(final) is ',listOfkeywords);
    return listOfkeywords;
  };


async function addblockedsites(){
    // console.log('***********running add blocked KEYWORDS in ADD.js**********');
    let list_of_obj = Array.from(await fetchkeywords());
    // console.log('list of obj is ', list_of_obj );
    for(let i = 0;i<list_of_obj.length; i++){
        let new_list_element = `
        <input id = ${list_of_obj[i]} class = "hidden" type="checkbox" name="sites" value="first_site">
        <label>${list_of_obj[i]}</label>
        `;
        let my_obj = new createSiteObj("",list_of_obj[i]);
        let copy = document.createElement("li");
        copy.innerHTML = new_list_element;
        data_array.push(my_obj);
        document.querySelector("#keywords_list").appendChild(copy);
        copy.addEventListener("click",remover_event);
    };
    // console.log('*******************endin add blockd sites in modify.js************');
};
addblockedsites();

function add_event(){
    // todo:
    if(data_array.length<allowed_words){
    // console.log('clicked on add btn');
    let ip_space = document.querySelector("#ip_space");
    // console.log(ip_space);
    rmv_btn.classList.toggle("hidden");
    add = !add;
    if(add){ 
        disable_save_btn();
        //todo save_btn.classList.add("improved_save_btn")
        add_btn.innerHTML = "SAVE";
        let input_box=`<input type="url" name="new_blocked_keyword" id="new_blocked_keyword" placeholder="https://example.com">`;
        ip_space.innerHTML += input_box; 
        let key_bar = document.querySelector("#new_blocked_keyword");
        key_bar.addEventListener("keydown",(event)=>{
            if(event.code == "Enter"){
                add_event();
            };
    });
    }
    else{
        add_btn.innerHTML = "ADD";
        let val = (document.querySelector("#new_blocked_keyword")).value;
        //be sure to remove its value
        // console.log(val);
        let my_obj = new createSiteObj("",val);
        // console.log('my obj is ', my_obj);
        ip_space.innerHTML = "";
        let new_list_element = `
        <input key_id = "${my_obj.keywords}" class = "hidden" type="checkbox" name="sites" value="first_site">
        <label>${my_obj.keywords}</label>
        `;
        let copy = document.createElement("li");
        copy.innerHTML = new_list_element;

        let doesnt_contains = true;
        for(let i = 0;i<data_array.length;i++){
            if(data_array[i].keywords === my_obj.keywords){
                doesnt_contains = false;
            };
        };
        // console.log('doesn_contains is ',doesnt_contains);
    
        if(my_obj.keywords.length!=0 && doesnt_contains){
            data_array.push(my_obj);
            // console.log("data_array is ",data_array);
            document.querySelector("#keywords_list").appendChild(copy);
            copy.addEventListener("click",remover_event);
            if (data_array.length == allowed_words){
                caution_box.classList.toggle("hidden");
                // add_btn.classList.toggle("blocked_add_btn");
                add_btn.style.backgroundColor = "rgb(59, 59, 113)";
            };

        };
        enable_save_btn();
    };
    // console.log('counter is now', counter);
    //todo:
    };
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
            keyword = it.keywords;
            // let parent = document.getElementById(it.keywords).parentElement;
            let parent = document.querySelector(`[key_id = '${keyword}']`).parentElement;
            // console.log('parent is ', parent);
            parent.remove();

        };
        caution_box.classList.remove("hidden");
        add_btn.style.backgroundColor = "rgb(144, 144, 227)";
        removing_arr = [];
        ///sure above statement is inside ?
        enable_save_btn();
    };
    //made all them unhidden

    //toggle remove buttons's text
    //
    //clear the arry on removed 
    // console.log('clicked');
})

async function store_the_object(){
    if(chgs){
    // console.log('\n\nSTORING THE OBJECT\n');
    let stored = await chrome.storage.local.get("blocked_tabs");
    // console.log('\n stored WAS ',stored);
    let isEmpty = ((Object.keys(stored).length === 0) ? true :false); 
    // console.log('stored is empty', Object.keys(stored).length);
    let list_stored = [];
    if(!isEmpty){
        list_stored = stored["blocked_tabs"].filter((obj)=>{return obj.keywords.length == 0});
    };
    list_stored = list_stored.concat(data_array);
    // console.log('new stored IS ',list_stored);
    await chrome.storage.local.set({blocked_tabs : list_stored});
    let a = await chrome.storage.local.get("blocked_tabs");
    // console.log("stored AS ",a); 
    disable_save_btn();
    // data_array = [];
    // removing_arr = [];
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
//make a variable improvements to 
//initially diabled 