window.onload = function () {
    calculateFinancialSituation();
    addInputEventListeners();
};



function addInputEventListeners() {
    var inputs = document.querySelectorAll('.form-control');

    inputs.forEach(function (input) {
        input.addEventListener('change', calculateFinancialSituation);
    });
}
function update3Chart(financialSituationWithHouse, financialSituationWithoutHouse, financialSituationWithoutHouseWithProperty) {
    var ctx = document.getElementById('savingsChart').getContext('2d');

    var labels = financialSituationWithHouse.map(function (item) {
        return "Age " + item.year;
    });

    var dataWithHouse = financialSituationWithHouse.map(function (item) {
        return item.savings;
    });

    var dataWithoutHouse = financialSituationWithoutHouse.map(function (item) {
        return item.savings;
    });

    var dataWithHouseWithProperty = financialSituationWithoutHouseWithProperty.map(function (item) {
        return item.savings;
    });

    if (window.mySavingsChart) {
        window.mySavingsChart.destroy();
    }

    window.mySavingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Savings With Buying House',
                data: dataWithHouse,
                fill: false,
                borderColor: 'rgb(118, 15, 246)',
                tension: 0.1
            }, {
                label: 'Total Savings Without Buying House',
                data: dataWithoutHouse,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }, {
                label: 'Total Savings With Buying House and House included',
                data: dataWithHouseWithProperty,
                fill: false,
                borderColor: 'rgb(225, 115, 60)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Savings ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltips: { // Enable and configure tooltips
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel.toLocaleString();
                            return label;
                        }
                    }
                },
            }
        }
    });
}
function updateChart(financialSituationWithoutHouse) {
    var ctx = document.getElementById('savingsChart').getContext('2d');

    var labels = financialSituationWithoutHouse.map(function (item) {
        return "Age " + item.year;
    });

    var dataWithoutHouse = financialSituationWithoutHouse.map(function (item) {
        return item.savings;
    });


    if (window.mySavingsChart) {
        window.mySavingsChart.destroy();
    }

    window.mySavingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Savings Without Buying House',
                data: dataWithoutHouse,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Savings ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltips: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel.toLocaleString();
                            return label;
                        }
                    }
                },
            }
        }
    });
}



function toggleHouseOptions() {
    var checkbox = document.getElementById("buyHouseCheckbox");
    var houseOptions = document.getElementById("houseOptions");
    // var housePrice = parseFloat(document.getElementById("housePrice"));
    // var mortgageRate = parseFloat(document.getElementById("mortgageRate").value) / 100;
    // var mortgageTerm = parseFloat(document.getElementById("mortgageTerm").value);
    // var downPayment = parseFloat(document.getElementById("houseDownPayment").value);
    // var houseBuyingAge = parseInt(document.getElementById("houseBuyingAge").value);

    if (checkbox.checked) {
        houseOptions.style.display = "block";
    } else {
        houseOptions.style.display = "none";
    }
}

function toggleChildOptions() {
    var checkbox = document.getElementById("childCheckbox");
    var houseOptions = document.getElementById("childOptions");
    if (checkbox.checked) {
        houseOptions.style.display = "block";
    } else {
        houseOptions.style.display = "none";
    }
}

