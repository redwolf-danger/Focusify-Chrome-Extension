
chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "onboarding/onboardingpage.html"
    });
  }
});



async function fetch_keywords(){
  // console.log('\n\nexecuting fetch keywords fuction...');
  let stored = await chrome.storage.local.get("blocked_tabs");
  // stores a list of objects
  // console.log('stored is ',stored,"\n\n");
  let arr_of_keywords = [];
  let arr_of_objects = (Object.keys(stored).length == 1) ? stored["blocked_tabs"]: [];
  for(let i = 0;i<arr_of_objects.length;i++){
    arr_of_keywords = arr_of_keywords.concat(arr_of_objects[i].keywords);
  };
  // console.log('the keywords list is ', arr_of_keywords);
  return arr_of_keywords;
};



async function fetchUrls(){
  // *console.log('\n\nexecuting fetch url fuction...');
  let stored = await chrome.storage.local.get("blocked_tabs");
  // stores a list of objects
  // *console.log('stored is ',stored,"\n\n");
  let listOfUrls = (Object.keys(stored).length == 1) ? stored["blocked_tabs"]: [];
  listOfUrls = listOfUrls.map((obj)=>{ return obj.blocked_urls});
  return listOfUrls;
};



//todo: code starts from here
async function CheckUrlAndRedirect(tabid,changeinfo,illegal_tab){
  
  // console.log('starting upadate event listener of checkURL.......\n');
  
  // console.log('\n tab updated \n');
  let list_of_barred_websites = Array.from(await fetchUrls());
  // console.log("the list of urls is ",list_of_barred_websites,"\n\n");
  // console.log('type of list is  ',typeof(list_of_barred_websites));
  
  
  let contains = false;
  
  if(illegal_tab?.url != undefined){
    // console.log('updated url is ',illegal_tab.url, typeof(illegal_tab.url));
  for (const key in list_of_barred_websites) {
    if (Object.hasOwnProperty.call(list_of_barred_websites, key)) {
      const element = list_of_barred_websites[key];
      // console.log('element is ', element, (illegal_tab.url)?.search(element));
      if(element.length!=0 && (illegal_tab.url).indexOf(element) != -1){
            contains = true;
          };
    };
  };

  // console.log('contains is ', contains,"\n");
  //todo: uncomment this to use the actual function
  if(contains){
    // console.log('this was an illegal tab');
    try{
      let unused1 = await chrome.tabs.update(illegal_tab.id,{url:"/Prohibited_Page/page.html"});
    }
    catch(err){
      // console.log('inside url function\n');
      
      console.log("***YOU ARE LIGHTNING FAST AND CLOSED THE TAB EVEN BEFORE CHROME****");
    };
    // console.log('tab updated to legal one ...\n');
    //todo add etc code to modify the css of the extesnion pages
  };
  // console.log('closing update event listener of check url.......\n');
};
};

async function CheckkeywordsAndRedirect(tabid,changeinfo,illegal_tab){
  
  // console.log('starting upadate event listener .......\n');
  
  // console.log('\n tab updated \n');
  let list_of_barred_keywords = Array.from(await fetch_keywords());

  // console.log("the list of keywords is ",list_of_barred_keywords,"\n\n");
  // console.log('type of list is  ',typeof(list_of_barred_keywords));
  
  
  let contains = false;
  
  if(illegal_tab?.url != undefined){
    // console.log('updated url is ',illegal_tab.url, typeof(illegal_tab.url));
  for (const key in list_of_barred_keywords) {
    if (Object.hasOwnProperty.call(list_of_barred_keywords, key)) {
      const element = list_of_barred_keywords[key];
      let temp_contains = false;
      let words = element.split(" ");
      // console.log('words array is ', words);
      words = words.filter((st)=>{return st!=""});
      // console.log('****words array after filter is ', words);
      let matcher =""
      for( let  i = 0;i<words.length;i++){
        matcher += `${words[i]}.*`;
      };
      // console.log('matcher is ',matcher);
      let matchingexp = new RegExp(matcher,"i");
      // temp_contains = matcher.length ? matchingexp.test(illegal_tab.url) : false;
      if(matcher.length>0){
        // console.log("matcher is ",matcher);
        // console.log('length was greater than 0');
        temp_contains = matchingexp.test(illegal_tab.url);
        // console.log('**this was executed****\n');
      }
      else{
          // console.log('length was 0 ');
          
      }
      // console.log('temp conatins is ',temp_contains);
      // console.log('element is ', element, (illegal_tab.url)?.search(element));
      contains = contains|temp_contains;
    };
  };
  // console.log('contains is ', contains,"\n");
  //todo: uncomment this to use the actual function
  if(contains){
    // console.log('this was an illegal tab');
    try{
    let unused1 = await chrome.tabs.update(illegal_tab.id,{url:"/Prohibited_Page/page.html"});
    }
    catch(err){
      // console.log('inside keywords function\n');
      
      console.log("***YOU ARE LIGHTNING FAST AND CLOSED THE TAB EVEN BEFORE CHROME****");
    };
    // console.log('tab updated to legal one ...\n');
    //todo add etc code to modify the css of the extesnion pages
  };
  // console.log('closing update event listener .......\n');
};
};

