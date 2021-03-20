window.addEventListener('load', function() {
	let countryList = ["Indonesia", "New Zealand"]
	let from = document.getElementById("from")
	let to = document.getElementById("to")
	let next = document.querySelector("button")
	let inputAmount = document.getElementById("inputAmount")
	let senderSend = document.getElementById("senderSend")
	let recipientGet = document.getElementById("recipientGet")
	let fee = document.getElementById("fee")
	let symbol = document.getElementById("symbol")
	let container1 = document.getElementById("container1")
	let container2 = document.getElementById("container2")
	let rate = document.getElementById("rate")

	inputAmount.setAttribute("disabled", true)
	inputAmount.setAttribute("placeholder", "Please Select Country First")
	next.setAttribute("disabled", true)

	for(let i = 0; i < countryList.length; i++) {
		let option = document.createElement("option")
  		option.text = countryList[i]
  		option.value = i + 1
		from.add(option)
	}

	function currencyFormat(angka) {
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
		split		= number_string.split(','),
		sisa		= split[0].length % 3,
		currency 	= split[0].substr(0, sisa),
		ribuan		= split[0].substr(sisa).match(/\d{3}/gi)

		if(ribuan){
			separator = sisa ? '.' : ''
			currency += separator + ribuan.join('.')
		}

		return currency = split[1] != undefined ? currency + ',' + split[1] : currency
	}

	from.addEventListener("change", function() {
		to.length = 1
		for(let i = 0; i < countryList.length; i++){
			let option = document.createElement("option")
	  		option.text = countryList[i]
	  		option.value = i + 1
			to.add(option)
		}

		switch(from.value) {
			case "1" :
				symbol.innerText = "IDR"
				to.options[1].disabled = true
				to.value = 0
				break
			case "2" :
				symbol.innerText = "NZD"
				to.options[2].disabled = true
				to.value = 0
				break
		}

		inputAmount.setAttribute("disabled", true)
		inputAmount.setAttribute("placeholder", "Please Select Country First")
		next.setAttribute("disabled", true)
    })

	to.addEventListener("change", function() {
		inputAmount.removeAttribute("disabled")
		inputAmount.removeAttribute("placeholder")

		inputAmount.addEventListener('keyup', function(e){
			inputAmount.value = currencyFormat(this.value)
			if (inputAmount.value == "") {
				next.setAttribute("disabled", true)
			} else {
				next.removeAttribute("disabled")
			}
		})

		if (inputAmount.value !== "") {
			next.removeAttribute("disabled")
		} else {
			next.setAttribute("disabled", true)
		}
	})

	next.addEventListener("click", async function () {
		let sendAmount = parseInt(inputAmount.value.replaceAll(".", ""))
		let res = await fetch("https://data.fixer.io/api/convert?access_key=59fbf81af567c668fc4694fb20a783ba&from=NZD&to=IDR&amount=1")
		let data = await res.json()


		switch(from.value) {
			case "1" :
				if (sendAmount >= 500000) {
					switch(to.value) {
						case "2" :
							rate.innerText = `Our rate is ${currencyFormat((Math.round(data.result + (data.result * 0.005))).toString())}`
							recipientGet.innerText = `Your Recipient Get NZD ${currencyFormat((Math.round(sendAmount / (data.result + (data.result * 0.005)))).toString())}`
							break
					}
					container1.setAttribute("hidden", true)
					container2.removeAttribute("hidden")
					senderSend.innerText = "You Send IDR " + inputAmount.value
				} else {
					alert("Minimum transfer is IDR 500.000")
				}
				break
			case "2" :
				if (sendAmount > 7) {
					switch(to.value) {
						case "1" :
							fee.innerText = "Our Fee is NZD 7"
							rate.innerText = `Our rate is ${currencyFormat((Math.round(data.result - (data.result * 0.01))).toString())}`
							recipientGet.innerText = `Your Recipient Get IDR ${currencyFormat(Math.round(((sendAmount - 7) * (data.result)) - (((sendAmount - 7) * (data.result)) * 0.01)).toString())}`
							break
					}
					container1.setAttribute("hidden", true)
					container2.removeAttribute("hidden")
					senderSend.innerText = "You Send NZD " + inputAmount.value
				} else {
					alert("Our Fee is NZD 7")
				}
				break
		}
	})
})