import React, { useCallback, useEffect, useState } from 'react'

import { PageHeader } from 'antd'
import { useUserAddress } from 'eth-hooks'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import Container from 'react-bootstrap/Container'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

import { Account, ThemeSwitch } from './components'
import { INFURA_ID } from './constants'
import Erc20Container from './containers/Erc20Container'
import { useUserProvider } from './hooks'


import 'antd/dist/antd.css'

const mainnetInfura = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)

function App() {
    const mainnetProvider = mainnetInfura

    const [injectedProvider, setInjectedProvider] = useState();
    const address = useUserAddress(injectedProvider);
    const userProvider = useUserProvider(injectedProvider);

    const [network, setNetwork] = useState("");


    (async function () {
        if (userProvider) {
            const network = await userProvider.getNetwork()
            setNetwork(
                network.chainId === 1 ? "mainnet" :
                    network.chainId === 4 ? "rinkeby" :
                        "unsupported network"
            )
        }
    })()

    const blockExplorer = network == 'rinkeby' ? 'https://rinkeby.etherscan.io/' : 'https://etherscan.io/'

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
    }, [loadWeb3Modal]);


    return (
        <div className="App">
            <ThemeSwitch />
                <Router>
                    <Container>
                        <PageHeader
                            title={<a href="/">xgm.studio/airdrop</a>}
                            className="site-page-header"
                            extra={[
                                <Account
                                    address={address}
                                    network={network}
                                    // localProvider={localProvider}
                                    userProvider={userProvider}
                                    mainnetProvider={mainnetProvider}
                                    // price={price}
                                    web3Modal={web3Modal}
                                    loadWeb3Modal={loadWeb3Modal}
                                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                                    blockExplorer={blockExplorer}
                                />
                            ]}
                        >
                        </PageHeader>
                    </Container>
                    <Route exact path="/" component={() => <Erc20Container web3Modal={web3Modal} network={network} />} />
                </Router>
        </div>
    );
}

const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
});

const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
        window.location.reload();
    }, 1);
};

window.ethereum && window.ethereum.on('chainChanged', chainId => {
    setTimeout(() => {
        window.location.reload();
    }, 1);
})

export default App