function calculateTotalTax(monthlyIncome) {
    // var monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    var taxStatus = document.getElementById('taxStatus').value;
    var taxPlace = document.getElementById('taxPlace').value;
    var annualIncome = monthlyIncome * 12;
    var taxDue = 0;

    if (taxPlace == "California") {
        switch (taxStatus) {
            case "Single":
                taxDueFederal = calculateTaxSingle(annualIncome);
                taxDueState = calculateStateTaxSingle(annualIncome);
                break;
            case "Married Filing Jointly":
                taxDueFederal = calculateTaxMarriedFilingJointly(annualIncome);
                taxDueState = calculateStateTaxMarriedFilingJointly(annualIncome);
                break;
            case "Married Filing Separately":
                taxDueFederal = calculateTaxMarriedFilingSeparately(annualIncome);
                taxDueState = calculateStateTaxSingle(annualIncome);
                break;
            case "Head of Household":
                taxDueFederal = calculateTaxHeadOfHousehold(annualIncome);
                taxDueState = calculateStateTaxHeadOfHousehold(annualIncome);
                break;
        }
        // console.log("Total Tax Due: $" + (taxDue + taxDueState).toFixed(2));
        return annualIncome - taxDueFederal - taxDueState;
    } else if (taxPlace == "Shanghai") {

        taxDue = calculateChinaTax(annualIncome);
        // console.log("Tax!!", annualIncome - taxDue);
        return annualIncome - taxDue;
    }
    // console.log("Total Tax Due: $" + (taxDue + taxDueState).toFixed(2));

    function calculateChinaTax(income) {
        baseline = 60000;
        if (income <= baseline) {
            return 0;
        } else if (income <= baseline + 36000) {
            return income * 0.03 + 0;
        } else if (income <= baseline + 144000) {
            return (income - 36000) * 0.1 + 1080;
        } else if (income <= baseline + 300000) {
            return (income - 144000) * 0.2 + 11880;
        } else if (income <= baseline + 420000) {
            return (income - 300000) * 0.25 + 43080;
        } else if (income <= baseline + 660000) {
            return (income - 420000) * 0.3 + 73080;
        } else if (income <= baseline + 960000) {
            return (income - 660000) * 0.35 + 145080;
        } else {
            return (income - 960000) * 0.45 + 250080;
        }
    }

    function calculateTaxSingle(income) {
        let baseCASingle2024 = 14600;
        if (income <= baseCASingle2024) {
            return 0;
        } else if (income <= baseCASingle2024 + 11600) {
            return income * 0.10;
        } else if (income <= baseCASingle2024 + 47150) {
            return 1160 + (income - 11600) * 0.12;
        } else if (income <= baseCASingle2024 + 101525) {
            return 5426 + (income - 47150) * 0.22;
        } else if (income <= baseCASingle2024 + 191950) {
            return 17168.50 + (income - 101525) * 0.24;
        } else if (income <= baseCASingle2024 + 243725) {
            return 39110.50 + (income - 191950) * 0.32;
        } else if (income <= baseCASingle2024 + 609350) {
            return 55678.50 + (income - 243725) * 0.35;
        } else {
            return 183147.25 + (income - 609350) * 0.37;
        }
    }

    function calculateTaxMarriedFilingJointly(income) {
        let baseCAJointly2024 = 29200;

        if (income <= baseCAJointly2024) {
            return 0;
        } else if (income <= baseCAJointly2024 + 23200) {
            return income * 0.10;
        } else if (income <= baseCAJointly2024 + 94400) {
            return 2320 + (income - 23200) * 0.12;
        } else if (income <= baseCAJointly2024 + 201050) {
            return 10852 + (income - 94400) * 0.22;
        } else if (income <= baseCAJointly2024 + 383900) {
            return 34337 + (income - 201050) * 0.24;
        } else if (income <= baseCAJointly2024 + 487450) {
            return 78281 + (income - 383900) * 0.32;
        } else if (income <= baseCAJointly2024 + 731200) {
            return 111357 + (income - 487450) * 0.35;
        } else {
            return 196669.50 + (income - 731200) * 0.37;
        }
    }

    function calculateTaxMarriedFilingSeparately(income) {
        if (income <= 11600) {
            return income * 0.10;
        } else if (income <= 47150) {
            return 1160 + (income - 11600) * 0.12;
        } else if (income <= 100525) {
            return 5426 + (income - 47150) * 0.22;
        } else if (income <= 191950) {
            return 17168.50 + (income - 100525) * 0.24;
        } else if (income <= 243725) {
            return 39110.50 + (income - 191950) * 0.32;
        } else if (income <= 365600) {
            return 55678.50 + (income - 243725) * 0.35;
        } else {
            return 98334.75 + (income - 365600) * 0.37;
        }
    }

    function calculateTaxHeadOfHousehold(income) {
        if (income <= 16550) {
            return income * 0.10;
        } else if (income <= 63100) {
            return 1655 + (income - 16550) * 0.12;
        } else if (income <= 100500) {
            return 7241 + (income - 63100) * 0.22;
        } else if (income <= 191950) {
            return 15469 + (income - 100500) * 0.24;
        } else if (income <= 243700) {
            return 43717 + (income - 191950) * 0.32;
        } else if (income <= 609350) {
            return 59377 + (income - 243700) * 0.35;
        } else {
            return 181954.50 + (income - 609350) * 0.37
        }
    }

    function calculateStateTaxSingle(income) {
        if (income <= 10412) {
            return income * 0.01;
        } else if (income <= 24684) {
            return 104.12 + (income - 10412) * 0.02;
        } else if (income <= 38959) {
            return 389.56 + (income - 24684) * 0.04;
        } else if (income <= 54081) {
            return 960.56 + (income - 38959) * 0.06;
        } else if (income <= 68350) {
            return 1867.88 + (income - 54081) * 0.08;
        } else if (income <= 349137) {
            return 3009.40 + (income - 68350) * 0.093;
        } else if (income <= 418961) {
            return 29122.59 + (income - 349137) * 0.103;
        } else if (income <= 698271) {
            return 36314.46 + (income - 418961) * 0.113;
        } else {
            return 67876.49 + (income - 698271) * 0.123;
        }
    }
    function calculateStateTaxMarriedFilingJointly(income) {
        if (income <= 20824) {
            return income * 0.01;
        } else if (income <= 49368) {
            return 208.24 + (income - 20824) * 0.02;
        } else if (income <= 77918) {
            return 779.12 + (income - 49368) * 0.04;
        } else if (income <= 108162) {
            return 1921.12 + (income - 77918) * 0.06;
        } else if (income <= 136700) {
            return 3735.76 + (income - 108162) * 0.08;
        } else if (income <= 698274) {
            return 6018.80 + (income - 136700) * 0.093;
        } else if (income <= 837922) {
            return 58245.18 + (income - 698274) * 0.103;
        } else if (income <= 1396542) {
            return 72628.92 + (income - 837922) * 0.113;
        } else {
            return 135752.98 + (income - 1396542) * 0.123;
        }
    }
    function calculateStateTaxHeadOfHousehold(income) {
        if (income <= 20839) {
            return income * 0.01;
        } else if (income <= 49371) {
            return 208.39 + (income - 20839) * 0.02;
        } else if (income <= 63644) {
            return 779.03 + (income - 49371) * 0.04;
        } else if (income <= 78765) {
            return 1349.95 + (income - 63644) * 0.06;
        } else if (income <= 93037) {
            return 2257.21 + (income - 78765) * 0.08;
        } else if (income <= 474824) {
            return 3398.97 + (income - 93037) * 0.093;
        } else if (income <= 569790) {
            return 38905.16 + (income - 474824) * 0.103;
        } else if (income <= 949649) {
            return 48686.66 + (income - 569790) * 0.113;
        } else {
            return 91610.73 + (income - 949649) * 0.123;
        }
    }

}



