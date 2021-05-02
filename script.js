//Input fields
const productPriceField = document.querySelector("#product-price-input");
const othersPriceField = document.querySelector("#others-price-input");
//Elements displaying calculated prices
const finalPriceText = document.querySelector("#final-price");
const cloPriceText = document.querySelector("#clo-price");
const dphPriceText = document.querySelector("#dph-price");
//Buttons for choosing category of product
const smartphoneButton = document.querySelector("#smartphone-wrapper");
const btHeadsetButton = document.querySelector("#bt-headset-wrapper");
const carRadioButton = document.querySelector("#car-radio-wrapper");
const pcButton = document.querySelector("#pc-wrapper");

//Variables to hold values across the site 
let productValue = 0;
let othersValue = 0;
let productTypeSelected = "";

//DPH rate in 2021
const dph = 0.2;

//Treholds of value from which dph/clo must be paid
const taxThresholds = {
    dph: 22,
    clo: 150
}

//Rates for different types of electronics
const cloRates = {
    smartphone: 0,
    btHeadset: 0.01,
    carRadio: 0.105,
    pc: 0
}

const fontSizesRems = {
    bigTextShort: "5.5",
    bigTextLong: "3.05"
}

//Function returing font size for final price
const getFinalPriceFontSize = (number, step) => {
    //Get rid of decimal places
    number = number.toFixed(0);
    let len = number.toString().length;
    //For longer numbers decrease font
    if (len > 2 && len < 8) {
        return `${fontSizesRems.bigTextShort - (len * step)}rem`;
    } else if (len > 2) {
        return `${fontSizesRems.bigTextLong - (len * (step / 8))}rem`;
    }
    return null;
}

/* 
    Logic for calculation of price
*/
const finalPriceCalculator = () => {
    let finalPrice = productValue + othersValue;
    let cloPrice = 0.00;
    let dphPrice = 0.00;

    //Check wheter values are not both 0
    if (productValue === 0 && othersValue === 0) {
        return;
    }
    //Check wheter product price is assigned
    else if (productValue === 0 && othersValue !== 0) {
        //Warn user that the product price must be given
        productPriceField.style.borderColor = "red";
        return
    }

    //Check if final price is below DPH treshold
    if (finalPrice < taxThresholds.dph) {
        finalPriceText.style.fontSize = null;
    }
    //Check if final price is below CLO treshold
    else if (finalPrice < taxThresholds.clo) {
        //Calculation of DPH for given price
        dphPrice = finalPrice * 0.2;

    }
    //Case where price is above both CLO and DPH tresholds
    else {
        //Take CLO for selected type of electronics
        cloPrice = finalPrice * cloRates[productTypeSelected];
        //DPH is calculated both from clo and price of product + other costs
        dphPrice = (finalPrice + cloPrice) * dph;
    }

    //Get font size that will fit into div
    finalPriceText.style.fontSize = getFinalPriceFontSize(finalPrice, 0.35);

    //Update numbers shown in html
    dphPriceText.innerHTML = "Z toho DPH: " + dphPrice.toFixed(2) + "€";
    cloPriceText.innerHTML = "Z toho CLO: " + cloPrice.toFixed(2) + "€";
    finalPriceText.innerHTML = (dphPrice + cloPrice).toFixed(2) + "€";
}

//Function that verifies that given input is a valid number and is positive
const checkValue = (value) => {
    if (isNaN(value) || value < 0) {
        return false;
    }
    else {
        return true
    }
}

//Reset all the buttons in given array to default styling from css
const resetButtons = (arrayOfButtons) => {
    for (let i = 0; i < arrayOfButtons.length; i++) {
        arrayOfButtons[i].style.background = null;
        arrayOfButtons[i].children[0].style.color = null;
        arrayOfButtons[i].children[1].style.color = null;
    }
}

//Set styling of given button to make it look active/clicked
const activateButton = (button) => {
    button.style.background = "white";
    button.children[0].style.color = "black";
    button.children[1].style.color = "black";
}

/* 
    -----------  Event handling  -----------
*/

//When side is loaded pick smartphone as default category of goods
document.addEventListener("DOMContentLoaded", function () {
    productTypeSelected = "smartphone";
    activateButton(smartphoneButton);
});

/*  
    Listener for product price form input that
    refreshes on every number written
*/
productPriceField.addEventListener("input", () => {
    //Get value from form input
    productValue = productPriceField.value;
    //Check if input is not empty
    if (productValue === "") {
        productValue = 0;
    }
    //Check if value given is valid number
    else if (!checkValue(productValue)) {
        //Alert user
        productPriceField.style.borderColor = "red";
        return;
    }
    else {
        //Reset border and parse number to float type
        productPriceField.style.borderColor = null;
        productValue = parseFloat(productValue);

    }
    //Call calculator logic
    finalPriceCalculator()
})

/*  
    Listener for others price form input that
    refreshes on every number written
*/
othersPriceField.addEventListener("input", () => {
    //Get value from form input
    othersValue = othersPriceField.value;
    //Check if input is not empty
    if (othersValue === "") {
        othersValue = 0;
    }
    //Check if value given is valid number
    else if (!checkValue(othersValue)) {
        //Alert user
        othersPriceField.style.borderColor = "red";
        return;
    }
    else {
        //Reset border and parse number to float type
        othersPriceField.style.borderColor = null;
        othersValue = parseFloat(othersValue);
    }
    //Call calculator logic
    finalPriceCalculator();
})

/* 
    Click event listeners for type of electronics buttons
    Functionality:  change global scope variable to choosen category
                    make button visibly clicked
                    reset/unclick all other buttons
                    run new calculation for newly choosen category
 */
smartphoneButton.addEventListener("click", () => {
    productTypeSelected = "smartphone";
    activateButton(smartphoneButton);
    resetButtons([btHeadsetButton, carRadioButton, pcButton]);
    finalPriceCalculator();
})

btHeadsetButton.addEventListener("click", () => {
    productTypeSelected = "btHeadset";
    activateButton(btHeadsetButton);
    resetButtons([smartphoneButton, carRadioButton, pcButton]);
    finalPriceCalculator();
})

carRadioButton.addEventListener("click", () => {
    productTypeSelected = "carRadio";
    activateButton(carRadioButton);
    resetButtons([smartphoneButton, btHeadsetButton, pcButton]);
    finalPriceCalculator();
})

pcButton.addEventListener("click", () => {
    productTypeSelected = "pc";
    activateButton(pcButton);
    resetButtons([smartphoneButton, btHeadsetButton, carRadioButton]);
    finalPriceCalculator();
})