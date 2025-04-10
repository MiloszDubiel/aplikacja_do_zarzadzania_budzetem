import React from "react";
import { IoIosRemove } from "react-icons/io";
const TransactionCell = ({el, deleteRecord, formatDate}) =>{
    
const tableCells = el.map(el =>{

    return (
        <tr>
            <td>
                <p>{el.name}</p>
            </td>
            <td>{formatDate(el.transaction_date)}</td>
            <td>
                {el.type == "Wydatki" ? <span className="status spend">{el.type}</span>	: <span className="status incom">{el.type}</span>	}
            </td>
            <td>{el.description}</td>
            <td>{el.amount}zł</td>
            <td><button className="delete-record" onClick={()=> deleteRecord(el)}><IoIosRemove /></button></td>
        </tr>
    )
    })
    return tableCells

}

export default TransactionCell