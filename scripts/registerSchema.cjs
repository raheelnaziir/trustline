const { SchemaRegistry } = require('@ethereum-attestation-service/eas-sdk')
const { ethers } = require('ethers')
const { readFileSync } = require('fs')

const envFile = readFileSync('.env.local', 'utf8')
const PRIVATE_KEY = envFile.match(/PRIVATE_KEY=(.+)/)?.[1]?.trim()

if (!PRIVATE_KEY) {
    console.error('Add PRIVATE_KEY to your .env.local file')
    process.exit(1)
}

const SCHEMA_REGISTRY_ADDRESS = '0x4200000000000000000000000000000000000020'

const provider = new ethers.JsonRpcProvider('https://sepolia.base.org')
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS)
schemaRegistry.connect(signer)

const schema = 'address requester, string relationship, string company, string content, uint8 rating'
const resolverAddress = '0x0000000000000000000000000000000000000000'
const revocable = true

async function main() {
    console.log('Registering schema on Base Sepolia...')
    console.log('Signer:', signer.address)

    const balance = await provider.getBalance(signer.address)
    console.log('Balance:', ethers.formatEther(balance), 'ETH')

    if (balance === 0n) {
        console.error('No ETH. Get some at: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet')
        process.exit(1)
    }

    const tx = await schemaRegistry.register({
        schema,
        resolverAddress,
        revocable,
    })

    console.log('Waiting for confirmation...')
    const schemaUID = await tx.wait()
    console.log('✅ Schema registered!')
    console.log('Schema UID:', schemaUID)
}

main().catch(console.error)