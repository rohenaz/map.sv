
goog.module('controllers.creator')

const CurrentClass = goog.require('concerns.current')
const Current = new CurrentClass()
class CreatorCntrl extends Silica.Controllers.Base {

  constructor(element) {
    super(element)
    this.bcontent = `# Welcome to the Future ![image](b://5a37057a8bfddb76c60e226f1fd20eac94ba4dc299a53dd134df026341e94571)`
    this.appField = 'demo-app'
    this.typeField = 'comment'

    this.enableB = true

    this.step1 = true
    this.step2 = false
    this.step3 = false
    this.step4 = false
    this.step5 = false

    this.keys = []

    // Make a random api key
    let privateKey = satchel.bsv.PrivateKey.fromRandom()
    let publicKey = satchel.bsv.PublicKey.fromPrivateKey(privateKey)
    this.apiKey = this.address() || satchel.bsv.Address.fromPublicKey(publicKey)

    window.addEventListener('popstate', () => {
      console.log('pop!')
    })

    this.broadcastSub = Silica.sub('tx-broadcasted', (resTx) => {
      
      this.responseTx = resTx.hash
      this.goToStep(null, 5)
    })

    window.Current = Current
  }

  addKey () {
    console.log('adding key')
    this.keys.push({
      key: '',
      value: ''
    })
  }

  href () {
    return window.location.href
  }

  onDestroy () {
    Silica.unsub(this.broadcastSub)
  }

  dynamicBitquery () {
    return `let query = {
  "v": 3,
  "q": {
    "find": {
      "MAP.app": "` + this.appField + `",
    }
  }
}`
  }

  bitqueryFetch () {
    return `// Turn the query into base64 encoded string.
let url = 'https://b.map.sv/q/'

// Attach API KEY as header
let header = {
  // Replace with your API key
  headers: { key: '` + this.apiKey + `' }
}

// base 64 query
let b64 = btoa(JSON.stringify(query))

// Make an HTTP request to bmap endpoint
fetch(url + b64, header).then((r) => {
  return r.json()
}).then( (r) => {

  // Confirmed and unconfirmed
  let items = r.c.concat(r.u)

  let results = document.createElement('div')
  
  items.forEach((item) => {
    
    // Show the Tx Hash
    let el = document.createElement('p')
    el.innerHTML += 'Tx:' + item.tx.h
    results.appendChild(el)

    // Show B content type
    el = document.createElement('p')
    el.innerHTML += 'B Content-Type:' + item.B['content-type']
    results.appendChild(el)

    // Display all MAP keys and values
    for (key in item.MAP) {
      // Show 
      el = document.createElement('p')
      el.innerHTML +=  key + ': ' + item.MAP[key]
      results.appendChild(el)
    }

    let hr = document.createElement('hr')
    results.appendChild(hr)
  })

  document.body.appendChild(results)
}).catch((e) => { console.error('error' + e) } )
`
  }

  buildTxScript () {
return `function socketCallback(data) {
  // socket callback for wallet updates
  console.log('socket callback')
}

function walletLoaded(data) {
  // wallet callback when wallet loaded
  console.log('wallet loaded callback')
}

/* INIT SATCHEL */
// make a random address to use as an api key
// you can just use your own api key here :)
let privateKey = satchel.bsv.PrivateKey.fromRandom()
let publicKey = satchel.bsv.PublicKey.fromPrivateKey(privateKey)
let apiKey = satchel.bsv.Address.fromPublicKey(publicKey)
satchel.init({
  'planariaApiKey': apiKey,
  'feePerKb': 1000,
  'bitsocketCallback': (data) => { socketCallback(data) }
}, (data) => { walletLoaded(data) })

function loginPrompt () {

}

function createTx () {
  let tx = new satchel.bsv.Transaction()
  tx.from(satchel.getUtxos())
  tx = satchel.addOpReturnData(tx, data)
  tx.feePerKb(satchel.feePerKb)
  tx.change(satchel.getAddress())
  tx = satchel.cleanTxDust(tx)
  tx = tx.sign(satchel.getPrivateKey())

  satchel.broadcastTx(tx, (resTx) => {
    // Do something with the response
    setTimeout(() => {
      satchel.updateUtxos()
    }, 2000)
  }, (err) => {
    console.log('on error', err)
  }, {
    safe: true,
    testing: false
  })
}`
  }

  address () {
    return satchel.isLoggedIn() ? satchel.getAddressStr() : null
  }

  dynamicBitsocket () {
    return `
// Subscribe to EventSource
var socket = new EventSource('https://b.map.sv/s/' + b64)
// Handle new messages
socket.onmessage = function(e) {
  document.write("<pre>" + JSON.stringify(JSON.parse(e.data), null, 2) + "</pre>")
}`
  }

  disableB () {
    return !this.enableB
  }

  dynamicBitqueryScript () {
    
    let str = this.dynamicBitquery()
    str += this.bitqueryFetch(this.apiKey)
    str += this.dynamicBitsocket()

    return str
  }

