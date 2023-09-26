// we save the price number into this variable
let sellPrice;
let inventory_page;
let inventories;
let inventory;
let finalInventory;
let currentInventory;
// when you try to sell an item on steam market, there is an checkbox after you hit the sell button.
// if you check the checkbox, then for the rest of the sale process you dont need to check the checkbox again.
// we will be using this variable for condition of the checkbox logic
let agreeToTermsCheckBox = false;

function pressSpaceInInput() {
  // this function would hit an spacebar in the buyer input. you might ask why?
  // because when we are setting the value of the input price with js. the revice amount input wont change automaticly.
  // so basickly we are simulating the spacebar into the input so the recvier input would be update automaticly

  // Find the input element by its ID
  const inputElement = document.getElementById(
    "market_sell_buyercurrency_input"
  );

  // Simulate clicking on the input element
  if (inputElement) {
    inputElement.click();
    // Create and dispatch a space keydown event
    const spaceKeyDownEvent = new KeyboardEvent("keydown", { keyCode: 32 }); // Key code for spacebar is 32
    inputElement.dispatchEvent(spaceKeyDownEvent);

    // Create and dispatch a space keyup event
    const spaceKeyUpEvent = new KeyboardEvent("keyup", { keyCode: 32 }); // Key code for spacebar is 32
    inputElement.dispatchEvent(spaceKeyUpEvent);
  }
}

const sellSteamItem = async () => {
  let gameListTab = document.getElementsByClassName("games_list_tabs")[0];
  let currentGameTav = document.querySelector("a.active");
  let firstItem = null;
  let anchorTag = null; //should be this = firstItem.querySelector("a")
  let marketableCheckBox = null;
  let priceDom = null;
  let preSellBtn = null;
  let priceOnly;
  let currentInventory;
  console.log(inventories);
  inventory_page = document.querySelector("div#active_inventory_page");
  inventories = inventory_page.getElementsByClassName("inventory_page_left")[0];
  // Loop through all the elements and select only the ones that don't have the 'display: none' style
  for (let i = 0; i < inventories.length; i++) {
    const element = inventories[i];
    const style = window.getComputedStyle(element);
    if (style.display !== "none") {
      inventory = element;
      break;
    }
  }
  inventory =
    inventories.getElementsByClassName("inventory_ctn")[
      inventories.getElementsByClassName("inventory_ctn").length - 1
    ];
  console.log("inventory", inventory);
  const itemsOfInventory = Array.from(
    inventory.querySelectorAll("div.itemHolder")
  ).filter((item) => getComputedStyle(item).display !== "none");
  console.log("itemsOfInventory", itemsOfInventory);
  // Loop through all the elements and select only the ones that don't have the 'display: none' style
  for (let i = 0; i < itemsOfInventory.length; i++) {
    const element = itemsOfInventory[i];
    const style = window.getComputedStyle(element);
    if (style.display !== "none") {
      currentInventory = element;
      break;
    }
  }
  console.log("currentInventory", currentInventory);
  // click on the show advance button
  const showAdvanceFilters = document.getElementById("filter_tag_show");
  showAdvanceFilters && showAdvanceFilters.click();
  // click on the marketable checkbox to see the items that can be sold.
  marketableCheckBox = document.querySelector('input[tag_name="marketable"]');

  marketableCheckBox && marketableCheckBox.click();

  //when we use the filter of marketable in show advance filter, the items are not deleted from dom, steam basicly add {display : none} style to the not marketable items
  // so with that option, we can loop on the inventory and then check if any of them has that styling and if so, we ignore that
  for (let i = 0; i < itemsOfInventory.length; i++) {
    // console.log("itemsOfInventory", itemsOfInventory);
    const item = itemsOfInventory[i];
    const displayStyle = item.style.display;
    if (displayStyle !== "none") {
      firstItem = item;
      console.log("first Item", firstItem);
      break;
    }
  }
  setTimeout(() => {
    firstItem = itemsOfInventory;
  }, 1000);
  if (firstItem !== null) {
    //the anchorTag is the element which would open the modal fo pricing
    anchorTag = firstItem.querySelector("a");
    if (anchorTag) anchorTag.click();

    priceDom =
      document.querySelector(
        'div[id="iteminfo1_item_market_actions"] > div > div:nth-child(2)'
      ) ||
      document.querySelector(
        'div[id="iteminfo0_item_market_actions"] > div > div:nth-child(2)'
      );
    console.log("", { priceDom });
    if (priceDom !== null) {
      setTimeout(() => {
        console.log("priceDom", priceDom.innerHTML);
        // Extract the value using string manipulation
        priceOnly = priceDom.innerHTML
          .split("Starting at: ")[1]
          .split("<br>")[0];
        const formattedValue = priceOnly.replace(",", ",");
        sellPrice = formattedValue?.match(/[0-9,]+/)[0];
        // Store the number value with comma in a variable
        preSellBtn = document.querySelector(
          ".item_market_action_button_edge.item_market_action_button_right"
        );
        if (preSellBtn) preSellBtn.click();
        setTimeout(async () => {
          const BuyerinputElement = document.getElementById(
            "market_sell_buyercurrency_input"
          );
          const reciverInputElement = document.getElementById(
            "market_sell_currency_input"
          );

          if (BuyerinputElement || reciverInputElement) {
            // Set the value of the input element
            const reciverAmount = parseFloat(sellPrice.replace(",", "."));
            BuyerinputElement.value = parseFloat(sellPrice.replace(",", "."));
            pressSpaceInInput();
          } else {
            throw new Error("Input element not found");
          }
        }, 2000);
        setTimeout(async () => {
          const agreeToTerms = document.getElementById(
            "market_sell_dialog_accept_ssa"
          );
          if (agreeToTermsCheckBox == false) {
            if (agreeToTerms) {
              agreeToTerms.click();
              agreeToTermsCheckBox = true;
            }
          }
          const okPutItUpForSale = document.getElementById(
            "market_sell_dialog_accept"
          );
          if (!agreeToTermsCheckBox) agreeToTerms.click();
          if (okPutItUpForSale) okPutItUpForSale.click();
          setTimeout(() => {
            const finalSellButton = document.getElementById(
              "market_sell_dialog_ok"
            );
            if (finalSellButton) finalSellButton.click();
            sellPrice = null;
          }, 3000);
        }, 4000);
      }, 3000);
    } else {
      throw new Error("your if statement is not working properly");
    }
  } else {
    // Handle the case when no item without "display : none" style is found
    alert("no marketable item found!");
  }
};

const getRandomInterval = () => {
  const minInterval = 15000; // Minimum interval in milliseconds
  const maxInterval = 16000; // Maximum interval in milliseconds
  return (
    Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  );
};

setInterval(() => {
  sellSteamItem();
}, getRandomInterval());

sellSteamItem()