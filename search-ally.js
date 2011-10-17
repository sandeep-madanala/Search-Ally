// ==UserScript==
// @name           Search Assist
// @namespace      myspace.org
// @description    for a better search
// @include        http://*
// ==/UserScript==
// authors	   Sandeep Kumar , Abhinay Sama , Praneel Raja

function findPos(id)
{
    var off=document.getElementById(id);
    var curleft = curtop = 0;
    if (off.offsetParent) {
    curleft = off.offsetLeft;
    curtop = off.offsetTop;
    while (off=off.offsetParent) {
        curleft += off.offsetLeft;
        curtop += off.offsetTop;
    }
    }
    return [curleft,curtop];
}
function open_new_window(parent,x)
{
    placement = findPos(parent);
    placement[0] = placement[0] + 450;
    placement[1] = placement[1] + 200;
    new_window = open("","hoverwindow","width=450,height=200,left="+placement[0]+",top="+placement[1]+",toolbar=no,menubar=no,scrollbars=no");

    // open new document
    new_window.document.open();
   
    // Text of the new document
    // Replace your " with ' or \" or your document.write statements will fail

    new_window.document.write(x);

    // close the document

    new_window.document.close();
}


    // This is the function that will close the
    // new window when the mouse is moved off the link/*
function close_window()
{
    new_window.close();
}

function findcommon(list)
{
    var commons = [];
    var word;
   
    var i,j,k,c=0;
   
    for(i=0;i<list.length;i++)
    {

        var words = list[i].split(' ');
   
        for(j=words.length;j>=1;j--)
        {
            for(h=0;h<=words.length-j;h++)
            {
            word = words[h];
            for(k=h+1;k<j+h;k++)
                word = word + " " + words[k];
            commons[c] = word + ':' + i;
            var bit = 0;
            for(k=i;k<list.length;k++)
            {
                if( k!=i && ( list[k] == word || list[k].match(word) == word ) )
                {
                    commons[c] = commons[c] + ',' + k;
                    bit = 1;
                }
            }
            if( bit==1 )
                c++;
            }
        }
   
    }
   
    for(i=c-1;i>=0;i--)
    {
        word = commons[i].split(':')[0];
        k = commons[i].split(':')[1].split(',').length;
        for(j=i-1;j>=0;j--)
            if( commons[j].match(word) == word && k <= commons[j].split(':')[1].split(',').length )
            {
                commons[i] = "";
                j=-1;
            }
    }
   

    for(i=0,j=c-1;i<=j;)
    {
        for(;commons[j]=="" && j>=0;j--);
        for(;commons[i]!="" && i<c;i++);
   
        if( i<=j )
        {
            var temp = commons[i];
            commons[i] = commons[j];
            commons[j] = temp;
        }
    }
   

    j=0;
    for(i=1;i<c &commons[i]!="";i++)
    {
        if (commons[j].split(':')[1].split(',').length < commons[i].split(':')[1].split(',').length)
            j=i;
    }
    var totalcommon = "";
        totalcommon = commons[0].split(':')[0] + " , " + commons[i].split(':')[0];
    return totalcommon;
   
}
   
function testfunc()
{
    alert("test funch");
}

// The url currently in
var url = new String(window.location.host).toLowerCase();

var ulink = window.location.href;

if( GM_getValue("count-"+ulink,-1)==-1)
{
   // alert("NEW");
    GM_setValue("count-"+ulink,1);
}
else
{
    GM_setValue("count-"+ulink,1+parseInt(GM_getValue("count-"+ulink,0)));
 //   alert(GM_getValue("count-"+ulink));
}
// If search is yahoo!
if(url == 'in.search.yahoo.com')
{

    var searchtxt = document.getElementById('yschsp').value;    // The search query

    var links = document.getElementsByClassName('yschttl spt');    // Links of all search results
    var value;            // Stores the value for keys
    var sel_queries = [];        // List of all selected queries
    var tot_queries = [];        // List of total queries

    for(var i = 0; i < links.length; i++)        // For every link in the result
    {
        var a = links[i];

        value = GM_getValue(a,-1);        //If it is already a result of some previous search  

        if(value == -1)                // If it was never a result of previous searches
        {
            GM_setValue(a,searchtxt);    // Add it into the DB
            sel_queries[i] = "No. of visits : " + GM_getValue("count-"+a,0);
            sel_queries[i] = sel_queries[i] + "    Frequent sub queries :  ";
            tot_queries[i] = "<html><body bgcolor='violet'><h4> Previous queries with the same result : </h4><br/>";
            tot_queries[i] = tot_queries[i] + "</body></html>";
        }
        else                   
        {
            var j;

            var values = value.split("|");
           
            sel_queries[i] = "No. of visits : " + GM_getValue("count-"+a,0);
            sel_queries[i] = sel_queries[i] + "    Frequent sub queries :  ";

            tot_queries[i] = "<html><body bgcolor='violet'><h4> Previous queries with the same result : </h4><br/>";
            for(j = 0;j<values.length;j++)
            {
                tot_queries[i] = tot_queries[i] + "" + values[j] + " ,<br/> ";
               
            }
            tot_queries[i] = tot_queries[i] + "</body></html>";
            if(values.length >= 2)
            {

                sel_queries[i] = sel_queries[i] + findcommon(values);

            }
            else
            {
                sel_queries[i] = sel_queries[i] + values[0];
            }

            for(j = 0;j<values.length;j++)
            {
                if( values[j] == searchtxt )
                break;
            }
           
            if( j == values.length )
            {
                var t = value + "|" + searchtxt;
                GM_setValue(a,t);
            }
        }
}


var test = document.getElementsByClassName('res');

for(var i = 0; i < test.length; i++)
{
    var dynDiv = document.createElement("div");
        dynDiv.id = "divDyna";
        dynDiv.innerHTML = sel_queries[i];
        dynDiv.style.height = "17px";
        dynDiv.style.width = "300px"; 
        dynDiv.style.backgroundColor = 'silver';
    test[i].appendChild(dynDiv);
    var x = tot_queries[i];
//    alert(x);
    dynDiv.addEventListener("mouseover",function(){open_new_window("divDyna",x)},false);
    dynDiv.addEventListener("mouseout",close_window,false);   

}



}