function calculateFinancialSituation() {


    const currentAge = parseInt(document.getElementById("currentAge").value);
    const retirementAge = parseInt(document.getElementById("retirementAge").value);
    const monthlyIncome = parseFloat(document.getElementById("monthlyIncome").value);
    const salaryIncreaseRate = parseFloat(document.getElementById("salaryIncreaseRate").value) / 100;
    const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
    const monthlyRentalExpenses = parseFloat(document.getElementById("monthlyRentalExpenses").value);
    const yearlyTravelExpenses = parseFloat(document.getElementById("yearlyTravelExpenses").value);
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const currentSavings = parseFloat(document.getElementById("currentSavings").value);
    const savingsInterestRate = parseFloat(document.getElementById("savingsInterestRate").value) / 100;
    const healthFactor = parseFloat(document.getElementById("healthFactor").value);
    const buyHouseCheckbox = document.getElementById("buyHouseCheckbox");


    let monthlySavings = currentSavings;
    let monthfinancialSituation = [];
    let yearfinancialSituation = [];
    let yearfinancialwithoutHouseSituation = [];
    let yearfinancialSituationWithHouse = [];
    let monthinflationRate = inflationRate / 12

    if (buyHouseCheckbox.checked) {
        housePrice = parseFloat(document.getElementById("housePrice").value);
        downPayment = parseFloat(document.getElementById("houseDownPayment").value) / 100;
        mortgageRate = parseFloat(document.getElementById("mortgageRate").value) / 100;
        mortgageTerm = parseFloat(document.getElementById("mortgageTerm").value);
        houseBuyingAge = parseInt(document.getElementById("houseBuyingAge").value);

        const mortgageEndYear = houseBuyingAge + mortgageTerm;

        let mortgageTermMonths = mortgageTerm * 12;
        let principal = housePrice * (1 - downPayment);
        let monthlyInterestRate = mortgageRate / 12;
        let HousePropertyTaxAfterdeduct = housePrice > 1000000 ? (housePrice - 1000000) * 0.01 : 0
        let HOAandInsurance = 1000
        let monthlySavingsWithHouse;

        flagB = 1
        for (let year = currentAge; year <= 100; year++) {
            let mortgagePaidPerMonth = 0;
            let taxDeductHouse = 0;
            let incomePerMonth;
            let expensePerMonth;
            if (year == houseBuyingAge) {
                monthlySavingsWithHouse = monthlySavings + housePrice;
            } else if (year < houseBuyingAge) {
                monthlySavingsWithHouse = monthlySavings;
            }
            for (let month = 1; month <= 12; month++) {

                //Expense Calculation
                let monthlyExpenseAfterInflation = monthlyExpenses * Math.pow((1 + monthinflationRate), (year - currentAge) * 12 + month);
                if (year < houseBuyingAge) {
                    expensePerMonth = monthlyExpenseAfterInflation + monthlyRentalExpenses + healthFactor

                } else if (year >= houseBuyingAge && year <= mortgageEndYear) {
                    mortgagePaidPerMonth = principal * (monthlyInterestRate * Math.pow((1 + monthlyInterestRate), mortgageTermMonths)) / (Math.pow((1 + monthlyInterestRate), mortgageTermMonths) - 1);
                    expensePerMonth = monthlyExpenseAfterInflation + mortgagePaidPerMonth + HousePropertyTaxAfterdeduct + HOAandInsurance + healthFactor;
                    taxDeductHouse = housePrice > 1000000 ? 1000000 : housePrice * 0.01;


                } else if (year > mortgageEndYear) {
                    expensePerMonth = monthlyExpenseAfterInflation + HousePropertyTaxAfterdeduct + HOAandInsurance + healthFactor;
                    mortgagePaidPerMonth = 0;
                }

                if (month == 12) {
                    expensePerMonth += yearlyTravelExpenses;
                }

                //Income Calculation
                if (year < retirementAge) {
                    incomePerMonth = calculateTotalTax((monthlyIncome * Math.pow((1 + salaryIncreaseRate / 12), (year - currentAge) * 12 + month)) + (monthlySavings * savingsInterestRate - expensePerMonth) / 12 - taxDeductHouse / 12) / 12;

                    if (year == houseBuyingAge && month == 1) {
                        if (incomePerMonth > housePrice * downPayment) {
                            incomePerMonth -= housePrice * downPayment
                        } else if (incomePerMonth + monthlySavings > housePrice * downPayment) {
                            monthlySavings -= (housePrice * downPayment - incomePerMonth)
                            monthlySavingsWithHouse -= (housePrice * downPayment - incomePerMonth)
                            incomePerMonth = 0;
                        };
                    }

                    // console.log(incomePerMonth + monthlySavings, expensePerMonth);
                    if ((incomePerMonth + monthlySavings) > expensePerMonth) {
                        monthlySavings += (incomePerMonth - expensePerMonth - healthFactor);
                        monthlySavingsWithHouse += (incomePerMonth - expensePerMonth - healthFactor);
                    } else {
                        console.log(year, month, incomePerMonth + monthlySavings, expensePerMonth);

                        if (flagB) {
                            document.getElementById('bankruptatAge').textContent = '' + year;
                            flagB -= 1
                        }
                        monthlySavings += incomePerMonth - expensePerMonth - healthFactor;
                        console.log('Retirement not feasible');
                        monthlySavingsWithHouse += incomePerMonth - expensePerMonth - healthFactor;

                    }
                } else if (year == retirementAge) {
                    if (monthlySavings > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12 - taxDeductHouse / 12)) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    document.getElementById('savingsAtRetirement').textContent = '$' + monthlySavings.toFixed(2);
                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavings += (incomePerMonth - healthFactor - expensePerMonth);
                        monthlySavingsWithHouse += (incomePerMonth - healthFactor - expensePerMonth);
                    } else {
                        monthlySavings -= healthFactor + expensePerMonth
                        monthlySavingsWithHouse -= healthFactor + expensePerMonth;
                    }

                } else if (year > retirementAge) {
                    if (monthlySavings > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12) - taxDeductHouse / 12) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavings += incomePerMonth - healthFactor - expensePerMonth;
                        monthlySavingsWithHouse += incomePerMonth - healthFactor - expensePerMonth;
                    } else {
                        monthlySavings -= healthFactor + expensePerMonth
                        monthlySavingsWithHouse -= healthFactor + expensePerMonth;
                    }
                }
            }
            console.log(year, monthlySavings)

            yearfinancialSituation.push({
                year: year,
                savings: monthlySavings
            });

            yearfinancialSituationWithHouse.push({
                year: year,
                savings: monthlySavingsWithHouse
            });

        }
        monthlySavingsC = currentSavings;

        flagC = 1
        for (let year = currentAge; year <= 100; year++) {
            let incomePerMonth;
            let expensePerMonth;

            for (let month = 1; month <= 12; month++) {
                //Expense Calculation
                let monthlyExpenseAfterInflation = monthlyExpenses * Math.pow((1 + monthinflationRate), (year - currentAge) * 12 + month);
                expensePerMonth = monthlyExpenseAfterInflation + +monthlyRentalExpenses + healthFactor;
                if (month == 12) {
                    expensePerMonth += yearlyTravelExpenses;
                }
                //Income Calculation
                if (year < retirementAge) {
                    incomePerMonth = calculateTotalTax((monthlyIncome * Math.pow((1 + salaryIncreaseRate / 12), (year - currentAge) * 12 + month)) + (monthlySavingsC * savingsInterestRate - expensePerMonth) / 12) / 12;

                    if ((incomePerMonth + monthlySavingsC) > expensePerMonth) {
                        monthlySavingsC += (incomePerMonth - expensePerMonth - healthFactor);
                    } else {
                        // console.log(year, month, incomePerMonth + monthlySavingsC, expensePerMonth);

                        if (flagC) {
                            document.getElementById('bankruptatAgeWithoutHouse').textContent = '' + year;
                            flagC -= 1
                        }
                        monthlySavingsC += incomePerMonth - expensePerMonth - healthFactor;
                        console.log('Retirement not feasible');

                    }
                } else if (year == retirementAge) {
                    if (monthlySavingsC > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavingsC * savingsInterestRate - expensePerMonth) / 12)) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    document.getElementById('savingsAtRetirementWithoutHouse').textContent = '$' + monthlySavingsC.toFixed(2);
                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavingsC += (incomePerMonth - healthFactor - expensePerMonth);
                    } else {
                        monthlySavingsC -= healthFactor + expensePerMonth
                    }

                } else if (year > retirementAge) {
                    if (monthlySavingsC > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavingsC * savingsInterestRate - expensePerMonth) / 12)) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavingsC += (incomePerMonth - healthFactor - expensePerMonth);
                    } else {
                        monthlySavingsC -= healthFactor + expensePerMonth
                    }
                }
            }
            // console.log(year, monthlySavingsC)

            yearfinancialwithoutHouseSituation.push({
                year: year,
                savings: monthlySavingsC
            });

        }
        // console.log(yearfinancialSituation, yearfinancialwithoutHouseSituation, yearfinancialSituationWithHouse);
        update3Chart(yearfinancialSituation, yearfinancialwithoutHouseSituation, yearfinancialSituationWithHouse);
    } else {

        monthlySavings = currentSavings;

        flagC = 1
        for (let year = currentAge; year <= 100; year++) {
            let incomePerMonth;
            let expensePerMonth;

            for (let month = 1; month <= 12; month++) {
                //Expense Calculation
                let monthlyExpenseAfterInflation = monthlyExpenses * Math.pow((1 + monthinflationRate), (year - currentAge) * 12 + month);
                expensePerMonth = monthlyExpenseAfterInflation + +monthlyRentalExpenses + healthFactor;
                if (month == 12) {
                    expensePerMonth += yearlyTravelExpenses;
                }
                //Income Calculation
                if (year < retirementAge) {
                    incomePerMonth = calculateTotalTax((monthlyIncome * Math.pow((1 + salaryIncreaseRate / 12), (year - currentAge) * 12 + month)) + (monthlySavings * savingsInterestRate - expensePerMonth) / 12) / 12;

                    if ((incomePerMonth + monthlySavings) > expensePerMonth) {
                        monthlySavings += (incomePerMonth - expensePerMonth - healthFactor);
                    } else {
                        // console.log(year, month, incomePerMonth + monthlySavings, expensePerMonth);

                        if (flagC) {
                            document.getElementById('bankruptatAgeWithoutHouse').textContent = '' + year;
                            flagC -= 1
                        }
                        monthlySavings += incomePerMonth - expensePerMonth - healthFactor;
                        console.log('Retirement not feasible');

                    }
                } else if (year == retirementAge) {
                    if (monthlySavings > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12)) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    document.getElementById('savingsAtRetirementWithoutHouse').textContent = '$' + monthlySavings.toFixed(2);
                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavings += (incomePerMonth - healthFactor - expensePerMonth);
                    } else {
                        monthlySavings -= healthFactor + expensePerMonth
                    }

                } else if (year > retirementAge) {
                    if (monthlySavings > 0) {
                        incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12)) / 12;
                    } else {
                        incomePerMonth = 0;
                    }

                    if (incomePerMonth > healthFactor + expensePerMonth) {
                        monthlySavings += (incomePerMonth - healthFactor - expensePerMonth);
                    } else {
                        monthlySavings -= healthFactor + expensePerMonth
                    }
                }
            }
            // console.log(year, monthlySavings)

            yearfinancialwithoutHouseSituation.push({
                year: year,
                savings: monthlySavings
            });

        }
        updateChart(yearfinancialwithoutHouseSituation);
    }
}
// function calculateFinancialSituation() {


