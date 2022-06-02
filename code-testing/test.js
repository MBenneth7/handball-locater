// //FUNCTION TO REMOVE ANY EXTRA CHARACTERS AND UNECESSARY WORDS AND PROPERLY CASE THEM

function caseString(str){
    //ARRAY TO CONTAIN STRINGS THAT WE DON'T WANT IN NAME
    let invalidStr = ['P/G','('];
    //DEFAULT SETTING FOR 'end' VARIABLE
    let end = str.length;
    //SETTING OUR 'newStr' TO A STRING W/O UNECCESARY SPACES (GLOBAL REGEX)
    let newStr = str.replace(/\s+/g, '');


    //LOOP TO FIND IF UNWANTED STRINGS ARE PRESENT IN THE CURRENT STRING
    for(let i = 0; i <invalidStr.length; i++){
        if(str.indexOf(invalidStr[i]) !== -1){
            //IF FOUND, SET THE LENGTH OF THE STRING TO END BEFORE THE UNCESSARY STRING
            end = str.indexOf(invalidStr[i]);
            break;
        }
    }

    //'newStr' WILL NOW BE THE STRING W/O THE UNWANTED STRING IN ITS NAME
    newStr = str.slice(0,end);

    //SPLITTING THE STRINGS TO UPPERCASE FIRST CH AND LOWERCASE NEXT SET OF CH
    newStr = newStr.toLowerCase().split(' ');
    for (let i = 0; i < newStr.length; i++) {
      newStr[i] = newStr[i].charAt(0).toUpperCase() + newStr[i].slice(1); 
    }

    //IF WE DIDN'T FIND ANY UNWANTED STRING AND THE STRING 'PARK' IS PRESENT AND THE STRING 'PLAYGROUND' IS PRESENT
    //JOIN THE CH'S TOGETHER W/ 'Park'
    //ELSE JUST RETURN THE MUTATED STRING W/FIRST CH CAPITALIZED
    if(end!==str.length && newStr.indexOf('Park') === -1 && newStr.indexOf('Playground') === -1)
        return newStr.join(' ') + 'Park';
    else
        return newStr.join(' ');
}

console.log(caseString('POMONOK P/G(PS 201)'));
console.log(caseString('Maria Hernandez Park'));
console.log(caseString("ANNADALE PLAYGROUND(PS 175)"));
console.log(caseString("McDonald Playground"));
console.log(caseString("QUEENSBRIDGE\ BABY\ PARK"));
console.log(caseString('SOUTH ROCHDALE P/G(PS 80)'));
console.log(caseString("Terrace Park (P.S. 35)"));
console.log(caseString("Beach 105th St. Courts"));
console.log(caseString("BEACH 59TH ST P/G"));
