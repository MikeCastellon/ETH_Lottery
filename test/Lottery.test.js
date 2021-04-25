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

    it('requires min ammount of ether to enter', async() =>{
      try{
        await lottery.methods.enter().send({
          from: accounts[0],
          value: 0
        })
        assert(false)
      } catch(err){
        assert(err)
      }
    })

    it('only manager can pickWinner', async() => {
      try{
        await lottery.methods.pickWinner().send({
          accounts: account[1]
        })
        assert(false)
      }catch(err){
        assert(err)
      }
    }) 

    it('sends money to winner and resets players pool', async() => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('2', 'ether')
      })

      const initialBalance = await web3.eth.getBalance(accounts[0])

      await lottery.methods.pickWinner().send({
        from: accounts[0]
      })

      const finalBalance = await web3.eth.getBalance(accounts[0])
      const difference = finalBalance - initialBalance
      assert(difference > web3.utils.toWei( '1.8', 'ether'))
      
    })
} )
    