//     const currentAge = parseInt(document.getElementById("currentAge").value);
//     const retirementAge = parseInt(document.getElementById("retirementAge").value);
//     // const housePrice = parseFloat(document.getElementById("housePrice").value);
//     // const downPayment = parseFloat(document.getElementById("houseDownPayment").value);
//     // const mortgageRate = parseFloat(document.getElementById("mortgageRate").value) / 100;
//     // const mortgageTerm = parseFloat(document.getElementById("mortgageTerm").value);
//     const monthlyIncome = parseFloat(document.getElementById("monthlyIncome").value);
//     // const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;

//     const salaryIncreaseRate = parseFloat(document.getElementById("salaryIncreaseRate").value) / 100;
//     const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
//     const monthlyRentalExpenses = parseFloat(document.getElementById("monthlyRentalExpenses").value);
//     const yearlyTravelExpenses = parseFloat(document.getElementById("yearlyTravelExpenses").value);

//     const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
//     const currentSavings = parseFloat(document.getElementById("currentSavings").value);
//     const savingsInterestRate = parseFloat(document.getElementById("savingsInterestRate").value) / 100;
//     const healthFactor = parseFloat(document.getElementById("healthFactor").value);
//     // const houseBuyingAge = parseInt(document.getElementById("houseBuyingAge").value);

