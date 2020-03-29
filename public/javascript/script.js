// Updates check-list icons on create blog page
$('#title').keyup(function (e) { 
    if(this.value.length > 0){
        $('#step-1').attr('class', 'completed step');
    }else{
        $('#step-1').attr('class', 'active step');
    }
});

$('#url').keyup(function (e) { 
    if(this.value.length > 0){
        $('#step-2').attr('class', 'completed step');
    }else{
        $('#step-2').attr('class', 'active step');
    }
});

$('#body').keyup(function (e) { 
    if(this.value.length > 0){
        $('#step-3').attr('class', 'completed step');
    }else{
        $('#step-3').attr('class', 'active step');
    }
});

function gohome(){
    window.location.href = "/";
    document.querySelector('#par').innerText = users[0];
};

function create(){
    window.location.href = "/blogs/new";
};

$('#show-hide-pass').click(()=>{
    let field = $('#password')[0];
    field.type === 'password' ? field.type = 'text': field.type = 'password';
    $('#show-hide-pass').toggleClass('slash');
});

/**
 * Capitalizes a users name 
 * eg. john smith -> John Smith
 * @param {String} name 
 */
function namilize(name){
    name.toLowerCase();
    let n = [];
    let array = name.split(' ');
    array.forEach((part)=>{
        n.push(part.charAt(0).toUpperCase() + 
        part.slice(1))
    });

    return n.join(" ");
};