import React from 'react'

class Header extends React.Component{
    constructor(props){
        super(props)
    }
    createSelectItems() {
        const thisYear = new Date().getFullYear()
        let items = [];      
        for (let i = 0; i <= 5; i++) {             
             items.push(<option key={i} value={thisYear-i}>{thisYear-i}</option>);              
        }        
        return items;
    } 
    onDropdownSelected=(e)=> {        
        this.props.setYear(e.target.value)        
    }

    render(){
        return(
            <header>
            <nav>
              <div className="mv-header mv-align-center">
              <i className="fas fa-film fa-3x"></i><h1>Hit Movie Searcher</h1>
                <select onChange={this.onDropdownSelected} >{this.createSelectItems()}</select>
              </div>
            </nav>
          </header>
        )
    }
}

export default Header