import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
var DataTable = require('react-data-components').DataTable;
require('react-data-components/css/table-twbs.css');
require('./index.css');

var columns = [
  { title: 'Bank Name', prop: 'bank_name'  }  
];

class City extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'JAIPUR',
            bankNames : {}
        };
    }

    handleChange= (event) => {
        this.setState({value: event.target.value});
        let city = event.target.value;
        this.fetchdata({city})   
    }
    
    fetchdata = ({city}) => {

        //check whether the corresponding city data is present in Cache memory
        if(!this.state.bankNames[city]){
            // if data is not present in the Cache memory, fetch the required data and add it to the cache

            fetch(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
            .then((response)=> response.json())
            .then(finalResponse => {
                const data = finalResponse.map(item => {
                    return item;
                })

                // use lodash package for filtering the data uniquely with bank_name
                const bankNames = _.uniqBy(data, 'bank_name' );
                
                // extracting bank name column
                const uniqueBankList = bankNames.map(item => {
                return {'bank_name': item.bank_name}
                })

                // and then adding only finalBankLink into the state object with a key name bankNames
                // which contains the name of required city as the keyname
                const finalBankList = {...this.state.bankNames};
                finalBankList[city] = uniqueBankList
                this.setState({
                bankNames: finalBankList
                })
            }) // fetch and then - finish
        }   
    } // fetchdata() - finish

    componentDidMount(){
      let city = 'JAIPUR';
      this.fetchdata({city})
    }

    render() {
        let city = this.state.value;
        return (
            <section className="container" id="bank">
                <form className="mt-4" id="cityForm">
                    <label htmlFor="citySelection" >	 Pick your favorite city : </label>
                    <select id="citySelection" value={this.state.value} onChange={this.handleChange}>
                        <option value="JAIPUR">JAIPUR</option>
                        <option value="DELHI">DELHI</option>
                        <option value="PUNE">PUNE</option>
                        <option value="MUMBAI">MUMBAI</option>
                        <option value="BANGALORE">BANGALORE</option>
                    </select>
                </form>

                <DataTable
                    className="container"
                    keys="bank_name"
                    columns={columns}
                    initialData={this.state.bankNames[city]}
                    initialPageLength={10}
                    initialSortBy={{ prop: 'bank_name', order: 'ascending' }}
                    pageLengthOptions={[ 10, 15, 20 ]}
                />
            </section>
        );
    } // render() - finish
}

ReactDOM.render(<City / > , document.getElementById('root'));