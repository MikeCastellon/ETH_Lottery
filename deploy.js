const HdWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')

const provider = new HdWalletProvider(
    'wave cover mystery leisure educate guide humor purse dutch wet drum helmet',
    'https://rinkeby.infura.io/v3/1a49ae3796094606964d25e3d55290fb'
    )

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log( 'Attemping to deploy to this account:', accounts[0] )

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [ 'HI there ! :)']})
    .send({ gas: 1000000, from: accounts[0]})

    console.log('Contract deployed to:', result.options.address)
}

deploy()