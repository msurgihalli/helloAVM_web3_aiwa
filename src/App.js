import React, { Component } from 'react';
import { Button, Form} from 'reactstrap';
import Web3 from 'aion-web3';
import './App.css';

class App extends Component {
    componentDidMount = () => {

        setInterval(
            function() {
                if (window.aionweb3 ) {
                    this.setState({
                        aionweb3: window.aionweb3, //detect aiwa
                    });

                }

            }.bind(this),
            1000
        );

     };

    constructor(props) {
        super(props);
        this.state = {
            aionweb3: null,
            aiwa: false,
            account: null, //user account,
            value: " ",
            toAddr :"",
            result: "",
            // ctAddress: "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2", //contract address,
            // httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
            ctAddress: "0xa06e0e2f240e67866638587fca2bfe4f5bedec8f091c5d6155f2015b748b2182", //contract address,
            httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=3e88992ccd3741109cd484b57cf293aa"
        };
    }


    //send transaction to the smart contract
    sendTransactionFunction = async (mystring, tostring) => {

        //set web3
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        //the contract method you want to call
        // let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();
        // alert('A name was submitted: ' + mystring+' - '+ tostring);
        // let data = web3.avm.contract.method('setString').inputs(['string', 'string'],[mystring, tostring]).encode();
        let strData =  'propertyOwner'+'-'+'propertyValue'+'-'+'propertyLocation'+'-'+'propertyBuyerKyc'+'-'+'propertyBuyerCreditScore'+'-'+'propertyBuyerIncome'+'-'+'propertyLoanRequested'+'-'+'mortgageMonthlyPayment'
        let data = web3.avm.contract.method('setString').inputs(['string'],[strData ]).encode();

        const txObject = {
            from: this.state.account,
            to: this.state.ctAddress,
            data: data,
            gas: 2000000,
            type: "0x1"  //for any transaction except for java contract deployment
        };

        try {
             await window.aionweb3.sendTransaction(txObject);
        } catch (err) {
            console.log(err);
        }
    };


    //call smart contract method
    getFunction = async () => {
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        let data = web3.avm.contract.method('getString').encode();
        // let data = web3.avm.contract.method('getPropertyObj').encode();

        let txObject = {
            from:this.account,
            to: this.state.ctAddress,
            gas: 100000,
            gasPrice: 1,
            data: data
        };

        try {
            let res = await web3.eth.call(txObject); //call a method
            let propertyBuyer = await web3.avm.contract.decode('string', res);
            // let PropertyBuyer = await web3.avm.contract.decode('string', res);
            this.setState({
                result: propertyBuyer
            });
        } catch (err) {
            console.log("fail calling");
        }
    };

    //get user input
    handleChange = event => {
        this.setState({ value: event.target.value});
    };

    handleChange2 = event => {
        this.setState({ toAddr: event.target.value});
    };

    handleSubmit = event => {
        // alert('A name was submitted: ' + this.state.value+' - '+ this.state.toAddr);
        this.sendTransactionFunction(this.state.value, this.state.toAddr);

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
                            <input
                                type="text"
                                value={this.state.toAddr}
                                onChange={this.handleChange2}
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
