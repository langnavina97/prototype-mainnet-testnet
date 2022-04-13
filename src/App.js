import React, { Component } from "react";

// Mainnet
import IndexSwap from "./abis/IndexSwap.json";
import IndexToken from "./abis/indexToken.json";
import NFTSwap from "./abis/NFTPortfolio.json";

// Testnet
import IndexSwap2 from "./abis2/IndexSwap.json";
import IndexToken2 from "./abis2/indexToken.json";
import NFTSwap2 from "./abis2/NFTPortfolio.json";

import IERC from "./abis/IERC20.json";
import pancakeSwapRouter from "./abis/IPancakeRouter02.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Grid, Button, Card, Form, Input, Image, Dropdown, Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import velvet from "./velvet.png";
import metamask from "./metamask-fox.svg";
import swal from 'sweetalert';

import "./App.css";

const axios = require('axios');

const networks = {
  bscTestnet: {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "https://data-seed-prebsc-1-s2.binance.org:8545/",
      "https://data-seed-prebsc-2-s2.binance.org:8545/",
      "https://data-seed-prebsc-1-s3.binance.org:8545/",
      "https://data-seed-prebsc-2-s3.binance.org:8545/"
    ],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
      account: '',
      SwapContract: null,
      NFTTokenContract: null,
      DeFiTokenContract: null,
      NFTPortfolioContract: null,

      SwapContract2: null,
      NFTTokenContract2: null,
      DeFiTokenContract2: null,
      NFTPortfolioContract2: null,

      address: "",
      connected: false,
      
      chainId: "",

      defiToMintMainnet: 0,
      nftToMintMainnet: 0,

      withdrawValueDefi: 0,
      withdrawValueNFT: 0,

      nftTokenBalance: 0,
      defiTokenBalance: 0,

      btcTokenBalance: 0,
      ethTokenBalance: 0,
      shibaTokenBalance: 0,
      xrpTokenBalance: 0,
      ltcTokenBalance: 0,
      daiTokenBalance: 0,
      makerTokenBalance: 0,
      linkTokenBalance: 0,
      uniTokenBalance: 0,
      aaveTokenBalance: 0,

      btcTokenBalanceBnb: 0,
      ethTokenBalanceBnb: 0,
      shibaTokenBalanceBnb: 0,
      xrpTokenBalanceBnb: 0,
      ltcTokenBalanceBnb: 0,
      daiTokenBalanceBnb: 0,
      makerTokenBalanceBnb: 0,
      linkTokenBalanceBnb: 0,
      uniTokenBalanceBnb: 0,
      aaveTokenBalanceBnb: 0,

      axsTokenBalance: 0,
      racaTokenBalance: 0,
      mboxTokenBalance: 0,
      mcTokenBalance: 0,
      aliceTokenBalance: 0,
      xtzTokenBalance: 0,
      galaTokenBalance: 0,
      chzTokenBalance: 0,
      enjTokenBalance: 0,
      roseTokenBalance: 0,

      axsTokenBalanceBnb: 0,
      racaTokenBalanceBnb: 0,
      mboxTokenBalanceBnb: 0,
      mcTokenBalanceBnb: 0,
      aliceTokenBalanceBnb: 0,
      xtzTokenBalanceBnb: 0,
      galaTokenBalanceBnb: 0,
      chzTokenBalanceBnb: 0,
      enjTokenBalanceBnb: 0,
      roseTokenBalanceBnb: 0,

      lunaTokenBalance: 0,
      stethTokenBalance: 0,

      btcTokenBalanceBnb: 0,
      lunaTokenBalanceBnb: 0,

      sandTokenBalance: 0,
      thetaTokenBalance: 0,
      flowTokenBalance: 0,
      xtzTokenBalance: 0,
      galaTokenBalance: 0,
      chzTokenBalance: 0,
      enjTokenBalance: 0,
      roseTokenBalance: 0,

      manaTokenBalance: 0,
      sandTokenBalance: 0,
      thetaTokenBalance: 0,
      flowTokenBalance: 0,
      xtzTokenBalance: 0,
      galaTokenBalance: 0,
      chzTokenBalance: 0,
      enjTokenBalance: 0,
      roseTokenBalance: 0,

      manaTokenBalanceBnb: 0,
      sandTokenBalanceBnb: 0,
      thetaTokenBalanceBnb: 0,
      flowTokenBalanceBnb: 0,
      xtzTokenBalanceBnb: 0,
      galaTokenBalanceBnb: 0,
      chzTokenBalanceBnb: 0,
      enjTokenBalanceBnb: 0,
      roseTokenBalanceBnb: 0,

      rate: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //await this.getRate();
    swal("This project is is beta stage");

    const web3 = window.web3;
    const chainIdDec = await web3.eth.getChainId();

    this.setState({chainId: chainIdDec})
   
    if(chainIdDec == "56") {
      await this.calcTokenBalancesDeFiMainnet();
      await this.calcTokenBalancesNFTMainnet();
    } else if(chainIdDec == "97") {
      await this.calcTokenDeFiBalances();
      await this.calcTokenNFTBalances();
    }  

    this.setState({chainId: chainIdDec});
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();

    // modern browsers
    if (provider) {
      console.log('MetaMask is connected');

      window.web3 = new Web3(provider);
    } else {
      console.log('No ethereum wallet detected');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const chainIdDec = await web3.eth.getChainId();
    const accounts = await window.web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    if(accounts[0]) {
      this.setState({ connected: true })
    }
    if(chainIdDec == "56") {
      this.setState({ account: accounts[0]}) 
      const SwapContract = new web3.eth.Contract(IndexSwap.abi, "0x380d2b6742AAD7ae97f199a109c1F81A34E1cb86");
      const NFTPortfolioContract = new web3.eth.Contract(NFTSwap.abi, "0x40A367c5320440a1aa78aCBC5af0A017Ed1F3772"); 
      const NFTTokenContract = new web3.eth.Contract(IndexToken.abi, "0x16dBB234A9a595967DdC2ea1bb53379752f09Ad4"); 
      const DeFiTokenContract = new web3.eth.Contract(IndexToken.abi, "0x6E49456f284e3da7f1515eEE120E2706cab69fD5");
      this.setState({ SwapContract, DeFiTokenContract, NFTPortfolioContract, NFTTokenContract});
    } else if (chainIdDec == "97") {
      const SwapContract2 = new web3.eth.Contract(IndexSwap2.abi, "0xC773887b60191926d9995DB3072D212478ce235A");
      const NFTPortfolioContract2 = new web3.eth.Contract(NFTSwap2.abi, "0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F");
      const NFTTokenContract2 = new web3.eth.Contract(IndexToken2.abi, "0x817ea2A5Fd281d15CA70B05abB5E094356C42996");
      const DeFiTokenContract2 = new web3.eth.Contract(IndexToken2.abi, "0xF70538622598232a95B1EC1914Fc878d28EBAE68");
      this.setState({ SwapContract2, DeFiTokenContract2, NFTPortfolioContract2, NFTTokenContract2});
    }
  }

    async changeNetwork (networkName) {
      try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName]
            }
          ]
        });
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
      const web3 = window.web3;
      const chainIdDec = await web3.eth.getChainId();
      this.setState({chainId: chainIdDec});
      await this.loadBlockchainData();

      if(chainIdDec == "97") {
        await this.calcTokenBalancesDeFiMainnet();
        await this.calcTokenBalancesNFTMainnet();
      } else {
        await this.calcTokenDeFiBalances();
        await this.calcTokenNFTBalances();
      }
      
    };

    handleNetworkSwitch = async (networkName) => {
      await this.changeNetwork(networkName);
    };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  connectWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log("Connected");
      this.setState({
        connected: true
      })

    } else {
      alert("Metamask not found");
    }

    this.loadBlockchainData();
    window.location.reload();
  }

  

  investNFTMainnet = async () => {
    const web3 = new Web3(window.ethereum);
    const v = this.state.nftToMintMainnet;
    const valueInWei = web3.utils.toWei(v, 'ether');
    console.log(this.state.NFTPortfolioContract.methods);
    
    const resp = await this.state.NFTPortfolioContract.methods.investInFundNFT().send({ from: this.state.account, value: valueInWei
    }).once("receipt", (receipt) => {
      console.log(receipt);
    })
      .catch((err) => {
        console.log(err);
      });
    if (resp.status) {
      swal("Investment successfull!", `You invested ${v} BNB into the portfolio.`, "success");
    } else {
      swal("Investment failed!");
    }

    this.calcTokenBalancesNFTMainnet();
  }

  investDeFiMainnet = async () => {
    const web3 = new Web3(window.ethereum);    
    const v = this.state.defiToMintMainnet;
    const valueInWei = web3.utils.toWei(v, 'ether');
    
    const resp = await this.state.SwapContract.methods.investInFundDefi().send({ from: this.state.account, value: valueInWei })
    .once("receipt", (receipt) => {
      console.log(receipt);

    })
      .catch((err) => {
        console.log(err);
      });

      if (resp.status) {
        swal("Investment successfull!", `You invested ${v} BNB into the portfolio.`, "success");
        //window.location.reload();
      } else {
        swal("Investment failed!");
      }

    this.calcTokenBalancesDeFiMainnet();

  }

  approveNFTTokensMainnet = async() => {
    const web3 = new Web3(window.ethereum);
    
    const contractAddress = "0x40A367c5320440a1aa78aCBC5af0A017Ed1F3772"; 

    const aXSTokenConntract = new web3.eth.Contract(IERC.abi, "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0");
    await aXSTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const rACATokenConntract = new web3.eth.Contract(IERC.abi, "0x12BB890508c125661E03b09EC06E404bc9289040");
    await rACATokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const mBOXTokenConntract = new web3.eth.Contract(IERC.abi, "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377");
    await mBOXTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const mCTokenConntract = new web3.eth.Contract(IERC.abi, "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6");
    await mCTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const aLICETokenConntract = new web3.eth.Contract(IERC.abi, "0xAC51066d7bEC65Dc4589368da368b212745d63E8");
    await aLICETokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });
  }

  approveDeFiTokensMainnet = async() => {
    const web3 = new Web3(window.ethereum);
    
    const contractAddress = "0x380d2b6742AAD7ae97f199a109c1F81A34E1cb86"; 

    const BTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c");
    BTCTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const ETHTokenConntract = new web3.eth.Contract(IERC.abi, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"); 
    ETHTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const SHIBATokenConntract = new web3.eth.Contract(IERC.abi, "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D");
    SHIBATokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const XRPTokenConntract = new web3.eth.Contract(IERC.abi, "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE");
    XRPTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const LTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94");
    LTCTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const DAITokenConntract = new web3.eth.Contract(IERC.abi, "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3");
    DAITokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const MAKERTokenConntract = new web3.eth.Contract(IERC.abi, "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350");
    MAKERTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const LINKTokenConntract = new web3.eth.Contract(IERC.abi, "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD");
    LINKTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const UNITokenConntract = new web3.eth.Contract(IERC.abi, "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1");
    UNITokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const AAVETokenConntract = new web3.eth.Contract(IERC.abi, "0xfb6115445Bff7b52FeB98650C87f44907E58f802");
    AAVETokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });
  }

  withdrawDeFiMainnet = async () => {
    const vault = "0x6056773C28c258425Cf9BC8Ba5f86B8031863164";

    const web3 = new Web3(window.ethereum);

    var withdrawAmt = this.state.withdrawValueDefi;
    var withdrawAmountInWei = web3.utils.toWei(withdrawAmt, 'ether');

    await this.state.DeFiTokenContract.methods.approve("0x380d2b6742AAD7ae97f199a109c1F81A34E1cb86", "7787357773333787487837458347754874574837458374")
    .send({from: this.state.account});


    var amount = withdrawAmountInWei / 10;
    var sAmount = amount.toString();

    await this.state.SwapContract.methods.withdrawFromFundTOPTokens(sAmount
    ).send({
      from: this.state.account, value: 0
    }).once("receipt", (receipt) => {
      swal("Withdrawal successfull!", "The withdrawal was successful!", "success");
      console.log(receipt);
    })
      .catch((err) => {
        console.log(err);
      });

      this.calcTokenBalancesDeFiMainnet();
  }

  withdrawNFTMainnet = async () => {
      const vault = "0x6056773C28c258425Cf9BC8Ba5f86B8031863164";
  
      const web3 = new Web3(window.ethereum);
  
      console.log(this.state.DeFiTokenContract);
  
      var withdrawAmt = this.state.withdrawValueNFT;
      var withdrawAmountInWei = web3.utils.toWei(withdrawAmt, 'ether');
  
  
      await this.state.NFTTokenContract.methods.approve("0x40A367c5320440a1aa78aCBC5af0A017Ed1F3772", "7787357773333787487837458347754874574837458374")
      .send({from: this.state.account});
  
      var amount = withdrawAmountInWei / 10;
      var sAmount = amount.toString();
  
      await this.state.NFTPortfolioContract.methods.withdrawFromFundNFT(sAmount
      ).send({
        from: this.state.account, value: 0
      }).once("receipt", (receipt) => {
        swal("Withdrawal successfull!", "The withdrawal was successful!", "success");
        console.log(receipt);
      })
        .catch((err) => {
          console.log(err);
        });

        this.calcTokenBalancesNFTMainnet();
  }

  getExchangeRateMainnet = async (amountIn, address) => {
    const web3 = window.web3;
    const pancakeRouter = new web3.eth.Contract(pancakeSwapRouter.abi, "0x10ED43C718714eb63d5aA57B78B54704E256024E");

    var path = [];
    path[0] = address;
    path[1] = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

    const er = await pancakeRouter.methods.getAmountsOut(amountIn, path).call();
    return er[1];
  }

  calcTokenBalancesDeFiMainnet = async () => {
    const web3 = window.web3;

    const defiTokenBalanceRes = await this.state.DeFiTokenContract.methods.balanceOf(this.state.account).call();
    const defiTokenBalance = web3.utils.fromWei(defiTokenBalanceRes, "ether");

    // DeFi
    const BTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c");
    const btcTokenBalanceRes = await this.state.SwapContract.methods.btcBalance(this.state.account).call();
    //const btcTokenBalanceRes = await BTCTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperBtc = await this.getExchangeRateMainnet(btcTokenBalanceRes, "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c");
    const btcTokenBalanceBnb = web3.utils.fromWei(helperBtc, "ether");
    const btcTokenBalance = web3.utils.fromWei(btcTokenBalanceRes, "ether");

    const ETHTokenConntract = new web3.eth.Contract(IERC.abi, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8");
    const ethTokenBalanceRes = await this.state.SwapContract.methods.ethBalance(this.state.account).call();
    //const ethTokenBalanceRes = await ETHTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperEth = await this.getExchangeRateMainnet(ethTokenBalanceRes, "0x2170Ed0880ac9A755fd29B2688956BD959F933F8");
    const ethTokenBalanceBnb = web3.utils.fromWei(helperEth, "ether");
    const ethTokenBalance = web3.utils.fromWei(ethTokenBalanceRes, "ether");

    const SHIBATokenConntract = new web3.eth.Contract(IERC.abi, "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D");
    const shibaTokenBalanceRes = await this.state.SwapContract.methods.shibaBalance(this.state.account).call();
    //const shibaTokenBalanceRes = await SHIBATokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperShib = await this.getExchangeRateMainnet(shibaTokenBalanceRes, "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D");
    const shibaTokenBalanceBnb = web3.utils.fromWei(helperShib, "ether");
    const shibaTokenBalance = web3.utils.fromWei(shibaTokenBalanceRes, "ether");

    const XRPTokenConntract = new web3.eth.Contract(IERC.abi, "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE");
    const xrpTokenBalanceRes = await this.state.SwapContract.methods.xrpBalance(this.state.account).call();
    //const xrpTokenBalanceRes = await XRPTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperXrp = await this.getExchangeRateMainnet(xrpTokenBalanceRes, "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE");
    const xrpTokenBalanceBnb = web3.utils.fromWei(helperXrp, "ether");
    const xrpTokenBalance = web3.utils.fromWei(xrpTokenBalanceRes, "ether");

    const LTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94");
    const ltcTokenBalanceRes = await this.state.SwapContract.methods.ltcBalance(this.state.account).call();
    //const ltcTokenBalanceRes = await LTCTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperLtc = await this.getExchangeRateMainnet(ltcTokenBalanceRes, "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94");
    const ltcTokenBalanceBnb = web3.utils.fromWei(helperLtc, "ether");
    const ltcTokenBalance = web3.utils.fromWei(ltcTokenBalanceRes, "ether");

    const DAITokenConntract = new web3.eth.Contract(IERC.abi, "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3");
    const daiTokenBalanceRes = await this.state.SwapContract.methods.daiBalance(this.state.account).call();
    //const daiTokenBalanceRes = await DAITokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperDai = await this.getExchangeRateMainnet(daiTokenBalanceRes, "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3");
    const daiTokenBalanceBnb = web3.utils.fromWei(helperDai, "ether");
    const daiTokenBalance = web3.utils.fromWei(daiTokenBalanceRes, "ether");

    const MAKERTokenConntract = new web3.eth.Contract(IERC.abi, "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350");
    const makerTokenBalanceRes = await this.state.SwapContract.methods.makerBalance(this.state.account).call();
    //const makerTokenBalanceRes = await MAKERTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperMaker = await this.getExchangeRateMainnet(makerTokenBalanceRes, "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350");
    const makerTokenBalanceBnb = web3.utils.fromWei(helperMaker, "ether");
    const makerTokenBalance = web3.utils.fromWei(makerTokenBalanceRes, "ether");

    const LINKTokenConntract = new web3.eth.Contract(IERC.abi, "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD");
    const linkTokenBalanceRes = await this.state.SwapContract.methods.linkBalance(this.state.account).call();
    //const linkTokenBalanceRes = await LINKTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperLink = await this.getExchangeRateMainnet(linkTokenBalanceRes, "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD");
    const linkTokenBalanceBnb = web3.utils.fromWei(helperLink, "ether");
    const linkTokenBalance = web3.utils.fromWei(linkTokenBalanceRes, "ether");

    const UNITokenConntract = new web3.eth.Contract(IERC.abi, "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1");
    const uniTokenBalanceRes = await this.state.SwapContract.methods.uniBalance(this.state.account).call();
    //const uniTokenBalanceRes = await UNITokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperUni = await this.getExchangeRateMainnet(uniTokenBalanceRes, "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1");
    const uniTokenBalanceBnb = web3.utils.fromWei(helperUni, "ether");
    const uniTokenBalance = web3.utils.fromWei(uniTokenBalanceRes, "ether");


    const AAVETokenConntract = new web3.eth.Contract(IERC.abi, "0xfb6115445Bff7b52FeB98650C87f44907E58f802");
    const aaveTokenBalanceRes = await this.state.SwapContract.methods.aaveBalance(this.state.account).call();
    //const aaveTokenBalanceRes = await AAVETokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperAave = await this.getExchangeRateMainnet(aaveTokenBalanceRes, "0xfb6115445Bff7b52FeB98650C87f44907E58f802");
    const aaveTokenBalanceBnb = web3.utils.fromWei(helperAave, "ether");
    const aaveTokenBalance = web3.utils.fromWei(aaveTokenBalanceRes, "ether");

    this.setState({
      defiTokenBalance,
      btcTokenBalance, ethTokenBalance, shibaTokenBalance, xrpTokenBalance, ltcTokenBalance,
      btcTokenBalanceBnb, ethTokenBalanceBnb, shibaTokenBalanceBnb, xrpTokenBalanceBnb, ltcTokenBalanceBnb,
      daiTokenBalance, makerTokenBalance, linkTokenBalance, uniTokenBalance, aaveTokenBalance,
      daiTokenBalanceBnb, makerTokenBalanceBnb, linkTokenBalanceBnb, uniTokenBalanceBnb, aaveTokenBalanceBnb,
    });
  }

    calcTokenBalancesNFTMainnet = async () => {
    // NFT

    const web3 = window.web3;

    const nftTokenBalanceRes = await this.state.NFTTokenContract.methods.balanceOf(this.state.account).call();
    const nftTokenBalance = web3.utils.fromWei(nftTokenBalanceRes, "ether");

    const AXSTokenConntract = new web3.eth.Contract(IERC.abi, "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0");
    const axsTokenBalanceRes = await this.state.NFTPortfolioContract.methods.axsBalance(this.state.account).call();
    //const axsTokenBalanceRes = await AXSTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperAxs = await this.getExchangeRateMainnet(axsTokenBalanceRes, "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0");
    const axsTokenBalanceBnb = web3.utils.fromWei(helperAxs, "ether");
    const axsTokenBalance = web3.utils.fromWei(axsTokenBalanceRes, "ether");

    const RACATokenConntract = new web3.eth.Contract(IERC.abi, "0x12BB890508c125661E03b09EC06E404bc9289040");
    const racaTokenBalanceRes = await this.state.NFTPortfolioContract.methods.racaBalance(this.state.account).call();
    //const racaTokenBalanceRes = await RACATokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperRaca = await this.getExchangeRateMainnet(racaTokenBalanceRes, "0x12BB890508c125661E03b09EC06E404bc9289040");
    const racaTokenBalanceBnb = web3.utils.fromWei(helperRaca, "ether");
    const racaTokenBalance = web3.utils.fromWei(racaTokenBalanceRes, "ether");

    const MBOXTokenConntract = new web3.eth.Contract(IERC.abi, "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377");
    const mboxTokenBalanceRes = await this.state.NFTPortfolioContract.methods.mboxBalance(this.state.account).call();
    //const mboxTokenBalanceRes = await MBOXTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperMbox = await this.getExchangeRateMainnet(mboxTokenBalanceRes, "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377");
    const mboxTokenBalanceBnb = web3.utils.fromWei(helperMbox, "ether");
    const mboxTokenBalance = web3.utils.fromWei(mboxTokenBalanceRes, "ether");

    const MCTokenConntract = new web3.eth.Contract(IERC.abi, "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6");
    const mcTokenBalanceRes = await this.state.NFTPortfolioContract.methods.mcBalance(this.state.account).call();
    //const mcTokenBalanceRes = await MCTokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperMc = await this.getExchangeRateMainnet(mcTokenBalanceRes, "0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6");
    const mcTokenBalanceBnb = web3.utils.fromWei(helperMc, "ether");
    const mcTokenBalance = web3.utils.fromWei(mcTokenBalanceRes, "ether");

    const ALICETokenConntract = new web3.eth.Contract(IERC.abi, "0xAC51066d7bEC65Dc4589368da368b212745d63E8");
    const aliceTokenBalanceRes = await this.state.NFTPortfolioContract.methods.aliceBalance(this.state.account).call();
    //const aliceTokenBalanceRes = await ALICETokenConntract.methods.balanceOf("0x6056773C28c258425Cf9BC8Ba5f86B8031863164").call();
    const helperAlice = await this.getExchangeRateMainnet(aliceTokenBalanceRes, "0xAC51066d7bEC65Dc4589368da368b212745d63E8");
    const aliceTokenBalanceBnb = web3.utils.fromWei(helperAlice, "ether");
    const aliceTokenBalance = web3.utils.fromWei(aliceTokenBalanceRes, "ether");
   

    this.setState({
      nftTokenBalance,
      axsTokenBalance, racaTokenBalance, mboxTokenBalance, mcTokenBalance, aliceTokenBalance,
      axsTokenBalanceBnb, racaTokenBalanceBnb, mboxTokenBalanceBnb, mcTokenBalanceBnb, aliceTokenBalanceBnb,
    });
  }

  /*getRate = async () => {
    const rateObj = await this.state.SwapContract.methods.currentRate().call();
    const rate = rateObj.numerator / rateObj.denominator;
    this.setState({ rate });
  }*/


  // TESTNET

  investNFT = async () => {
    const web3 = new Web3(window.ethereum);
    const v = this.state.nftToMint;
    const valueInWei = web3.utils.toWei(v, 'ether');
    
    const resp = await this.state.NFTPortfolioContract2.methods.investInFundDefi().send({ from: this.state.account, value: valueInWei
    }).once("receipt", (receipt) => {
      console.log(receipt);
    })
      .catch((err) => {
        console.log(err);
      });
    if (resp.status) {
      swal("Investment successfull!", `You invested ${v} BNB into the portfolio.`, "success");
    } else {
      swal("Investment failed!");
    }

    this.calcTokenNFTBalances();
  }

  investDeFi = async () => {
    const web3 = new Web3(window.ethereum);    
    const v = this.state.defiToMint;
    const valueInWei = web3.utils.toWei(v, 'ether');
    
    const resp = await this.state.SwapContract2.methods.investInFundDefi().send({ from: this.state.account, value: valueInWei })
    .once("receipt", (receipt) => {
      console.log(receipt);

    })
      .catch((err) => {
        console.log(err);
      });

      if (resp.status) {
        swal("Investment successfull!", `You invested ${v} BNB into the portfolio.`, "success");
        //window.location.reload();
      } else {
        swal("Investment failed!");
      }

    this.calcTokenDeFiBalances();

  }

  approveNFTTokens = async() => {
    const web3 = new Web3(window.ethereum);  

    const aXSTokenConntract = new web3.eth.Contract(IERC.abi, "0xf34D883EcdE3238B153f38230987a0F4c221a48F");
    await aXSTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const mANATokenConntract = new web3.eth.Contract(IERC.abi, "0x8bf2dF0Ff8528088475183a68678bd1Cd7691b69");
    await mANATokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const sANDTokenConntract = new web3.eth.Contract(IERC.abi, "0x1631A54AC95Ecb0085dB6b8ACf80c4Cee72AEB06");
    await sANDTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const tHETATokenConntract = new web3.eth.Contract(IERC.abi, "0x19A5E53eC7B385dbE2E587Ba989eA2AB8F7EaF1e");
    await tHETATokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const fLOWTokenConntract = new web3.eth.Contract(IERC.abi, "0xe5c48084E1974a971Bd5dF4d9B01daCCA86d5567");
    await fLOWTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const xTZTokenConntract = new web3.eth.Contract(IERC.abi, "0xC5De9d5B0BA5b408a3e9530A1BC310d8F2dCC26a");
    await xTZTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const gALATokenConntract = new web3.eth.Contract(IERC.abi, "0x4bf1CE8E4c4c86126E57Fa9fc3f1a9631661641c");
    await gALATokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const cHZTokenConntract = new web3.eth.Contract(IERC.abi, "0xdeEC6f0C22970b9b8a47069bE619bfAe646dEe26");
    await cHZTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const eNJTokenConntract = new web3.eth.Contract(IERC.abi, "0xb08A1959f57b9cC8e5A5F1d329EfD90EE3438F65");
    await eNJTokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });

    const rOSETokenConntract = new web3.eth.Contract(IERC.abi, "0x30c1AC77F4068A063648B549ffF96Ddb9d151325");
    await rOSETokenConntract.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: "0x6056773C28c258425Cf9BC8Ba5f86B8031863164" });
  }

  approveDeFiTokens = async() => {
    const web3 = new Web3(window.ethereum);  
    const contractAddress = "0xC773887b60191926d9995DB3072D212478ce235A";
    const vault = "0x6056773C28c258425Cf9BC8Ba5f86B8031863164";

    const BTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x4b1851167f74FF108A994872A160f1D6772d474b");
    BTCTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const ETHTokenConntract = new web3.eth.Contract(IERC.abi, "0x8BaBbB98678facC7342735486C851ABD7A0d17Ca");
    ETHTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const SHIBATokenConntract = new web3.eth.Contract(IERC.abi, "0xBf0646Fa5ABbFf6Af50a9C40D5E621835219d384");
    SHIBATokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const XRPTokenConntract = new web3.eth.Contract(IERC.abi, "0xCc00177908830cE1644AEB4aD507Fda3789128Af");
    XRPTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const LTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x2F9fd65E3BB89b68a8e2Abd68Db25F5C348F68Ee");
    LTCTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const DAITokenConntract = new web3.eth.Contract(IERC.abi, "0x8a9424745056Eb399FD19a0EC26A14316684e274");
    DAITokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const LUNATokenConntract = new web3.eth.Contract(IERC.abi, "0x0bBF12a9Ccd7cD0E23dA21eFd3bb16ba807ab069");
    LUNATokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const LINKTokenConntract = new web3.eth.Contract(IERC.abi, "0x8D908A42FD847c80Eeb4498dE43469882436c8FF");
    LINKTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const UNITokenConntract = new web3.eth.Contract(IERC.abi, "0x62955C6cA8Cd74F8773927B880966B7e70aD4567");
    UNITokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });

    const STETHTokenConntract = new web3.eth.Contract(IERC.abi, "0xb7a58582Df45DBa8Ad346c6A51fdb796D64e0898");
    STETHTokenConntract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: vault });
  }

  withdrawDeFi = async () => {
    var vault = "0x6056773C28c258425Cf9BC8Ba5f86B8031863164";

    const web3 = new Web3(window.ethereum);

    var withdrawAmt = this.state.withdrawValueDefi;
    var withdrawAmountInWei = web3.utils.toWei(withdrawAmt, 'ether');

    const defiBalance = await this.state.DeFiTokenContract2.methods.balanceOf(this.state.account).call();
    if(defiBalance == 0) {
      swal("Withdrawal amount exceeds balance!");
      return;
    }

    var percentage = (withdrawAmountInWei * 100) / defiBalance ;
    var percentageFinal = Math.round(percentage);
    console.log(Math.round(percentage));

    await this.state.DeFiTokenContract2.methods.approve("0xC773887b60191926d9995DB3072D212478ce235A", "7787357773333787487837458347754874574837458374")
    .send({from: this.state.account});

    var amount = withdrawAmountInWei;
    var sAmount = amount.toString();

    await this.state.SwapContract2.methods.withdrawFromFundTOPTokens(sAmount, percentageFinal
    ).send({
      from: this.state.account, value: 0
    }).once("receipt", (receipt) => {
      swal("Withdrawal successfull!", "The withdrawal was successful!", "success");
      console.log(receipt);
    })
      .catch((err) => {
        console.log(err);
      });

      this.calcTokenDeFiBalances();
  }

  withdrawNFT = async () => {
    var vault = "0x6056773C28c258425Cf9BC8Ba5f86B8031863164";

    const web3 = new Web3(window.ethereum);

    var withdrawAmt = this.state.withdrawValueNFT;
    var withdrawAmountInWei = web3.utils.toWei(withdrawAmt, 'ether');

    const nftBalance = await this.state.NFTTokenContract2.methods.balanceOf(this.state.account).call();
    if(nftBalance == 0) {
      swal("Withdrawal amount exceeds balance!");
      return;
    }

    var percentage = (withdrawAmountInWei * 100) / nftBalance ;
    var percentageFinal = Math.round(percentage);
    console.log(Math.round(percentage));
  
    await this.state.NFTTokenContract2.methods.approve("0x0f444D6F25d2F8Fd0639eEc68ce4AA1F03FF6F4F", "7787357773333787487837458347754874574837458374")
    .send({from: this.state.account});

    var amount = withdrawAmountInWei;
    var sAmount = amount.toString();

    await this.state.NFTPortfolioContract2.methods.withdrawFromFundNFT(sAmount, percentageFinal
    ).send({
      from: this.state.account, value: 0
    }).once("receipt", (receipt) => {
      swal("Withdrawal successfull!", "The withdrawal was successful!", "success");
      console.log(receipt);
    })
      .catch((err) => {
        console.log(err);
      });

      this.calcTokenNFTBalances();
  }

  getExchangeRate = async (amountIn, address) => {
    const web3 = window.web3;
    const pancakeRouter = new web3.eth.Contract(pancakeSwapRouter.abi, "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3");

    var path = [];
    path[0] = address;
    path[1] = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

    const er = await pancakeRouter.methods.getAmountsOut(amountIn, path).call();
    return er[1];
  }

  calcTokenDeFiBalances = async () => {
    const web3 = window.web3;

    const defiTokenBalanceRes = await this.state.DeFiTokenContract2.methods.balanceOf(this.state.account).call();
    const defiTokenBalance = web3.utils.fromWei(defiTokenBalanceRes, "ether");
    
    const btcTokenBalanceRes = await this.state.SwapContract2.methods.btcBalance(this.state.account).call();
    const helperBtc = await this.getExchangeRate(btcTokenBalanceRes, "0x4b1851167f74FF108A994872A160f1D6772d474b");
    const btcTokenBalanceBnb = web3.utils.fromWei(helperBtc, "ether");
    const btcTokenBalance = web3.utils.fromWei(btcTokenBalanceRes, "ether");

    const ethTokenBalanceRes = await this.state.SwapContract2.methods.ethBalance(this.state.account).call();
    const helperEth = await this.getExchangeRate(ethTokenBalanceRes, "0x8BaBbB98678facC7342735486C851ABD7A0d17Ca");
    const ethTokenBalanceBnb = web3.utils.fromWei(helperEth, "ether");
    const ethTokenBalance = web3.utils.fromWei(ethTokenBalanceRes, "ether");
    console.log("eth", ethTokenBalance);

    const shibaTokenBalanceRes = await this.state.SwapContract2.methods.shibaBalance(this.state.account).call();
    const helperShib = await this.getExchangeRate(shibaTokenBalanceRes, "0xBf0646Fa5ABbFf6Af50a9C40D5E621835219d384");
    const shibaTokenBalanceBnb = web3.utils.fromWei(helperShib, "ether");
    const shibaTokenBalance = web3.utils.fromWei(shibaTokenBalanceRes, "ether");

    const xrpTokenBalanceRes = await this.state.SwapContract2.methods.xrpBalance(this.state.account).call();
    const helperXrp = await this.getExchangeRate(xrpTokenBalanceRes, "0xCc00177908830cE1644AEB4aD507Fda3789128Af");
    const xrpTokenBalanceBnb = web3.utils.fromWei(helperXrp, "ether");
    const xrpTokenBalance = web3.utils.fromWei(xrpTokenBalanceRes, "ether");

    const ltcTokenBalanceRes = await this.state.SwapContract2.methods.ltcBalance(this.state.account).call();
    const helperLtc = await this.getExchangeRate(ltcTokenBalanceRes, "0x2F9fd65E3BB89b68a8e2Abd68Db25F5C348F68Ee");
    const ltcTokenBalanceBnb = web3.utils.fromWei(helperLtc, "ether");
    const ltcTokenBalance = web3.utils.fromWei(ltcTokenBalanceRes, "ether");

    const daiTokenBalanceRes = await this.state.SwapContract2.methods.daiBalance(this.state.account).call();
    const helperDai = await this.getExchangeRate(daiTokenBalanceRes, "0x8a9424745056Eb399FD19a0EC26A14316684e274");
    const daiTokenBalanceBnb = web3.utils.fromWei(helperDai, "ether");
    const daiTokenBalance = web3.utils.fromWei(daiTokenBalanceRes, "ether");

    const lunaTokenBalanceRes = await this.state.SwapContract2.methods.lunaBalance(this.state.account).call();
    const helperLuna = await this.getExchangeRate(lunaTokenBalanceRes, "0x0bBF12a9Ccd7cD0E23dA21eFd3bb16ba807ab069");
    const lunaTokenBalanceBnb = web3.utils.fromWei(helperLuna, "ether");
    const lunaTokenBalance = web3.utils.fromWei(lunaTokenBalanceRes, "ether");

    const linkTokenBalanceRes = await this.state.SwapContract2.methods.linkBalance(this.state.account).call();
    const helperLink = await this.getExchangeRate(linkTokenBalanceRes, "0x8D908A42FD847c80Eeb4498dE43469882436c8FF");
    const linkTokenBalanceBnb = web3.utils.fromWei(helperLink, "ether");
    const linkTokenBalance = web3.utils.fromWei(linkTokenBalanceRes, "ether");

    const uniTokenBalanceRes = await this.state.SwapContract2.methods.uniBalance(this.state.account).call();
    const helperUni = await this.getExchangeRate(uniTokenBalanceRes, "0x62955C6cA8Cd74F8773927B880966B7e70aD4567");
    const uniTokenBalanceBnb = web3.utils.fromWei(helperUni, "ether");
    const uniTokenBalance = web3.utils.fromWei(uniTokenBalanceRes, "ether");


    const stethTokenBalanceRes = await this.state.SwapContract2.methods.stethBalance(this.state.account).call();
    const helperSteth = await this.getExchangeRate(stethTokenBalanceRes, "0xb7a58582Df45DBa8Ad346c6A51fdb796D64e0898");
    const stethTokenBalanceBnb = web3.utils.fromWei(helperSteth, "ether");
    const stethTokenBalance = web3.utils.fromWei(stethTokenBalanceRes, "ether");
    console.log("steth", stethTokenBalance);

    this.setState({
      defiTokenBalance,
      btcTokenBalance, ethTokenBalance, shibaTokenBalance, xrpTokenBalance, ltcTokenBalance,
      btcTokenBalanceBnb, ethTokenBalanceBnb, shibaTokenBalanceBnb, xrpTokenBalanceBnb, ltcTokenBalanceBnb,
      daiTokenBalance, lunaTokenBalance, linkTokenBalance, uniTokenBalance, stethTokenBalance,
      daiTokenBalanceBnb, lunaTokenBalanceBnb, linkTokenBalanceBnb, uniTokenBalanceBnb, stethTokenBalanceBnb,
    });
  }

    calcTokenNFTBalances = async () => {
      const web3 = window.web3;

      const nftTokenBalanceRes = await this.state.NFTTokenContract2.methods.balanceOf(this.state.account).call();
      const nftTokenBalance = web3.utils.fromWei(nftTokenBalanceRes, "ether");
    
      const axsTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.axsBalance(this.state.account).call();
      const helperAxs = await this.getExchangeRate(axsTokenBalanceRes, "0xf34D883EcdE3238B153f38230987a0F4c221a48F");
      const axsTokenBalanceBnb = web3.utils.fromWei(helperAxs, "ether");
      const axsTokenBalance = web3.utils.fromWei(axsTokenBalanceRes, "ether");

      const manaTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.manaBalance(this.state.account).call();
      const helperMana = await this.getExchangeRate(manaTokenBalanceRes, "0x8bf2dF0Ff8528088475183a68678bd1Cd7691b69");
      const manaTokenBalanceBnb = web3.utils.fromWei(helperMana, "ether");
      const manaTokenBalance = web3.utils.fromWei(manaTokenBalanceRes, "ether");

      const sandTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.sandBalance(this.state.account).call();
      const helperSand = await this.getExchangeRate(sandTokenBalanceRes, "0x1631A54AC95Ecb0085dB6b8ACf80c4Cee72AEB06");
      const sandTokenBalanceBnb = web3.utils.fromWei(helperSand, "ether");
      const sandTokenBalance = web3.utils.fromWei(sandTokenBalanceRes, "ether");

      const thetaTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.thetaBalance(this.state.account).call();
      const helperTheate = await this.getExchangeRate(thetaTokenBalanceRes, "0x19A5E53eC7B385dbE2E587Ba989eA2AB8F7EaF1e");
      const thetaTokenBalanceBnb = web3.utils.fromWei(helperTheate, "ether");
      const thetaTokenBalance = web3.utils.fromWei(thetaTokenBalanceRes, "ether");

      const flowTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.flowalance(this.state.account).call();
      const helperFlow = await this.getExchangeRate(flowTokenBalanceRes, "0xe5c48084E1974a971Bd5dF4d9B01daCCA86d5567");
      const flowTokenBalanceBnb = web3.utils.fromWei(helperFlow, "ether");
      const flowTokenBalance = web3.utils.fromWei(flowTokenBalanceRes, "ether");

      console.log(flowTokenBalanceRes);

      const xtzTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.xtzBalance(this.state.account).call();
      const helperXtz = await this.getExchangeRate(xtzTokenBalanceRes, "0xC5De9d5B0BA5b408a3e9530A1BC310d8F2dCC26a");
      const xtzTokenBalanceBnb = web3.utils.fromWei(helperXtz, "ether");
      const xtzTokenBalance = web3.utils.fromWei(xtzTokenBalanceRes, "ether");

      const galaTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.galaBalance(this.state.account).call();
      const helperGala = await this.getExchangeRate(galaTokenBalanceRes, "0x4bf1CE8E4c4c86126E57Fa9fc3f1a9631661641c");
      const galaTokenBalanceBnb = web3.utils.fromWei(helperGala, "ether");
      const galaTokenBalance = web3.utils.fromWei(galaTokenBalanceRes, "ether");

      const chzTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.chzBalance(this.state.account).call();
      const helperChz = await this.getExchangeRate(chzTokenBalanceRes, "0xdeEC6f0C22970b9b8a47069bE619bfAe646dEe26");
      const chzTokenBalanceBnb = web3.utils.fromWei(helperChz, "ether");
      const chzTokenBalance = web3.utils.fromWei(chzTokenBalanceRes, "ether");

      const enjTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.enjBalance(this.state.account).call();
      const helperEnj = await this.getExchangeRate(enjTokenBalanceRes, "0xb08A1959f57b9cC8e5A5F1d329EfD90EE3438F65");
      const enjTokenBalanceBnb = web3.utils.fromWei(helperEnj, "ether");
      const enjTokenBalance = web3.utils.fromWei(enjTokenBalanceRes, "ether");

      const roseTokenBalanceRes = await this.state.NFTPortfolioContract2.methods.roseBalance(this.state.account).call();
      const helperRose = await this.getExchangeRate(roseTokenBalanceRes, "0x30c1AC77F4068A063648B549ffF96Ddb9d151325");
      const roseTokenBalanceBnb = web3.utils.fromWei(helperRose, "ether");
      const roseTokenBalance = web3.utils.fromWei(roseTokenBalanceRes, "ether");
      console.log("rose", roseTokenBalance);

      this.setState({
        nftTokenBalance,
        axsTokenBalance, manaTokenBalance, sandTokenBalance, thetaTokenBalance, flowTokenBalance,
        axsTokenBalanceBnb, manaTokenBalanceBnb, sandTokenBalanceBnb, thetaTokenBalanceBnb, flowTokenBalanceBnb,
        xtzTokenBalance, galaTokenBalance, chzTokenBalance, enjTokenBalance, roseTokenBalance,
        xtzTokenBalanceBnb, galaTokenBalanceBnb, chzTokenBalanceBnb, enjTokenBalanceBnb, roseTokenBalanceBnb
      });
  }

  render() {

    window.addEventListener("load", function() {
      if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    
        // detect Metamask account change
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('accountsChanges',accounts);
    
        });
    
         // detect Network account change
        window.ethereum.on('networkChanged', function(networkId){
          console.log('networkChanged',networkId);
        });

      } else {
        console.warn(
          "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
          new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
        );
      }
    });

    const web3 = window.web3;

    let button;
    if (!this.state.connected) {
      button = <Button style={{ position: "absolute", top: "30px", right: "20px" }} onClick={this.connectWallet} color="orange">
          <Image style={{ "padding-top": "7px" }} floated="left" size="mini" src={metamask} />
          <p>Connect to MetaMask</p>
        </Button>
    } else {
      button = <p style={{ position: "absolute", top: "90px", right: "20px", color: "#C0C0C0" }}><b>Account:</b> {this.state.account}</p>
    }

    let testnet;
    if(this.state.chainId == "97") {
      testnet = <Grid divided='vertically'>
        <Grid.Row columns={2} style={{ margin: "20px" }}>
          <Grid.Column>

            <Card.Group>
              <Card style={{ width: "900px" }}>
                <Card.Content style={{ background: "#406ccd" }}>
                <Card.Header style={{ color: "white" }}>
                  <p style={{ color: "#C0C0C0", "font-weight": "bold", "text-align": "right" }}>APY: XX%</p>
                    Top 10 Tokens
                    </Card.Header>
                  <Card.Description>

                    <p style={{ color: "#C0C0C0" }}>Rate: In return of investing 1 BNB you will receive 1 Top10 Token.</p>

                    <Form onSubmit={this.investDeFi}>
                      <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to create" name="defiToMint" onChange={this.handleInputChange}></Input>
                      <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Create</Button>
                    </Form>

                    <Form onSubmit={this.withdrawDeFi}>
                      <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="Top10 amount to redeem" name="withdrawValueDefi" onChange={this.handleInputChange}></Input>
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Redeem</Button>
                    </Form>

                    <Table style={{ "margin-left": "auto", "margin-right": "auto" }} basic='very' celled collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell style={{ color: "white" }}>Token</Table.HeaderCell>
                          <Table.HeaderCell style={{ color: "white" }}>Balance</Table.HeaderCell>
                          <Table.HeaderCell style={{ color: "white" }}>Balance in WBNB</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Top10 Token</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.defiTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>-</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Bitcoin (BTC)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.btcTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.btcTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Ethereum (ETH)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ethTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ethTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Shiba Ibu (SHIB)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.shibaTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.shibaTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Ripple (XRP)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xrpTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xrpTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Litecoin (LTC)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ltcTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ltcTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Dai (DAI)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.daiTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.daiTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Terra (LUNA)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.lunaTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.lunaTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Chainlink (LINK)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.linkTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.linkTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Uniswap (UNI)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.uniTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.uniTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Lido Staked Ether (STETH)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.stethTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.stethTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                      </Table.Body>

                    </Table>

                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>


          <Grid.Column>
            <Card.Group>
              <Card style={{ width: "900px" }}>
                <Card.Content style={{ background: "#406ccd" }}>
                <Card.Header style={{ color: "white" }}>
                    <p style={{ color: "#C0C0C0", "font-weight": "bold", "text-align": "right" }}>APY: YY%</p>
                    Top 10 Metaverse Tokens
                    </Card.Header>
                  <Card.Description>

                    <p style={{ color: "#C0C0C0" }}>Rate: In return of investing 1 BNB you will receive 1 META Token.</p>

                    <Form onSubmit={this.investNFT}>
                      <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to create" name="nftToMint" onChange={this.handleInputChange}></Input>
                      <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Create</Button>
                    </Form>

                    <Form onSubmit={this.withdrawNFT}>
                      <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="META amount to redeem" name="withdrawValueNFT" onChange={this.handleInputChange}></Input>
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Redeem</Button>
                    </Form>

                    <Table style={{ "margin-left": "auto", "margin-right": "auto" }} basic='very' celled collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell style={{ color: "white" }}>Token</Table.HeaderCell>
                          <Table.HeaderCell style={{ color: "white" }}>Balance</Table.HeaderCell>
                          <Table.HeaderCell style={{ color: "white" }}>Balance in WBNB</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Metaverse Token</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.nftTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>-</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Axie Infinity (AXS)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.axsTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.axsTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Decentraland (MANA)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.manaTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.manaTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>The Sandbox (SAND)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.sandTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.sandTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Theta Network (THETA)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.thetaTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.thetaTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Flow (FLOW)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.flowTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.flowTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Tezos (XTZ)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xtzTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xtzTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Gala (GALA)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.galaTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.galaTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Chiliz (CHZ)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.chzTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.chzTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Enjin Coin (ENJ)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.enjTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ethTokenBalanceBnb}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell style={{ color: "#C0C0C0" }}>Oasis Network (ROSE)</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.roseTokenBalance}</Table.Cell>
                          <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.roseTokenBalanceBnb}</Table.Cell>
                        </Table.Row>

                      </Table.Body>
                    </Table>

                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    }

      let buttonSwitch;
      if(this.state.chainId == "56" && this.state.connected) {
        buttonSwitch = <Button style={{ position: "absolute", top: "30px", right: "20px" }} onClick={() => this.handleNetworkSwitch("bscTestnet")} color="orange" type="submit" >Change to Testnet</Button>
      } else if (this.state.connected) {
        buttonSwitch = <Button style={{ position: "absolute", top: "30px", right: "20px" }} onClick={() => this.handleNetworkSwitch("bsc")} color="orange" type="submit" >Change to Mainnet</Button>
      }
      
      let mainnet;
      if(this.state.chainId == "56") {
        mainnet = 
        <div>
        <Grid divided='vertically'>
          <Grid.Row columns={2} style={{ margin: "20px" }}>
            <Grid.Column>

              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{ color: "white" }}>
                    <p style={{ color: "#C0C0C0", "font-weight": "bold", "text-align": "right" }}>APY: XX%</p>
                      Top 10 Tokens
                      </Card.Header>
                    <Card.Description>
                      <p style={{ color: "#C0C0C0" }}>Rate: In return of investing 1 BNB you will receive 1 Top10 Token.</p>

                      <Form onSubmit={this.investDeFiMainnet}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to create" name="defiToMintMainnet" onChange={this.handleInputChange}></Input>
                        <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Create</Button>
                      </Form>

                      <Form onSubmit={this.withdrawDeFiMainnet}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="TOP15 amount to redeem" name="withdrawValueDefi" onChange={this.handleInputChange}></Input>
                        <Button color="green" style={{ margin: "20px", width: "150px" }}>Redeem</Button>
                      </Form>

                      <Table role="grid" style={{ "margin-left": "auto", "margin-right": "auto" }} basic='very' celled collapsing>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell style={{ color: "white" }}>Token</Table.HeaderCell>
                            <Table.HeaderCell style={{ color: "white" }}>Balance</Table.HeaderCell>
                            <Table.HeaderCell style={{ color: "white" }}>Balance in BUSD</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Top10 Token</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.defiTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>-</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Bitcoin (BTC)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.btcTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.btcTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Ethereum (ETH)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ethTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ethTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Shiba Ibu (SHIB)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.shibaTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.shibaTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Ripple (XRP)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xrpTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.xrpTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Litecoin (LTC)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ltcTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.ltcTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Dai (DAI)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.daiTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.daiTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Maker (MKR)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.makerTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.makerTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Chainlink (LINK)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.linkTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.linkTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Uniswap (UNI)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.uniTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.uniTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Aave (AAVE)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.aaveTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.aaveTokenBalanceBnb}</Table.Cell>
                          </Table.Row>

                        
                        </Table.Body>
                      </Table>

                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Column>

            <Grid.Column>
              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{ color: "white" }}>
                      <p style={{ color: "#C0C0C0", "font-weight": "bold", "text-align": "right" }}>APY: YY%</p>
                      Top 5 Metaverse Tokens
                      </Card.Header>
                    <Card.Description>
                      <p style={{ color: "#C0C0C0" }}>Rate: In return of investing 1 BNB you will receive 1 META Token.</p>

                      <Form onSubmit={this.investNFTMainnet}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to create" name="nftToMintMainnet" onChange={this.handleInputChange}></Input>
                        <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Create</Button>
                      </Form>

                      <Form onSubmit={this.withdrawNFTMainnet}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="META amount to redeem" name="withdrawValueNFT" onChange={this.handleInputChange}></Input>
                        <Button color="green" style={{ margin: "20px", width: "150px" }}>Redeem</Button>
                      </Form>

                      <Table style={{ "margin-left": "auto", "margin-right": "auto" }} basic='very' celled collapsing>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell style={{ color: "white" }}>Token</Table.HeaderCell>
                            <Table.HeaderCell style={{ color: "white" }}>Balance</Table.HeaderCell>
                            <Table.HeaderCell style={{ color: "white" }}>Balance in BUSD</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body >
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Metaverse Token</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.nftTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>-</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Axie Infinity (AXS)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.axsTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.axsTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Radio Caca (RACA)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.racaTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.racaTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>MOBOX (MBOX)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.mboxTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.mboxTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>Merit Circle (MC)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.mcTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.mcTokenBalanceBnb}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{ color: "#C0C0C0" }}>MyNeighborAlice (ALICE)</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.aliceTokenBalance}</Table.Cell>
                            <Table.Cell style={{ color: "#C0C0C0" }}>{this.state.aliceTokenBalanceBnb}</Table.Cell>
                          </Table.Row>

                        </Table.Body>
                      </Table>

                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>

            </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>
      }

    return (
      <div className="App">
        <br></br>

        <Image src={velvet} size="medium" verticalAlign='middle'></Image>


        {button}
        {buttonSwitch}
        
        {mainnet}
        
        {testnet}

      </div >
    );
  }
}

export default App;
