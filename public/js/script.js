
function submitData()
{
   return true;
    var Tshirt = document.getElementById("txtTshirt").value;
    var Jacket = document.getElementById("txtJacket").value;
    var Cap = document.getElementById("txtCap").value;
    var Name = document.getElementById("txtName").value;
    var Phone= document.getElementById("txtMobile").value; 
    var Email = document.getElementById("txtEmail").value;

    var Thsirtregex = /^[1-9]\d*$/
    var Jacketregex = /^[1-9]\d*$/
    var Capregex = /^[1-9]\d*$/ 
    var nameregex = /^[a-zA-Z ]+$/;
    var phoneregx = /^(\d{3})[\-](\d{3})[\-](\d{4})$/; //(format 123-123-1234)
    var Emailregex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //var postcoderegx = /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/;
    //var phoneregx = /^\(?(\d{3})\)?[\.\-\/\s]?(\d{3})[\.\-\/\s]?(\d{4})$/;

    //#region 
    var errors = '';
    if (Thsirtregex.test(Tshirt))
    {
        errors += '';
    }
    else 
    {
        errors += 'Tshirt qty is not in correct format <br>';
    }
    if (Jacketregex.test(Jacket))
    {
        errors += '';
    }
    else 
    {
        errors += 'Jacket qty is not in correct format <br>';
    }
    
    if (Capregex.test(Cap))
    {
        errors += '';
    }
    else 
    {
        errors += 'Cap qty is not in correct format <br>';
    }
    if (nameregex.test(Name))
    {
        errors += '';
    }
    else 
    {
        errors += 'Name is not in correct format <br>';
    }
    if (phoneregx.test(Phone))
    {
        errors += '';
    }
    else 
    {
        errors += 'Phone number is not in correct format <br>';
    }
    if (Emailregex.test(Email))
    {
        errors += '';
    }
    else 
    {
        errors += 'Email ID is not in correct format <br>';
    }
    //#endregion
    
    if (errors.trim() != '')
    {         
        document.getElementById('errors').innerHTML = errors + '--- Please solve the above errors ---';
        document.getElementById('errors').style.border = '2px solid red';
        document.getElementById('errors').style.margin = '50px'
        document.getElementById('errors').style.textAlign = 'center';
        document.getElementById('errors').style.backgroundColor = 'lightgray';
    }
    else
    { 
        errors = '';  
        document.getElementById('errors').innerHTML =errors ;
        document.getElementById('errors').style.borderWidth = '0';
        //alert("all data perfect");
        debugger
        document.write("<h1><center>Invoice</center></h1>");

        document.write('<table width="60%" align="center" border="1"');
        var Tax= 13; var TotalPrice = 0;
        var TshirtPrice = 15;
        var JacketPrice = 50;
        var CapPrice = 10;
        document.write(`<tr><th colspan=4><h3>Customer Details<h3></th></tr>`);
        document.write(`<tr><td colspan=4>Name: ${Name}</td></tr>`);
        document.write(`<tr><td colspan=4>Mobile No: ${Phone}</td></tr>`);
        document.write(`<tr><td colspan=4>Email-ID: ${Email}</td></tr>`);
        
        document.write(`<tr><th colspan=4><h3>Cart Summary<h3></th></tr>`);
        document.write(`<tr><th>Product Name</th><th>Price</th><th>Qty</th><th>Total Price</th></tr>`);

        var totTshirtPrice = Tshirt * TshirtPrice;
        var totJacketPrice = Jacket * JacketPrice;
        var totCapPrice = Cap * CapPrice;
        var totCost = 
        document.write (`<tr><td align=center>T-shirt</td> <td align=center>$ ${TshirtPrice}</td><td  align=center> ${Tshirt}</td><td align=center>$ ${totTshirtPrice}</td></tr>`);   
        document.write (`<tr><td align=center>Jacket</td> <td align=center>$ ${JacketPrice}</td><td  align=center> ${Jacket}</td><td align=center>$ ${totJacketPrice}</td></tr>`);   
        document.write (`<tr><td align=center>Cap</td> <td align=center>$ ${CapPrice}</td><td  align=center> ${Cap}</td><td align=center>$ ${totCapPrice}</td></tr>`);   

        totCost  = totTshirtPrice +  totJacketPrice + totCapPrice;
        var TaxPrice = (totCost * Tax) / 100 
        
        TotalPrice = totCost + TaxPrice ;
        document.write(`<tr><th colspan=4><h3>Price Summary<h3></th></tr>`);
        document.write (`<tr><td colspan=3>Total product cost before tax</td><td align=center>$ ${totCost.toFixed(2)}</td></tr>`);
        document.write (`<tr><td colspan=3>Total Tax</td><td align=center>$ ${TaxPrice.toFixed(2)}</td></tr>`);
        document.write (`<tr><td colspan=3>Total product cost with tax</td><td align=center>$ ${TotalPrice.toFixed(2)}</td></tr>`);
        document.write (`<tr><td colspan=4><a href="Index.html">Back to Home page<a/></td></tr>`);
        document.write('</table>');
        document.write("<h3><center>Thanks, your order has been placed.</center></h3>");
    }  
    return false;
}
function Reset()
{
    errors = '';  
    document.getElementById('errors').innerHTML =errors ;
    document.getElementById('errors').style.borderWidth = '0';
    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) 
    {
        if (elements[ii].type == "text") 
        {
            elements[ii].value = "";
        }
    }
}