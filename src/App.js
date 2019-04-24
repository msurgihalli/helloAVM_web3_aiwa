import React, { Component } from 'react';
import { Button, Form} from 'reactstrap';
import Web3 from 'aion-web3';
import './App.css';

class App extends Component {
    componentDidMount = () => {

        setInterval(
            //detect aiwa
            function() {
                if (window.aionweb3 ) {
                    this.setState({
                        aionweb3: window.aionweb3,
                        aiwa: true
                    });

                    try {
                        this.setState({
                            account:  window.aionweb3.account[0]
                        })
                    }catch(e) {
                        //console.error("no account", e.message);
                    }
                }

            }.bind(this),
            1000
        );


        setInterval(
            this.getFunction,
            1000
        );
    };

    constructor(props, context) {
        super(props);
        this.state = {
            aionweb3: null,
            aiwa: false,
            account: null, //user account,
            value: " ",
            result: ""
            //contract: null
        };
    }


    //send transaction to the smart contract
    sendTransactionFunction = async (mystring) => {

        //set web3
        let web3 = new Web3(
            new Web3.providers.HttpProvider("https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
            )
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        console.log("account is " + this.state.account);

        //contract address
        let ctaddress = "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2";

        //the contract method you want to call
        let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();



        const txObject = {
            from: this.state.account,
            to: ctaddress,
            data: data,
            gas: 2000000,
            type: "0x1"  //for java contract
        };

        try {
            const signedTx = await window.aionweb3.sendTransaction(txObject);
        } catch (err) {
            console.log(err);
        }
    };


    //call smart contract method
    getFunction = async () => {
        let web3 = new Web3(
            new Web3.providers.HttpProvider(
                "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
            )
        );

        let ctAddress =
            "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2";


        let privateKey =
            "bb3b642bbfab34fcf2ea79ee80bd97d2c109ab13f5c8ccfec787f56e60f34ca7c0d4e3868869f4e734d18f147c16ae1336b1c9bd7d7890ee981e48933aa5604c";
        let acc = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log("account " +acc.address);
        let data = web3.avm.contract.method('getString').encode();

        let txObject = {
            from: acc.address,
            to: ctAddress,
            gas: 100000,
            gasPrice: 1,
            data: data
        };

        try {
            let res = await web3.eth.call(txObject); //call a method
            console.log("call succsess");
            let returnValue = await web3.avm.contract.decode('string', res);
            console.log("get " + returnValue);
            this.setState({
                result: returnValue
            });
        } catch (err) {
            console.log("fail calling");
        }
    };

    //get user input
    handleChange = event => {
        this.setState({ value: event.target.value });
    };


    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        this.sendTransactionFunction(this.state.value);
        event.preventDefault();
    };

    render() {
        return (
            <div >
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <label>
                            Set String:
                            <input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </label>
                        <Button type="submit" value="Submit">
                            Submit
                        </Button>
                    </Form>

                    <h1>Current String: {this.state.result}</h1>

                </div>
            </div>
        );
    }
}

export default App;