//     const buyHouseCheckbox = document.getElementById("buyHouseCheckbox");

//     // const taxStatus = document.getElementById('taxStatus').value;
//     // const taxPlace = document.getElementById('taxPlace').value;


//     if (buyHouseCheckbox.checked) {
//         housePrice = parseFloat(document.getElementById("housePrice").value);
//         downPayment = parseFloat(document.getElementById("houseDownPayment").value) / 100;
//         mortgageRate = parseFloat(document.getElementById("mortgageRate").value) / 100;
//         mortgageTerm = parseFloat(document.getElementById("mortgageTerm").value);
//         houseBuyingAge = parseInt(document.getElementById("houseBuyingAge").value);

//     } else {
//         housePrice = 0;
//         downPayment = 0;
//         mortgageRate = 0;
//         mortgageTerm = 0;
//         houseBuyingAge = 0;
//     }

//     console.log("Current Age:", currentAge);
//     console.log("Retirement Age:", retirementAge);
//     console.log("Place:", taxPlace);

//     console.log("House Price:", housePrice);
//     console.log("Down Payment:", downPayment);
//     console.log("Mortgage Rate:", mortgageRate);
//     console.log("Mortgage Term:", mortgageTerm);
//     console.log("Monthly Income:", monthlyIncome);
//     console.log("Salary Increase Rate:", salaryIncreaseRate);
//     console.log("Monthly Expenses:", monthlyExpenses);
//     console.log("Inflation Rate:", inflationRate);
//     console.log("Current Savings:", currentSavings);
//     console.log("Savings Interest Rate:", savingsInterestRate);
//     console.log("Health Factor:", healthFactor);
//     console.log("House Buying Age:", houseBuyingAge);


