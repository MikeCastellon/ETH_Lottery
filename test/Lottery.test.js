const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const web3 = new Web3(ganache.provider())

const { bytecode, interface } = require('../compile.js')

let lottery
let accounts

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({from: accounts[0], gas: '1000000'})
})

describe('Lottery Contract', () =>{
    
  it('Deploys a contract', () => {
      assert.ok(lottery.options.address)  
    }) 

  it('enter one person', async() => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      })

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      })

      assert.strictEqual(accounts[0], players[0])
      assert.strictEqual(1, players.length)
    })

    it('enter multiple accounts', async() => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      })
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.02', 'ether')
      })
      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei('0.02', 'ether')
      })

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      })

      assert.strictEqual(accounts[0], players[0])
      assert.strictEqual(accounts[1], players[1])
      assert.strictEqual(accounts[2], players[2])
      assert.strictEqual(3, players.length)
    })
} )
    