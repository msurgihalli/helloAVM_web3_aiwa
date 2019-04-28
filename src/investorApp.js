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

        setInterval(
          this.getFunction,
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
            propertyOwner : '',
            propertyValue : '',
            propertyLocation : '',
            propertyBuyerKyc : '',
            propertyBuyerCreditScore : '',
            propertyBuyerIncome : '',
            propertyLoanRequested : '',
            mortgageMonthlyPayment : '',

            result: "",
            // ctAddress: "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2", //contract address,
            // httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
            ctAddress: "0xa0df8ee838b44605b96c03a2f5a92d66cbddedd4c93f9e3af2e0438aaceec799", //contract address,
            httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=3e88992ccd3741109cd484b57cf293aa"
        };
    }


    //send transaction to the smart contract
    sendTransactionFunction = async (mystring) => {

        //set web3
        let web3 = new Web3(
          new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[1]
            })
        } catch(e) {
            console.error("**** no account for sending - ", e.message);
        }

        //the contract method you want to call
        let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();

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

        let txObject = {
            from:this.account,
            to: this.state.ctAddress,
            gas: 100000,
            gasPrice: 1,
            data: data
        };

        try {
            let res = await web3.eth.call(txObject); //call a method
            let returnValue = await web3.avm.contract.decode('string', res);
            this.setState({
                result: returnValue
            });
        } catch (err) {
            console.log("fail calling");
        }
    };

    handleChange = (propName, event) => {
        console.log(propName+' - '+event.target.value);
        this.setState({ [propName]: event.target.value });
        //     this.setState({ propName : event.target.value });
        //     this.setState({ value: event.target.value });
    };

    handleSubmit = event => {
        let input = {
            propertyOwner : this.state.propertyOwner,
            propertyValue : this.state.propertyValue,
            propertyLocation : this.state.propertyLocation,
            propertyBuyerKyc : this.state.propertyBuyerKyc,
            propertyBuyerCreditScore : this.state.propertyBuyerCreditScore,
            propertyBuyerIncome : this.state.propertyBuyerIncome,
            propertyLoanRequested : this.state.propertyLoanRequested,
            mortgageMonthlyPayment : this.state.mortgageMonthlyPayment,
        };
        console.log(this.state.propertyOwner)
        alert('A name was submitted: ' + JSON.stringify(input));

        this.sendTransactionFunction(JSON.stringify(input));
        // this.sendTransactionFunction(this.state.propertyOwner);
        event.preventDefault();
    };
    //
    // //get user input
    // handleChange = event => {
    //     this.setState({ value: event.target.value });
    // };
    //
    // handleSubmit = event => {
    //     //alert('A name was submitted: ' + this.state.value);
    //     this.sendTransactionFunction(this.state.value);
    //     event.preventDefault();
    // };

    render() {
        return (
          <div >
              <div>
                  {/*<Form onSubmit={this.handleSubmit}>*/}
                  {/*    <label>*/}
                  {/*        Set String:*/}
                  {/*        <input*/}
                  {/*          type="text"*/}
                  {/*          value={this.state.value}*/}
                  {/*          onChange={this.handleChange}*/}
                  {/*        />*/}
                  {/*    </label>*/}
                  {/*    <Button type="submit" value="Submit">*/}
                  {/*        Submit*/}
                  {/*    </Button>*/}
                  {/*</Form>*/}

                  {/*<h1>Current String: {this.state.result}</h1>*/}

                  <section id="contact">
                      <div className="container">
                          <Form onSubmit={this.handleSubmit}>
                          <div className="row">
                              <div className="col-lg-12 text-center">
                                  <h2 className="section-heading text-uppercase">List This Token</h2>
                              </div>
                          </div>
                          <div id="mainNav"></div>
                          <div className="row">
                              <div className="col-lg-12">
                                      <div className="row">
                                          <div className="col-md-6">
                                              <div className="form-group">
                                                  <input className="form-control" id="tokenValue" type="number"
                                                         placeholder="Value *" required="required"
                                                         // data-validation-required-message="Please enter your name."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="row">
                                          <h3 className="section-subheading text-muted col-md-6">Property
                                              Information</h3>
                                          <h3 className="section-subheading text-muted col-md-6">Buyer Info
                                              Number</h3>
                                      </div>
                                      <div className="row">
                                          <div className="col-md-6">
                                              <div className="form-group">
                                                  <input className="form-control" id="propertyOwner" type="text"
                                                         placeholder="Currenty Property Owner *" required="required"
                                                         onChange={this.handleChange.bind(this, 'propertyOwner')} name={this.state.propertyOwner}
                                                         // data-validation-required-message="Please enter your name."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                              <div className="form-group">
                                                  <input className="form-control" id="propertyValue" type="number"
                                                         placeholder="Property Value *" required="required"
                                                         onChange={this.handleChange.bind(this, 'propertyValue')} name={this.state.propertyValue}
                                                         // data-validation-required-message="Please enter your email address."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                              <div className="form-group">
                                                  <input className="form-control" id="location" type="text"
                                                         placeholder="Location *" required="required"
                                                         // data-validation-required-message="Please enter your phone number."
                                                         onChange={this.handleChange.bind(this, 'propertyLocation')} name={this.state.propertyLocation}
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                          </div>
                                          <div className="col-md-6">
                                              <div className="form-group">
                                                  <input className="form-control" id="buyerKYC" type="text"
                                                         placeholder="Buyer KYC - hash of the KYC info (name, address, etc.) *"
                                                         required="required"
                                                         onChange={this.handleChange.bind(this, 'propertyBuyerKyc')} name={this.state.propertyBuyerKyc}
                                                         // data-validation-required-message="Please enter your name."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                              <div className="form-group">
                                                  <input className="form-control" id="buyerCreditScore" type="number"
                                                         placeholder="Buyer Credit Score *" required="required"
                                                         onChange={this.handleChange.bind(this, 'propertyBuyerCreditScore')} name={this.state.propertyBuyerCreditScore}
                                                         // data-validation-required-message="Please enter your email address."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                              <div className="form-group">
                                                  <input className="form-control" id="buyerIncome" type="number"
                                                         placeholder="Buyer Income *" required="required"
                                                         onChange={this.handleChange.bind(this, 'propertyBuyerIncome')} name={this.state.propertyBuyerIncome}
                                                         // data-validation-required-message="Please enter your phone number."
                                                  />
                                                  <p className="help-block text-danger"></p>
                                              </div>
                                          </div>
                                          <div className="clearfix"></div>
                                          <div className="col-lg-12 text-center">
                                              <div id="success"></div>
                                              {/*<button id="sendMessageButton"*/}
                                              {/*        className="btn btn-secondary btn-xl text-uppercase"*/}
                                              {/*        type="submit">Purchase This Mortgage*/}
                                              {/*</button>*/}

                                              <Button id="sendMessageButton"
                                                      className="btn btn-secondary btn-xl text-uppercase" type="submit" value="Submit">
                                                  Purchase This Mortgage
                                              </Button>

                                          </div>
                                      </div>
                              </div>
                          </div>
                          </Form>

                      </div>
                  </section>


              </div>
          </div>
        );
    }
}

export default App;