//     let monthlySavings = currentSavings;
//     let monthfinancialSituation = [];
//     let yearfinancialSituation = [];
//     const mortgageEndYear = houseBuyingAge + mortgageTerm;

//     let mortgageTermMonths = mortgageTerm * 12;
//     let principal = housePrice * (1 - downPayment);
//     let monthlyInterestRate = mortgageRate / 12;
//     let monthinflationRate = inflationRate / 12
//     let HouseProperty = housePrice > 1000000 ? housePrice - 1000000 : 0
//     let HOAandInsurance = 1000
//     // let taxDeducted = monthlyIncome;
//     flagB = 1
//     for (let year = currentAge; year <= 100; year++) {
//         let mortgagePaidPerMonth = 0;
//         let incomePerMonth;
//         let expensePerMonth;

//         if (year >= houseBuyingAge && year < mortgageEndYear) {
//             mortgagePaidPerMonth = principal * (monthlyInterestRate * Math.pow((1 + monthlyInterestRate), mortgageTermMonths)) / (Math.pow((1 + monthlyInterestRate), mortgageTermMonths) - 1);

//             expensePerMonth = (monthlyExpenses * Math.pow((1 + monthinflationRate), (year - currentAge))) + mortgagePaidPerMonth + housePrice * 0.01 + HOAandInsurance

