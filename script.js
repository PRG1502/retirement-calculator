// script.js

// Format the Monthly Annuity input field on blur
document.getElementById('monthlyAnnuity').addEventListener('blur', function() {
    let value = this.value;
    // Remove existing commas if any
    value = value.replace(/,/g, '');
    let numberVal = parseFloat(value);
    if (!isNaN(numberVal)) {
      // Format to Indian number system with two decimals
      this.value = numberVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });
  
  document.getElementById('calculate').addEventListener('click', function() {
    // Retrieve and parse input values. Remove commas from Monthly Annuity input.
    let monthlyAnnuityStr = document.getElementById('monthlyAnnuity').value.replace(/,/g, '');
    let monthlyAnnuity = parseFloat(monthlyAnnuityStr);
    let returnRate = parseFloat(document.getElementById('returnRate').value);
    let inflationRate = parseFloat(document.getElementById('inflationRate').value);
    let period = parseFloat(document.getElementById('period').value);
    let taxRate = parseFloat(document.getElementById('taxRate').value);
  
    // Round the values to two decimal places
    monthlyAnnuity = Number(monthlyAnnuity.toFixed(2));
    returnRate = Number(returnRate.toFixed(2));
    inflationRate = Number(inflationRate.toFixed(2));
    taxRate = Number(taxRate.toFixed(2));
  
    // Validate inputs: monthly annuity and period must be > 0 and other values must be valid numbers
    if (
      isNaN(monthlyAnnuity) || 
      isNaN(returnRate) || 
      isNaN(inflationRate) || 
      isNaN(period) || 
      isNaN(taxRate) ||
      monthlyAnnuity <= 0 ||
      period <= 0
    ) {
      document.getElementById('result').textContent = "Please enter valid positive numbers in all fields.";
      return;
    }
  
    // Step 1: Apply tax to the nominal return to get the after-tax nominal return.
    const afterTaxNominalReturn = returnRate * (1 - taxRate / 100);
  
    // Step 2: Subtract inflation to get the effective annual real return (in percentage)
    const effectiveAnnualRealReturn = afterTaxNominalReturn - inflationRate;
  
    // Convert the effective annual real return from percentage to a decimal and then to a monthly rate.
    const netMonthlyRate = (effectiveAnnualRealReturn / 100) / 12;
  
    // Step 3: Calculate the total number of months.
    const totalMonths = period * 12;
  
    let presentValue;
    if (netMonthlyRate === 0) {
      // If net monthly rate is zero, simply multiply the monthly annuity by the total months.
      presentValue = monthlyAnnuity * totalMonths;
    } else {
      // Calculate the present value for an ordinary annuity first:
      let ordinaryPV = monthlyAnnuity * (1 - Math.pow(1 + netMonthlyRate, -totalMonths)) / netMonthlyRate;
      // Adjust for annuity due (payments at the beginning of each period)
      presentValue = ordinaryPV * (1 + netMonthlyRate);
    }
  
    // Format the Corpus Required value using Indian number system formatting with two decimals.
    const formattedPresentValue = presentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
    // Display the result with the label "Corpus Required"
    document.getElementById('result').textContent = "Corpus Required = ₹ " + formattedPresentValue;
  });
  