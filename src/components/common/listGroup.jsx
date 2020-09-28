import React from 'react';

const ListGroup = (props) => {

    const {items,textProperty,valueProperty,onItemSelect,selectedItem}=props
    return (
        <React.Fragment>
        <ul className="list-group clickable">
            {items.map(item=><li 
            key={item[valueProperty]}
            onClick={()=>onItemSelect(item[valueProperty])} 
            className={item[valueProperty]===selectedItem?"list-group-item active":"list-group-item"}>{item[textProperty]}</li>)}
        </ul>
        </React.Fragment>
    );
}

ListGroup.defaultProps={
    textProperty:"name",
    valueProperty:"_id"
}
 
export default ListGroup;