//         } else {
//             expensePerMonth = (monthlyExpenses * Math.pow((1 + monthinflationRate), (year - currentAge))) + mortgagePaidPerMonth + monthlyRentalExpenses;
//             mortgagePaidPerMonth = 0;
//         }

//         for (let month = 1; month <= 12; month++) {

//             // console.log(year, mortgagePaidPerMonth, expensePerMonth, incomePerMonth, monthlySavings);
//             if (month == 12) {
//                 expensePerMonth += yearlyTravelExpenses;
//             }

//             if (year < retirementAge) {
//                 incomePerMonth = (calculateTotalTax((monthlyIncome * Math.pow((1 + salaryIncreaseRate), (year - currentAge))) + (monthlySavings * savingsInterestRate - expensePerMonth) / 12 + hou)) / 12;

//                 if (year == houseBuyingAge && month == 1) {
//                     // console.log(housePrice * downPayment,);
//                     if (incomePerMonth > housePrice * downPayment) {
//                         incomePerMonth -= housePrice * downPayment
//                     } else if (incomePerMonth + monthlySavings > housePrice * downPayment) {
//                         monthlySavings -= (housePrice * downPayment - incomePerMonth)
//                         incomePerMonth = 0
//                     };
//                 }

//                 let boolSoso = (incomePerMonth + monthlySavings) > expensePerMonth;
//                 let boolNo = (incomePerMonth + monthlySavings) < expensePerMonth;
//                 // console.log(year, boolSoso, boolNo);
//                 if (boolSoso) {
//                     monthlySavings += (incomePerMonth - expensePerMonth - healthFactor);
//                 } else if (boolNo) {
//                     // console.log(year, flagB);
//                     if (flagB) {
//                         // console.log(year, flagB);
//                         document.getElementById('bankruptatAge').textContent = '' + year;
//                         flagB -= 1
//                     }
//                     // console.log(year, month, expensePerMonth, mortgagePaidPerMonth, incomePerMonth, monthlySavings);
//                     monthlySavings += (incomePerMonth - expensePerMonth - healthFactor);
//                     console.log('Retirement not feasible');
//                     // return;