async function updater_event(id,changeinfo,tab){
  let prohibited_page  = await chrome.runtime.getURL("Prohibited_Page/page.html");   
  if(tab?.url != prohibited_page){
    // console.log('\n\n***********entered central updater event once again*******\n\n');
    // console.log('tab url:', tab?.url, " and prohib url:",prohibited_page);
    try{
    await CheckUrlAndRedirect(id,changeinfo,tab);
    await CheckkeywordsAndRedirect(id,changeinfo,tab);
    }
    catch(err){
      console.log("***YOU ARE LIGHTNING FAST AND CLOSED THE TAB EVEN BEFORE CHROME****");
    };
  };
}

chrome.tabs.onUpdated.addListener(updater_event);
chrome.tabs.onActivated.addListener(async (t_id)=>{
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    // console.log('tab is ',tab);
    let ch_info = {id: t_id, tabs:tab};
    updater_event(t_id,ch_info,tab);
});
// chrome.storage.onChanged.addListener(CheckUrlAndRedirect);
// chrome.tabs.on
// chrome.tabs.onActivated.addListener(async (activeInfo)=>{
//   // console.log('&&&&&&&&&&&&on Replaced event starts &&&&&&&&&&&');
//   // console.log('tab is was ',activeInfo.tabId);
//   let tab = await chrome.tabs.get(activeInfo.tabId);
//   // console.log(tab);
//   await CheckUrlAndRedirect(activeInfo.tabId,undefined,tab);
//   await CheckkeywordsAndRedirect(activeInfo.tabId,undefined,tab);
//   // console.log('&&&&&&&&&&&&on Replaced event ends &&&&&&&&&&&');
// });

//
async function store_the_object(new_obj){
  //* console.log('\n\nSTORING THE OBJECT\n');
  let stored = await chrome.storage.local.get("blocked_tabs");
  // console.log('\n stored WAS ',stored);
  let isEmpty = ((Object.keys(stored).length === 0) ? true :false); 
  // console.log('stored is empty', Object.keys(stored).length);
  let list_stored = data_array;
  // if(isEmpty){
   
  //     list_stored = [new_obj];
  // }
  // else{

  //   list_stored = stored.blocked_tabs;
  //   list_stored.push(new_obj);
  //   // console.log(stored.);
  // }
  //* console.log('new stored IS ',list_stored);
  await chrome.storage.local.set({blocked_tabs : list_stored});
  let a = await chrome.storage.local.get("blocked_tabs");
  //* console.log("stored AS ",a); 
};

async function fetch_object(){
  let stored = await chrome.storage.local.get("blocked_tabs");
  // console.log('\n stored WAS ',stored,"\n\n");
  return stored;
}
//todo:code ends here;

// (async ()=>{
// let obj = {
//   keywords:["hi","bye"],
//   blocked_urls: "testing.com",
//   settings:[{iframes:true,all_successive_urls:true,lock_status:"locked"}]
// };
// await store_the_object(obj);
// await fetch_keywords();
// await store_the_object(obj);
// await fetch_keywords();
// })();

//* *Development code starts here
// title:"blocked tabs",
// let object_template = {
//   keywords : ["",""],
//   blocked_urls: ["",""],
//   settings: [obj_setter]
// }
// let obj_setter = {
//   iframes: true,
//   // * * incognito: true,
//   all_successive_urls:false,
//   lock_status: "locked"|"unlocked"|"locked_lightly"
// }
//* *Development code ends here

// https://animesuge.to/