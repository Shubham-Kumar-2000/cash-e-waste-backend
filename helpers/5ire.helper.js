const { Keyring, WsProvider, ApiPromise } = require('@5ire/api');
const { generateMnemonic } = require('bip39');

// Initialize the API as we would normally do
const wsProvider = new WsProvider('wss://shiva.testnet.5ire.network/ws');
const api = new ApiPromise({ provider: wsProvider });

// const main = async ()=>{
//     await api.isReady;
//     console.log(await api.rpc.system.localListenAddresses());
//     const chain = await api.rpc.system.chain();
//     const lastHeader = await api.rpc.chain.getHeader();

// // Log the information
// console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

//     // Create a keyring instance
//     const keyring = new Keyring({ type: 'sr25519' });
//     const PHRASE = 'reduce increase combine reflect retreat pistol hip off rug purse echo lion';
//     const alice = keyring.addFromUri(PHRASE);

//     const bob = keyring.addFromUri("predict guitar polar sniff meat laptop clog inflict illness celery lamp dutch");
//     let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(alice.publicKey);

//     console.log(`${alice.publicKey} has a balance of ${previousFree}, nonce ${previousNonce}`);
//     console.log(`You may leave this example running and start example 06 or transfer any value to ${alice.publicKey}`);

//     // Create a transaction
//     const txHash = await api.tx.balances
//         .transfer(bob.address,"1000000000000000000")
//         .signAndSend(alice);
//         // "0x117227"
//     console.log(`Submitted with hash ${txHash}`);
// }
// predict guitar polar sniff meat laptop clog inflict illness celery lamp dutch

exports.getKeyRing = async (phrase) => {
    await api.isReady;
    const keyring = new Keyring({ type: 'sr25519' });
    return keyring.addFromUri(phrase);
};

exports.createAccount = async (name) => {
    await api.isReady;
    const keyring = new Keyring({ type: 'sr25519' });
    const phrase = generateMnemonic();
    await keyring.addFromUri(phrase, { name });
    return phrase;
};

exports.transfer = async (address, amount) => {
    await api.isReady;
    const keyring = new Keyring({ type: 'sr25519' });
    const us = keyring.addFromUri(process.env.FIRE_PHRASE);
    const txHash = await api.tx.balances
        .transfer(address, `${amount}`)
        .signAndSend(us);
    return txHash;
};

exports.getBalance = async (publicKey) => {
    await api.isReady;
    const {
        data: { free: balance },
        nonce
    } = await api.query.system.account(publicKey);
    return { balance, nonce };
};
// main()