//                 }
//             } else if (year == retirementAge) {
//                 if (monthlySavings > 0) {
//                     incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12)) / 12;
//                 } else {
//                     incomePerMonth = 0;
//                 }

//                 document.getElementById('savingsAtRetirement').textContent = '$' + monthlySavings.toFixed(2);
//                 if (incomePerMonth > healthFactor + expensePerMonth) {
//                     monthlySavings += (incomePerMonth - healthFactor - expensePerMonth);
//                 } else {
//                     monthlySavings -= healthFactor + expensePerMonth
//                 }

//             } else if (year > retirementAge) {
//                 if (monthlySavings > 0) {
//                     incomePerMonth = (calculateTotalTax((monthlySavings * savingsInterestRate - expensePerMonth) / 12)) / 12;
//                 } else {
//                     incomePerMonth = 0;
//                 }

//                 // console.log(monthlySavings * savingsInterestRate * 0.9 / 12);
//                 if (incomePerMonth > healthFactor + expensePerMonth) {
//                     monthlySavings += (incomePerMonth - healthFactor - expensePerMonth);
//                 } else {
//                     monthlySavings -= healthFactor + expensePerMonth
//                 }
//             }

//             monthfinancialSituation.push({
//                 year: year,
//                 month: month,
//                 savings: monthlySavings
//             });
//         }
//         yearfinancialSituation.push({
//             year: year,
//             savings: monthlySavings
//         });

//     }


//     console.log(yearfinancialSituation);
//     // updatemonthChart(monthfinancialSituation)
//     updateChart(yearfinancialSituation);
// }
// function updatemonthChart(financialSituation) {
//     var ctx = document.getElementById('savingsmonthChart').getContext('2d');

//     var labels = financialSituation.map(function (item) {
//         return "Age " + item.year;
//     });

//     var data = financialSituation.map(function (item) {
//         return item.savings;
//     });


//     if (window.mySavingsChart) {
//         window.mySavingsChart.destroy();
//     }

//     window.mySavingsChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Total Savings Over Time',
//                 data: data,
//                 fill: false,
//                 borderColor: 'rgb(118, 15, 246)',
//                 tension: 0.1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: {
//                         display: true,
//                         text: 'Savings ($)'
//                     }
//                 },
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Age'
//                     }
//                 }
//             },
//             responsive: true,
//             maintainAspectRatio: true
//         }
//     });
// }