  generateDisabled () {
    return !Current.walletInitialized || !satchel || !satchel.isLoggedIn() || satchel.getBalance() === 0
  }
  generateHtml () {
    return '<i class="' + (Current.pendingTx ? 'fas fa-satellite-dish' : 'fa fa-certificate') + '"></i>&nbsp;&nbsp;' + (Current.pendingTx ? 'Broadcast Tx' : 'Generate Tx')
  }

  goToStep (el, param) {
    this.step1 = false
    this.step2 = false
    this.step3 = false
    this.step4 = false
    this.step5 = false
    
    Silica.goTo('?p=' + param)
    // history.pushState({}, '?p=' + param,)
    // window.dispatchEvent(new Event('popstate'))
    switch(parseInt(param)) {
      case 1:
        this.step1 = true
        break
      case 2:
        this.step2 = true
      break
      case 3:
        this.step3 = true
      break
      case 4:
        this.step4 = true
      break
      case 5:
        this.step5 = true
    }
  }

  pendingTxStr() {
    return Current.pendingTx ? Current.pendingTx.toString() : null
  }

  decodeTxURL() {
    return Current.pendingTx ? 'https://live.blockcypher.com/btc/decodetx/?t=' + this.pendingTxStr() : null
  }

  fatURI () {
    if (!Current.pendingTx) { return }
    return 'bitcoin:?tx=' + this.pendingTxStr()
  }

  loggedIn () {
    return satchel.isLoggedIn()
  }

  showHeading () {
    return !this.step1 && !this.step5
  }

  activeClass (param) {
    switch (parseInt(param)) {
      case 1:
        return this.step1 ? 'active' : ''
      case 2:
        return this.step2 ? 'active' : ''
      case 3:
        return this.step3 ? 'active' : ''
      case 4:
        return this.step4 ? 'active' : ''
      case 5:
        return this.step5 ? 'active' : ''
      default:
        return ''
    } 
  }

  makeBmapTx () {
    Silica.pub('make-bmap-tx')
  }

  openDemo () {
    
    // Open Demo Popup
    let popup = open('', 'BMAP App Demo - ' + this.appField, "width=660,height=460")

    let satchelScript = popup.document.createElement('script')
    satchelScript.src = 'https://cdn.jsdelivr.net/npm/bsv-satchel/dist/satchel.min.js'
    satchelScript.onload = () => {
      console.log('satchel loaded')
    }
    popup.document.head.appendChild(satchelScript)

    let script = popup.document.createElement('script')
    script.type = 'text/javascript'
    script.text = this.dynamicBitqueryScript()
    script.text += `
    ` + this.buildTxScript()
    popup.document.head.appendChild(script)

    let satchelButton = popup.document.createElement('button')
    satchelButton.innerText = 'Load Wif'
    satchelButton.onclick = () => {
      let wif = prompt('Enter WIF', '')
      // TODO
      if (wif && wif.length === 52) {
        popup.satchel.login(wif, () => {
          console.log('logged in')
        })
      }
    }
    popup.document.body.appendChild(satchelButton)

    let textarea = document.createElement('textarea')
    let html = popup.document.body.parentElement.outerHTML
    textarea.style.display = 'none'
    textarea.style.position = 'absolute'
    textarea.style.top = 0
    textarea.style.left = 0
    textarea.style.width = '100vw'
    textarea.style.height = '100vh'
    textarea.innerText = html
    popup.document.body.appendChild(textarea)

    // "Show Code" button
    let codeButton = popup.document.createElement('button')
    codeButton.innerText = 'See Code'
    codeButton.onclick = () => {
      popup.document.querySelector('textarea').style.display = 'block'
    }
    popup.document.body.appendChild(codeButton)

  }

  opReturnPreview () {
    return 'OP_RETURN\n' + this.getData().map(pd => { return pd.v }).join('\n')
  }

  updatePreview () {
    console.log('update the preview...', this.opReturnPreview())
  }

  getData () {

    let data = [
      {"type": "str", "v": "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5"},
      {"type": "str", "v": "SET"},
      {"type": "str", "v": "app"},
      {"type": "str", "v": this.appField},
      {"type": "str", "v": "type"},
      {"type": "str", "v": this.typeField},
    ]

    if (this.enableB) {
      data.unshift({"type": "str", "v": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"},
        {"type": "str", "v": this.bcontent },
        {"type": "str", "v": "text/markdown"},
        {"type": "str", "v": "UTF-8"},
        {"type": "str", "v": "demo.md"},
        {"type": "str", "v": "|"})
    }

    // Set MAP Keys
    for (let key of this.keys) {
      if (key.name && key.value) {
        console.log('setting key', key.name)
        data.push({"type": "str", "v": key.name})
        data.push({"type": "str", "v": key.value})
      }
    }
    Current.data = data
    return data
  }
}

CreatorCntrl.watchers = {
  'href': function (newVal, oldVal) {
    console.log('href changed', newVal, oldVal)
    const params = new URLSearchParams(window.location.search)
    const p = params.get("p")
    if (p) {
      this.goToStep(null, p)
    }
  }
}

const pushUrl = (href) => {
  history.pushState({}, '', href)
  window.dispatchEvent(new Event('popstate'))
}

exports = CreatorCntrl
